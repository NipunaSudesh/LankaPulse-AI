<?php
// http://127.0.0.1:8000/api/v1/facebook-posts
namespace App\Console\Commands;

use App\Models\FacebookPost;
use App\Models\NewsArticle;
use Illuminate\Console\Command;

class PrepareFacebookPosts extends Command
{
    protected $signature = 'news:prepare-facebook
                            {--limit=20 : Maximum number of posts to prepare}';

    protected $description = 'Prepare news articles as Facebook posts without publishing';

    public function handle(): int
    {
        $limit = max(1, (int) $this->option('limit'));

        $articles = NewsArticle::query()
            ->whereNotNull('image_url')
            ->whereNotNull('url')
            ->whereNotNull('title')
            ->whereDoesntHave('facebookPost')
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get();

        if ($articles->isEmpty()) {
            $this->info('No new articles available to prepare.');
            return self::SUCCESS;
        }

        $saved = 0;

        foreach ($articles as $article) {
            // Prefer Sinhala for Facebook.
            $title = trim(strip_tags((string) (
                $article->title_si ?: $article->title
            )));

            $summaryText = $article->summary_si
                ?: $article->summary
                ?: $article->content_si
                ?: $article->content;

            $summary = html_entity_decode(
                strip_tags((string) $summaryText),
                ENT_QUOTES | ENT_HTML5,
                'UTF-8'
            );

            $summary = preg_replace('/\s+/u', ' ', trim($summary)) ?? '';

            $caption = "📰 {$title}";

            if ($summary !== '') {
                $caption .= "\n\n" . mb_strimwidth(
                    $summary,
                    0,
                    700,
                    '...',
                    'UTF-8'
                );
            }

            if ($article->source_name) {
                $caption .= "\n\nමූලාශ්‍රය: {$article->source_name}";
            }

            $caption .= "\n\nසම්පූර්ණ පුවත: {$article->url}";

            $caption .= "\n\n#LankaPulseAI #SriLankaNews #ශ්‍රීලංකාපුවත්";

            FacebookPost::create([
                'news_article_id' => $article->id,
                'message' => $caption,
                'post_url' => null,
                'status' => 'pending',
            ]);

            $saved++;

            $this->info("Prepared: {$title}");
        }

        $this->newLine();
        $this->info("Successfully prepared {$saved} Facebook post(s).");

        return self::SUCCESS;
    }
}
