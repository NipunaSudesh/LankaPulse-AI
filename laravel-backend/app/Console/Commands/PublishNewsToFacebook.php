<?php

namespace App\Console\Commands;

use App\Models\FacebookPost;
use App\Models\NewsArticle;
use App\Services\FacebookPagePublisher;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class PublishNewsToFacebook extends Command
{
    protected $signature = 'news:publish-facebook
                            {--limit= : Maximum posts to publish}
                            {--dry-run : Preview without publishing}';

    protected $description = 'Publish news articles with images to Facebook Page';

    public function handle(FacebookPagePublisher $facebook): int
    {
        if (!config('services.facebook.auto_publish')) {
            $this->warn('Facebook auto-publishing is disabled.');
            return self::SUCCESS;
        }

        $dailyLimit = max(1, (int) config('services.facebook.daily_limit', 3));

        $publishedToday = NewsArticle::whereNotNull('facebook_published_at')
            ->whereDate('facebook_published_at', today())
            ->count();

        $remaining = max(0, $dailyLimit - $publishedToday);

        if ($remaining === 0) {
            $this->info('Daily Facebook publishing limit reached.');
            return self::SUCCESS;
        }

        $requestedLimit = $this->option('limit')
            ? max(1, (int) $this->option('limit'))
            : $dailyLimit;

        $limit = min($remaining, $requestedLimit);

        $maxAge = max(1, (int) config('services.facebook.max_article_age_hours', 48));

        $articles = NewsArticle::query()
            ->where('facebook_publish_status', 'pending')
            ->whereNull('facebook_post_id')
            ->whereNotNull('image_url')
            ->whereNotNull('url')
            ->where('created_at', '>=', now()->subHours($maxAge))
            ->orderByDesc('created_at') // newest first
            ->limit($limit)
            ->get();

        if ($articles->isEmpty()) {
            $this->info('No eligible articles with images found.');
            return self::SUCCESS;
        }

        if ($this->option('dry-run')) {
            $this->info('Dry run: ' . $articles->count() . ' article(s) found.');

            foreach ($articles as $article) {
                $this->line("Title: {$article->title}");
                $this->line("Image: {$article->image_url}");
                $this->line("URL: {$article->url}");
                $this->newLine();
            }

            return self::SUCCESS;
        }

        $success = 0;
        $failed = 0;

        foreach ($articles as $article) {
            $claimed = NewsArticle::query()
                ->whereKey($article->id)
                ->where('facebook_publish_status', 'pending')
                ->whereNull('facebook_post_id')
                ->update([
                    'facebook_publish_status' => 'publishing',
                    'facebook_error' => null,
                ]);

            if (!$claimed) {
                continue;
            }

            try {
                $caption = $this->buildCaption($article);

                $postId = $facebook->publishPhotoPost($article->image_url, $caption);

                $article->forceFill([
                    'facebook_post_id' => $postId,
                    'facebook_published_at' => now(),
                    'facebook_publish_status' => 'published',
                    'facebook_error' => null,
                ])->save();

                FacebookPost::create([
                    'news_article_id'  => $article->id,
                    'facebook_post_id' => $postId,
                    'message'          => $caption,
                    'post_url'         => 'https://www.facebook.com/' . $postId,
                    'status'           => 'published',
                    'published_at'     => now(),
                ]);

                $success++;

                $this->info("Published: {$article->title}");
                $this->line("Post ID: {$postId}");
            } catch (Throwable $e) {
                $article->forceFill([
                    'facebook_publish_status' => 'failed',
                    'facebook_error' => mb_substr($e->getMessage(), 0, 5000),
                ])->save();

                Log::error('Facebook publishing failed', [
                    'article_id' => $article->id,
                    'error' => $e->getMessage(),
                ]);

                $failed++;
                $this->error("Failed: {$article->title}");
                $this->error($e->getMessage());
            }
        }

        $this->newLine();
        $this->info("Published: {$success}");
        $this->info("Failed: {$failed}");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }

private function buildCaption(NewsArticle $article): string
{
    $titleSi = $this->cleanText($article->title_si);
    $titleEn = $this->cleanText($article->title);

    $contentSi = $this->cleanText(
        $article->summary_si ?: $article->content_si
    );

    $contentEn = $this->cleanText(
        $article->summary ?: $article->content
    );

    // Fallback when one language is unavailable.
    $titleSi = $titleSi ?: $titleEn;
    $titleEn = $titleEn ?: $titleSi;

    $contentSi = $contentSi ?: $contentEn;
    $contentEn = $contentEn ?: $contentSi;

    $caption = "📰 {$titleSi}";

    if ($contentSi !== '') {
        $caption .= "\n\n" . mb_strimwidth(
            $contentSi,
            0,
            700,
            '...',
            'UTF-8'
        );
    }

    $caption .= "\n\n━━━━━━━━━━━━━━\n\n";

    $caption .= "🇬🇧 {$titleEn}";

    if ($contentEn !== '') {
        $caption .= "\n\n" . mb_strimwidth(
            $contentEn,
            0,
            700,
            '...',
            'UTF-8'
        );
    }

    if ($article->source_name) {
        $caption .= "\n\nමූලාශ්‍රය / Source: {$article->source_name}";
    }

    $caption .= "\n\nසම්පූර්ණ පුවත / Read more: {$article->url}";

    $caption .= "\n\n#LankaPulseAI #SriLankaNews #ශ්‍රීලංකාපුවත්";

    return $caption;
}

private function cleanText(?string $value): string
{
    $text = html_entity_decode(
        strip_tags((string) $value),
        ENT_QUOTES | ENT_HTML5,
        'UTF-8'
    );

    return preg_replace('/\s+/u', ' ', trim($text)) ?? '';
}

}