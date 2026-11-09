<?php

namespace App\Console\Commands;

use App\Models\FacebookPost;
use App\Models\NewsArticle;
use App\Services\FacebookCaptionBuilder;
use App\Services\FacebookGraphicGenerator;
use App\Services\FacebookPagePublisher;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class PublishNewsToFacebook extends Command
{
    protected $signature = 'news:publish-facebook
                            {--limit= : Maximum posts to publish}
                            {--dry-run : Preview without publishing}';

    protected $description = 'Publish branded news graphics to Facebook';

    public function handle(
        FacebookPagePublisher $facebook,
        FacebookGraphicGenerator $graphics,
        FacebookCaptionBuilder $captions
    ): int {
        if (!config('services.facebook.auto_publish')) {
            $this->warn('Facebook auto-publishing is disabled.');
            return self::SUCCESS;
        }

        $dailyLimit = max(
            1,
            (int) config('services.facebook.daily_limit', 3)
        );

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

        $maxAge = max(
            1,
            (int) config('services.facebook.max_article_age_hours', 48)
        );

        $articles = NewsArticle::query()
            ->where('facebook_publish_status', 'pending')
            ->whereNull('facebook_post_id')
            ->whereNotNull('image_url')
            ->whereNotNull('url')
            ->where('created_at', '>=', now()->subHours($maxAge))
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        if ($articles->isEmpty()) {
            $this->info('No eligible articles found.');
            return self::SUCCESS;
        }

        if ($this->option('dry-run')) {
            foreach ($articles as $article) {
                $this->line("ID: {$article->id}");
                $this->line("Title: {$article->title}");
                $this->line("Image: {$article->image_url}");
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

            $graphicPath = null;

            $post = FacebookPost::firstOrNew([
                'news_article_id' => $article->id,
            ]);

            try {
                $caption = $captions->build($article);

                $post->fill([
                    'message' => $caption,
                    'status' => 'publishing',
                    'error_message' => null,
                ]);

                $post->save();

                $graphicPath = $graphics->generate($article);

                $postId = $facebook->publishPhotoFile(
                    $graphicPath,
                    $caption
                );

                $article->forceFill([
                    'facebook_post_id' => $postId,
                    'facebook_published_at' => now(),
                    'facebook_publish_status' => 'published',
                    'facebook_error' => null,
                ])->save();

                $post->update([
                    'facebook_post_id' => $postId,
                    'post_url' => 'https://www.facebook.com/' . $postId,
                    'status' => 'published',
                    'published_at' => now(),
                    'error_message' => null,
                ]);

                $success++;

                $this->info("Published: {$article->title}");
                $this->line("Facebook ID: {$postId}");
            } catch (Throwable $e) {
                $article->forceFill([
                    'facebook_publish_status' => 'failed',
                    'facebook_error' => mb_substr(
                        $e->getMessage(),
                        0,
                        5000
                    ),
                ])->save();

                $post->update([
                    'status' => 'failed',
                    'error_message' => mb_substr(
                        $e->getMessage(),
                        0,
                        5000
                    ),
                ]);

                Log::error('Facebook publishing failed', [
                    'article_id' => $article->id,
                    'error' => $e->getMessage(),
                ]);

                $failed++;

                $this->error("Failed: {$article->title}");
                $this->error($e->getMessage());
            } finally {
                if ($graphicPath && file_exists($graphicPath)) {
                    @unlink($graphicPath);
                }
            }
        }

        $this->newLine();
        $this->info("Published: {$success}");
        $this->info("Failed: {$failed}");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}