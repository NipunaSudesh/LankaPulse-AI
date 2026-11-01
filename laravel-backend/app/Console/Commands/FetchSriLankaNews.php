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

    private int $saved = 0;
    private int $duplicates = 0;
    private int $invalid = 0;
    private int $failedSources = 0;

    public function handle(): int
    {
        $this->info('Starting LankaPulse AI news collection...');
        $this->newLine();

        $sources = [
            'World News API' => fn () => $this->fetchWorldNews(),
            'Induwara.lk' => fn () => $this->fetchInduwara(),
            'NewsData.io' => fn () => $this->fetchNewsData(),
            'NewsAPI' => fn () => $this->fetchNewsApi(),
        ];

        // Add enabled RSS feeds from services.php
        foreach (config('services.rss.feeds', []) as $feed) {
            if (empty($feed['enabled'])) {
                continue;
            }

            $name = $feed['name'];

            $sources[$name] = fn () => $this->fetchRssFeed($feed);
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

        // Delete articles older than 30 days
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

    private function fetchWorldNews(): array
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
            // Keep articles already fetched from previous pages.
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

    private function fetchInduwara(): array
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

            // Temporary diagnostic: inspect actual date-related fields.
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
    | NewsData.io API
    |--------------------------------------------------------------------------
    */

    private function fetchNewsData(): array
    {
        $apiKey = config('services.newsdata.key');

        if (!$apiKey) {
            throw new \RuntimeException(
                'NEWS_DATA_API_KEY is missing.'
            );
        }

        $response = Http::acceptJson()
            ->timeout(45)
            ->get('https://newsdata.io/api/1/latest', [
                'apikey' => $apiKey,
                'country' => 'lk',
                'language' => 'en',
                'size' => 10,
            ]);

        $response->throw();

        $items = $response->json('results', []);

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
                'url' => $item['link'] ?? null,
                'summary' => null,
                'content' => null,
                'image_url' => null,
                'language' => $item['language'] ?? 'en',
                'published_at' => $item['pubDate'] ?? null,
                'source_name' => $item['source_name'] ?? 'NewsData.io',
            ]);
        }

        $this->info(
            'NewsData.io: received ' . count($articles) . ' articles.'
        );

        return $articles;
    }

    /*
    |--------------------------------------------------------------------------
    | NewsAPI
    |--------------------------------------------------------------------------
    */

    private function fetchNewsApi(): array
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
    | RSS Feed Parser - Lankadeepa and News21
    |--------------------------------------------------------------------------
    */

   

private function fetchRssFeed(array $feed): array
{
    $feedUrl = trim($feed['url']);
    $feedName = $feed['name'];
    $feedLanguage = $feed['language'] ?? 'en';

    $this->info("Fetching from {$feedName}...");
    $this->line("Requesting URL: {$feedUrl}");

    /*
    |--------------------------------------------------------------------------
    | 1. Send HTTP Request
    |--------------------------------------------------------------------------
    */

    $response = Http::withHeaders([
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
        'Accept' => 'application/rss+xml, application/xml, text/xml, */*',
    ])
        ->connectTimeout(20)
        ->timeout(45)
        ->get($feedUrl);

    /*
    |--------------------------------------------------------------------------
    | 2. Handle HTTP Errors
    |--------------------------------------------------------------------------
    */

    if (!$response->successful()) {
        $this->error("{$feedName} HTTP Error: " . $response->status());

        $this->line('Requested URL: ' . $feedUrl);

        $this->line(
            'Content-Type: ' .
            $response->header('Content-Type')
        );

        $this->line(
            'Response: ' .
            substr($response->body(), 0, 500)
        );

        throw new \RuntimeException(
            "{$feedName} returned HTTP " . $response->status()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Extract RSS XML
    |--------------------------------------------------------------------------
    */

    libxml_use_internal_errors(true);

    $rssBody = $response->body();

    // Some servers return additional HTML around the RSS document.
    if (preg_match(
        '/<rss\b[^>]*>[\s\S]*?<\/rss>/i',
        $rssBody,
        $matches
    )) {
        $rssBody = $matches[0];
    }

    $xml = simplexml_load_string(
        $rssBody,
        'SimpleXMLElement',
        LIBXML_NONET | LIBXML_NOCDATA
    );

    if ($xml === false) {
        $errors = libxml_get_errors();

        $this->error("Unable to parse RSS feed: {$feedName}");

        foreach (array_slice($errors, 0, 3) as $error) {
            $this->line(trim($error->message));
        }

        $this->line('Response preview:');
        $this->line(substr($response->body(), 0, 1000));

        libxml_clear_errors();

        throw new \RuntimeException(
            "Unable to parse RSS feed: {$feedName}"
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Detect RSS Items
    |--------------------------------------------------------------------------
    */

    $items = [];

    // Standard RSS 2.0
    if (isset($xml->channel->item)) {
        $items = $xml->channel->item;
    }

    // Atom
    elseif (isset($xml->entry)) {
        $items = $xml->entry;
    }

    $this->info(
        'Detected RSS items: ' . count($items)
    );

    $articles = [];

    /*
    |--------------------------------------------------------------------------
    | 5. Extract Article Information
    |--------------------------------------------------------------------------
    */

    foreach ($items as $item) {

        // Article title
        $title = trim(
            (string) ($item->title ?? '')
        );

        // Standard RSS URL
        $url = trim(
            (string) ($item->link ?? '')
        );

        // Atom URL fallback
        if (empty($url)) {
            foreach ($item->link as $link) {
                $attributes = $link->attributes();

                $href = trim(
                    (string) ($attributes['href'] ?? '')
                );

                if (!empty($href)) {
                    $url = $href;
                    break;
                }
            }
        }

        // GUID fallback
        if (empty($url) && isset($item->guid)) {
            $guid = trim(
                (string) $item->guid
            );

            if (filter_var($guid, FILTER_VALIDATE_URL)) {
                $url = $guid;
            }
        }

        // Article description
        $description = trim(
            (string) ($item->description ?? '')
        );

        // Full content namespace
        $contentNamespace = $item->children(
            'http://purl.org/rss/1.0/modules/content/'
        );

        $content = trim(
            (string) ($contentNamespace->encoded ?? '')
        );

        if (empty($description)) {
            $description = $content;
        }

        /*
        |--------------------------------------------------------------------------
        | Extract Image
        |--------------------------------------------------------------------------
        */

        $imageUrl = '';

        // Direct image element
        if (isset($item->image)) {
            $imageUrl = trim(
                (string) $item->image
            );
        }

        // Enclosure image
        if (empty($imageUrl) && isset($item->enclosure)) {
            $attributes = $item->enclosure->attributes();

            $imageUrl = trim(
                (string) ($attributes['url'] ?? '')
            );
        }

        // Media RSS image
        if (empty($imageUrl)) {
            $media = $item->children(
                'http://search.yahoo.com/mrss/'
            );

            if (isset($media->content)) {
                $attributes = $media->content->attributes();

                $imageUrl = trim(
                    (string) ($attributes['url'] ?? '')
                );
            }

            if (empty($imageUrl) && isset($media->thumbnail)) {
                $attributes = $media->thumbnail->attributes();

                $imageUrl = trim(
                    (string) ($attributes['url'] ?? '')
                );
            }
        }

        // Extract image from description HTML
        if (empty($imageUrl)) {
            $html = $description . ' ' . $content;

            if (preg_match(
                '/<img[^>]+src=["\']([^"\']+)["\']/i',
                $html,
                $imageMatch
            )) {
                $imageUrl = trim($imageMatch[1]);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Extract Publication Date
        |--------------------------------------------------------------------------
        */

        $publishedAt = trim((string) (
            $item->pubDate
            ?? $item->published
            ?? $item->updated
            ?? ''
        ));

        // Dublin Core date fallback
        if (empty($publishedAt)) {
            $dc = $item->children(
                'http://purl.org/dc/elements/1.1/'
            );

            $publishedAt = trim(
                (string) ($dc->date ?? '')
            );
        }

        /*
        |--------------------------------------------------------------------------
        | Clean Summary
        |--------------------------------------------------------------------------
        */

        $summary = trim(
            html_entity_decode(
                strip_tags($description),
                ENT_QUOTES | ENT_HTML5,
                'UTF-8'
            )
        );

        /*
        |--------------------------------------------------------------------------
        | Debug Lankadeepa
        |--------------------------------------------------------------------------
        */

        if ($feedName === 'Lankadeepa') {
            $this->line('------------------------------');
            $this->line("Title: {$title}");
            $this->line("URL: {$url}");
            $this->line("Image: {$imageUrl}");
            $this->line("Published: {$publishedAt}");
        }

        /*
        |--------------------------------------------------------------------------
        | Validate Article
        |--------------------------------------------------------------------------
        */

        if (empty($title) || empty($url)) {
            continue;
        }

    // Validate URL while allowing Sinhala Unicode characters.
$urlParts = parse_url($url);

if (
    empty($urlParts['scheme']) ||
    !in_array($urlParts['scheme'], ['http', 'https'], true) ||
    empty($urlParts['host'])
) {
    continue;
}

        /*
        |--------------------------------------------------------------------------
        | Normalize Article
        |--------------------------------------------------------------------------
        */

        $articles[] = $this->normalizeArticle([
            'title' => $title,
            'url' => $url,
            'summary' => $summary ?: null,
            'content' => $content ?: null,
            'image_url' => $imageUrl ?: null,
            'language' => $feedLanguage,
            'published_at' => $publishedAt ?: null,
            'source_name' => $feedName,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Clear XML Errors
    |--------------------------------------------------------------------------
    */

    libxml_clear_errors();

    /*
    |--------------------------------------------------------------------------
    | 7. Return Articles
    |--------------------------------------------------------------------------
    */

    $this->info(
        "{$feedName}: received " .
        count($articles) .
        ' articles.'
    );

    return $articles;
}



    /*
    |--------------------------------------------------------------------------
    | Normalize article data
    |--------------------------------------------------------------------------
    */

    private function normalizeArticle(array $article): array
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

        return [
            'title' => $title,

            'url' => isset($article['url'])
                ? trim((string) $article['url'])
                : null,

            'summary' => $summary ?: null,
            'content' => null,
            'image_url' => null,

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
    | Save article and avoid duplicates
    |--------------------------------------------------------------------------
    */

    private function saveArticle(
        array $article,
        string $sourceName
    ): void {
        if (
            empty($article['title']) ||
            empty($article['url']) ||
            !filter_var($article['url'], FILTER_VALIDATE_URL)
        ) {
            $this->invalid++;
            return;
        }

        // Remove tracking query parameters
        $urlWithoutQuery = strtok($article['url'], '?');

        $normalizedUrl = rtrim(
            $urlWithoutQuery ?: $article['url'],
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

        if ($existing) {
            $this->duplicates++;
            return;
        }

        try {
            NewsArticle::create([
                'title' => $article['title'],
                'url' => $normalizedUrl,
                'summary' => $article['summary'] ?? null,
                'content' => null,
                'image_url' => null,
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
    | Category detection
    |--------------------------------------------------------------------------
    */

    private function detectCategory(string $text): string
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
    | Display latest articles
    |--------------------------------------------------------------------------
    */

    private function displayLatestArticles(
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
                    // Keep Unknown date
                }
            }

            $this->line(
                $date . ' - ' . $article['title']
            );
        }
    }
}
