<?php

namespace App\Console\Commands;

use App\Models\NewsArticle;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

class FetchSriLankaNews extends Command
{
    protected $signature = 'news:fetch-sri-lanka';

    protected $description = 'Fetch Sri Lankan news from APIs and RSS feeds';

    public int $saved = 0;
    public int $duplicates = 0;
    public int $invalid = 0;
    public int $failedSources = 0;

    public function handle(): int
    {
        $this->info('Starting LankaPulse AI news collection...');
        $this->newLine();

        $sources = [
            'World News API' => fn () => $this->fetchWorldNews(),
            'Induwara.lk' => fn () => $this->fetchInduwara(),
            'NewsAPI' => fn () => $this->fetchNewsApi(),
        ];

        // Add enabled RSS feeds from services.php.
        foreach (config('services.rss.feeds', []) as $feed) {
            if (empty($feed['enabled'])) {
                continue;
            }

            $name = $feed['name'];


        }

        foreach ($sources as $sourceName => $fetcher) {
            try {
                $this->info("Fetching from {$sourceName}...");

                $articles = $fetcher();

                $this->displayLatestArticles($sourceName, $articles);

                foreach ($articles as $article) {
                    $this->saveArticle($article, $sourceName);
                }
            } catch (Throwable $e) {
                $this->failedSources++;

                $this->error(
                    "{$sourceName} failed: " . $e->getMessage()
                );

                report($e);
            }

            $this->newLine();
        }

        // Delete articles older than 30 days.
        $deleted = NewsArticle::where(
            'published_at',
            '<',
            now()->subDays(30)
        )->delete();

        $this->info('News collection completed.');

        $this->table(
            ['Result', 'Count'],
            [
                ['New articles saved', $this->saved],
                ['Duplicates skipped', $this->duplicates],
                ['Invalid articles skipped', $this->invalid],
                ['Old articles deleted', $deleted],
                ['Failed sources', $this->failedSources],
            ]
        );

        return self::SUCCESS;
    }

    /*
    |--------------------------------------------------------------------------
    | World News API
    |--------------------------------------------------------------------------
    */

    public function fetchWorldNews(): array
    {
        $apiKey = config('services.worldnews.key');

        if (!$apiKey) {
            throw new \RuntimeException(
                'WORLD_NEWS_API_KEY is missing.'
            );
        }

        $allArticles = [];

        for ($page = 0; $page < 4; $page++) {
            $offset = $page * 100;

            $response = Http::acceptJson()
                ->withHeaders([
                    'x-api-key' => $apiKey,
                ])
                ->timeout(45)
                ->get('https://api.worldnewsapi.com/search-news', [
                    'source-country' => 'lk',
                    'language' => 'en',
                    'earliest-publish-date' => now()
                        ->subDays(30)
                        ->toDateString(),
                    'sort' => 'publish-time',
                    'sort-direction' => 'DESC',
                    'number' => 100,
                    'offset' => $offset,
                ]);

            // Stop if the daily API quota is reached.
            if ($response->status() === 402) {
                $this->warn(
                    'World News API daily quota reached. ' .
                    'Keeping articles already fetched.'
                );

                break;
            }

            $response->throw();

            $items = $response->json('news', []);

            if (!is_array($items) || empty($items)) {
                break;
            }

            $this->info(
                'World News API page ' . ($page + 1) .
                ': received ' . count($items) . ' articles.'
            );

            foreach ($items as $item) {
                if (!is_array($item)) {
                    continue;
                }

                $allArticles[] = $this->normalizeArticle([
                    'title' => $item['title'] ?? null,
                    'url' => $item['url'] ?? null,
                    'summary' => $item['summary'] ?? null,
                    'content' => null,
                    'image_url' => null,
                    'language' => $item['language'] ?? 'en',
                    'published_at' => $item['publish_date'] ?? null,
                    'source_name' => 'World News API',
                ]);
            }

            if (count($items) < 100) {
                break;
            }
        }

        $this->info(
            'World News API: received ' . count($allArticles) . ' articles.'
        );

        return $allArticles;
    }

    /*
    |--------------------------------------------------------------------------
    | Induwara.lk API
    |--------------------------------------------------------------------------
    */

    public function fetchInduwara(): array
    {
        $articles = [];

        $offset = 0;
        $limit = 100;

        for ($page = 0; $page < 5; $page++) {
            $response = Http::acceptJson()
                ->timeout(45)
                ->get('https://induwara.lk/api/v1/news', [
                    'limit' => $limit,
                    'offset' => $offset,
                ]);

            $response->throw();

            $items = $response->json('data.posts', []);

            if (!is_array($items) || empty($items)) {
                break;
            }

            // Inspect date-related fields from the first item.
            if ($page === 0 && isset($items[0])) {
                $firstItem = $items[0];

                $dateFields = array_filter(
                    $firstItem,
                    fn ($value, $key) =>
                        preg_match(
                            '/date|time|created|publish|updated/i',
                            (string) $key
                        ),
                    ARRAY_FILTER_USE_BOTH
                );

                $this->line(
                    'Induwara date fields: ' .
                    json_encode($dateFields)
                );
            }

            foreach ($items as $item) {
                if (!is_array($item)) {
                    continue;
                }

                $articles[] = $this->normalizeArticle([
                    'title' => $item['title']
                        ?? $item['name']
                        ?? null,

                    'url' => $item['url']
                        ?? $item['link']
                        ?? null,

                    'summary' => $item['excerpt']
                        ?? $item['description']
                        ?? $item['summary']
                        ?? null,

                    'content' => null,
                    'image_url' => null,

                    'language' => $item['language'] ?? 'en',

                    'published_at' => $item['publishedAt']
                        ?? $item['updatedAt']
                        ?? $item['published_at']
                        ?? $item['published']
                        ?? $item['publish_date']
                        ?? $item['created_at']
                        ?? $item['createdAt']
                        ?? $item['date']
                        ?? null,

                    'source_name' => 'Induwara.lk',
                ]);
            }

            if (count($items) < $limit) {
                break;
            }

            $offset += $limit;
        }

        $this->info(
            'Induwara.lk: received ' . count($articles) . ' articles.'
        );

        return $articles;
    }


    /*
    |--------------------------------------------------------------------------
    | NewsAPI
    |--------------------------------------------------------------------------
    */

    public function fetchNewsApi(): array
    {
        $apiKey = config('services.newsapi.key');

        if (!$apiKey) {
            throw new \RuntimeException(
                'NEWSAPI_KEY is missing.'
            );
        }

        $response = Http::acceptJson()
            ->timeout(45)
            ->get('https://newsapi.org/v2/everything', [
                'q' => '"Sri Lanka"',
                'language' => 'en',
                'sortBy' => 'publishedAt',
                'pageSize' => 100,
                'apiKey' => $apiKey,
            ]);

        $response->throw();

        $items = $response->json('articles', []);

        if (!is_array($items)) {
            return [];
        }

        $articles = [];

        foreach ($items as $item) {
            if (!is_array($item)) {
                continue;
            }

            $articles[] = $this->normalizeArticle([
                'title' => $item['title'] ?? null,
                'url' => $item['url'] ?? null,
                'summary' => $item['description'] ?? null,
                'content' => null,
                'image_url' => null,
                'published_at' => $item['publishedAt'] ?? null,
                'source_name' => $item['source']['name'] ?? 'NewsAPI',
                'language' => 'en',
            ]);
        }

        $this->info(
            'NewsAPI: received ' . count($articles) . ' articles.'
        );

        return $articles;
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize Article Data
    |--------------------------------------------------------------------------
    */

    public function normalizeArticle(array $article): array
    {
        $publishedAt = null;

        if (!empty($article['published_at'])) {
            try {
                $publishedAt = Carbon::parse(
                    $article['published_at']
                )->toDateTimeString();
            } catch (Throwable $e) {
                $publishedAt = null;
            }
        }

        $title = isset($article['title'])
            ? trim(strip_tags((string) $article['title']))
            : null;

        $summary = isset($article['summary'])
            ? trim(strip_tags((string) $article['summary']))
            : null;

        $content = isset($article['content'])
            ? trim((string) $article['content'])
            : null;

        $imageUrl = isset($article['image_url'])
            ? trim((string) $article['image_url'])
            : null;

        return [
            'title' => $title,

            'url' => isset($article['url'])
                ? trim((string) $article['url'])
                : null,

            'summary' => $summary ?: null,

            'content' => $content ?: null,

            'image_url' => $imageUrl ?: null,

            'category' => $this->detectCategory(
                ($title ?? '') . ' ' . ($summary ?? '')
            ),

            'language' => $article['language'] ?? 'en',

            'published_at' => $publishedAt,

            'source_name' => $article['source_name'] ?? null,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Save Article and Avoid Duplicates
    |--------------------------------------------------------------------------
    */

    public function saveArticle(
        array $article,
        string $sourceName
    ): void {
        $url = trim($article['url'] ?? '');
        $urlParts = parse_url($url);

        if (
            empty($article['title']) ||
            empty($url) ||
            empty($urlParts['scheme']) ||
            !in_array($urlParts['scheme'], ['http', 'https'], true) ||
            empty($urlParts['host'])
        ) {
            $this->invalid++;
            return;
        }

        // Remove tracking query parameters.
        $urlWithoutQuery = strtok($url, '?');

        $normalizedUrl = rtrim(
            $urlWithoutQuery ?: $url,
            '/'
        );

        $normalizedTitle = Str::lower(
            preg_replace(
                '/\s+/',
                ' ',
                trim($article['title'])
            )
        );

        $existing = NewsArticle::query()
            ->where('url', $normalizedUrl)
            ->orWhereRaw(
                'LOWER(TRIM(title)) = ?',
                [$normalizedTitle]
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Update Existing Duplicate Records
        |--------------------------------------------------------------------------
        */

        if ($existing) {
            $updates = [];

            foreach (['summary', 'content', 'image_url'] as $field) {
                if (
                    empty($existing->$field) &&
                    !empty($article[$field])
                ) {
                    $updates[$field] = $article[$field];
                }
            }

            if (!empty($updates)) {
                $existing->update($updates);
            }

            $this->duplicates++;

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Create New Article
        |--------------------------------------------------------------------------
        */

        try {
            NewsArticle::create([
                'title' => $article['title'],

                'url' => $normalizedUrl,

                'summary' => $article['summary'] ?? null,

                'content' => $article['content'] ?? null,

                'image_url' => $article['image_url'] ?? null,

                'category' => $article['category'] ?? 'General',

                'language' => $article['language'] ?? 'en',

                'published_at' => $article['published_at'] ?? null,

                'source_name' => $article['source_name']
                    ?? $sourceName,
            ]);

            $this->saved++;
        } catch (Throwable $e) {
            $this->invalid++;

            report($e);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Category Detection
    |--------------------------------------------------------------------------
    */

    public function detectCategory(string $text): string
    {
        $text = Str::lower($text);

        $categories = [
            'Business' => [
                'business', 'economy', 'economic', 'finance',
                'market', 'stock', 'cse', 'bank', 'inflation',
                'investment', 'company', 'trade', 'export',
                'import', 'rupee', 'tax', 'budget',
            ],

            'Politics' => [
                'president', 'prime minister', 'parliament',
                'government', 'minister', 'election', 'political',
                'politics', 'cabinet', 'opposition',
            ],

            'Technology' => [
                'technology', 'tech', 'artificial intelligence',
                'software', 'digital', 'cyber', 'internet',
                'mobile', 'app', 'computer', 'ai',
            ],

            'Sports' => [
                'cricket', 'football', 'rugby', 'sport',
                'tournament', 'match', 'player', 'team',
                'championship', 'olympics',
            ],

            'Education' => [
                'education', 'university', 'school', 'student',
                'exam', 'examination', 'scholarship',
                'admission', 'academic',
            ],

            'Health' => [
                'health', 'hospital', 'medical', 'doctor',
                'disease', 'patient', 'medicine', 'healthcare',
            ],

            'Entertainment' => [
                'entertainment', 'movie', 'film', 'music',
                'actor', 'actress', 'celebrity', 'concert',
            ],

            'Crime' => [
                'police', 'arrest', 'crime', 'murder',
                'fraud', 'court', 'suspect', 'investigation',
                'scam', 'robbery', 'accident',
            ],
        ];

        $scores = [];

        foreach ($categories as $category => $keywords) {
            $score = 0;

            foreach ($keywords as $keyword) {
                if (Str::contains($text, $keyword)) {
                    $score++;
                }
            }

            $scores[$category] = $score;
        }

        arsort($scores);

        $bestCategory = array_key_first($scores);

        if (!$bestCategory || $scores[$bestCategory] === 0) {
            return 'General';
        }

        return $bestCategory;
    }

    /*
    |--------------------------------------------------------------------------
    | Display Latest Articles
    |--------------------------------------------------------------------------
    */

    public function displayLatestArticles(
        string $sourceName,
        array $articles
    ): void {
        $this->info("Latest articles from {$sourceName}:");

        $validArticles = array_filter(
            $articles,
            fn ($article) => !empty($article['title'])
        );

        usort($validArticles, function ($a, $b) {
            return strtotime($b['published_at'] ?? '1970-01-01')
                <=> strtotime($a['published_at'] ?? '1970-01-01');
        });

        $latest = array_slice($validArticles, 0, 5);

        if (empty($latest)) {
            $this->warn('No articles received.');
            return;
        }

        foreach ($latest as $article) {
            $date = 'Unknown date';

            if (!empty($article['published_at'])) {
                try {
                    $date = Carbon::parse($article['published_at'])
                        ->timezone('Asia/Colombo')
                        ->format('Y-m-d H:i:s');
                } catch (Throwable $e) {
                    // Keep Unknown date.
                }
            }

            $this->line(
                $date . ' - ' . $article['title']
            );
        }
    }
}
