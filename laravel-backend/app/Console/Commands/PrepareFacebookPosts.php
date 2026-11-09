<?php

namespace App\Console\Commands;

use App\Models\FacebookPost;
use App\Models\NewsArticle;
use App\Services\FacebookCaptionBuilder;
use Illuminate\Console\Command;

class PrepareFacebookPosts extends Command
{
    protected $signature = 'news:prepare-facebook
                            {--limit=20 : Maximum posts to prepare}';

    protected $description = 'Prepare bilingual Facebook captions';

    public function handle(FacebookCaptionBuilder $captions): int
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
            $this->info('No new articles available.');
            return self::SUCCESS;
        }

        foreach ($articles as $article) {
            FacebookPost::create([
                'news_article_id' => $article->id,
                'message' => $captions->build($article),
                'status' => 'pending',
            ]);

            $this->info("Prepared: {$article->title}");
        }

        $this->info("Prepared {$articles->count()} Facebook post(s).");

        return self::SUCCESS;
    }
}