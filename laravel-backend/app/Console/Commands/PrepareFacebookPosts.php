<?php

namespace App\Console\Commands;

use App\Models\FacebookPost;
use App\Models\NewsArticle;
use Illuminate\Console\Command;

class PrepareFacebookPosts extends Command
{
    protected $signature = 'news:prepare-facebook
                            {--limit=20 : Maximum number of posts to prepare}';

    protected $description = 'Prepare bilingual news articles as Facebook posts without publishing';

    public function handle(): int
    {
        $limit = max(1, (int) $this->option('limit'));

$articles = NewsArticle::query()
    ->whereNotNull('image_url')
    ->whereNotNull('url')
    ->whereNotNull('title')
    ->whereDoesntHave('facebookPost')
    ->orderByRaw("
        CASE
            WHEN source_name = 'Helakuru Esana' THEN 0
            ELSE 1
        END
    ")
    ->orderByDesc('created_at')
    ->limit($limit)
    ->get();

        if ($articles->isEmpty()) {
            $this->info('No new articles available to prepare.');
            return self::SUCCESS;
        }

        $saved = 0;

        foreach ($articles as $article) {
            $caption = $this->buildCaption($article);

            FacebookPost::create([
                'news_article_id' => $article->id,
                'message' => $caption,
                'post_url' => null,
                'status' => 'pending',
            ]);

            $saved++;

            $this->info("Prepared: {$article->title}");
        }

        $this->newLine();
        $this->info("Successfully prepared {$saved} Facebook post(s).");

        return self::SUCCESS;
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

        // Use the available language as fallback.
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
