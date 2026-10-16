<?php

namespace App\Console\Commands;
use Illuminate\Console\Command;
use App\Models\NewsArticle;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class FetchSriLankaNews extends Command
{
    protected $signature = 'news:fetch-sri-lanka';

    protected $description =
        'Fetch Sri Lankan news and save articles to MySQL';

    public function handle(): int
    {
        $apiKey = config('services.worldnews.key');

        if (!$apiKey) {
            $this->error('World News API key is missing.');
            return self::FAILURE;
        }

        try {
            $response = Http::withHeaders([
                'x-api-key' => $apiKey,
            ])->timeout(30)->get(
                'https://api.worldnewsapi.com/search-news',
                [
                    'source-country' => 'lk',
                    'language' => 'en',
                    'earliest-publish-date' => Carbon::now('UTC')
                        ->subHours(24)
                        ->format('Y-m-d H:i:s'),
                    'sort' => 'publish-time',
                    'sort-direction' => 'DESC',
                    'number' => 10,
                    'offset' => 0,
                ]
            );

            $response->throw();

            $articles = $response->json('news', []);
            $saved = 0;

            foreach ($articles as $article) {
                $url = $article['url'] ?? null;
                $title = $article['title'] ?? null;

                if (!$url || !$title) {
                    continue;
                }

                NewsArticle::updateOrCreate(
                    ['url' => $url],
                    [
                        'title' => $title,
                        'summary' => $article['summary'] ?? null,
                        'content' => $article['text'] ?? null,
                        'image_url' => $article['image'] ?? null,
                        'source_name' =>
                            $article['source_country'] ?? null,
                        'category' =>
                            $article['category'] ?? null,
                        'language' =>
                            $article['language'] ?? 'en',
                        'published_at' =>
                            $article['publish_date'] ?? null,
                    ]
                );

                $saved++;
            }

            $this->info("News sync completed. Processed {$saved} articles.");

            return self::SUCCESS;
        } catch (\Throwable $e) {
            Log::error('Sri Lankan news fetch failed', [
                'message' => $e->getMessage(),
            ]);

            $this->error('Fetching news failed. Check Laravel logs.');

            return self::FAILURE;
        }
    }
}
