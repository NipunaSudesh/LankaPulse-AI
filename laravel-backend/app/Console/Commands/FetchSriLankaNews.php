<?php

namespace App\Console\Commands;

use App\Models\NewsArticle;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FetchSriLankaNews extends Command
{
    protected $signature = 'news:fetch-sri-lanka';

    protected $description =
        'Fetch Sri Lankan news, prevent duplicates and remove articles older than 30 days';

    public function handle(): int
    {
        $created = 0;
        $skipped = 0;
        $failed = 0;

        $sources = [
            'World News API' => fn () => $this->fetchWorldNews(),
            'Induwara.lk'    => fn () => $this->fetchInduwara(),
            'NewsAPI'        => fn () => $this->fetchNewsApi(),
                'Helakuru Esana' => fn () => $this->fetchHelakuru(),

            // 'Lankadeepa'     => fn () => $this->fetchLankadeepa(),
        ];

        foreach ($sources as $sourceName => $fetch) {
            try {
                $articles = $fetch();

                $this->info(
                    "{$sourceName}: received " . count($articles) . ' articles.'
                );

                foreach ($articles as $article) {
                    $title = trim((string) ($article['title'] ?? ''));
                    $url = trim((string) ($article['url'] ?? ''));
if ($title === '') {
    $this->warn("EMPTY TITLE [{$sourceName}]");
    $skipped++;
    continue;
}

if (!$this->isValidArticleUrl($url)) {
    $this->warn("INVALID URL [{$sourceName}]: {$url}");
    $skipped++;
    continue;
}

                    try {
                        $wasCreated = DB::transaction(
                            function () use ($article, $title, $url, $sourceName) {
                                // Load existing URL/title pairs for duplicate checks.
$existing = NewsArticle::query()
    ->get(['url', 'title', 'source_name']);

$candidateUrl = $this->normalizeUrl($url);
$candidateTitle = $this->normalizeTitle($title);

foreach ($existing as $saved) {

    // Same URL means the article is already stored.
    $savedUrl = $this->normalizeUrl((string) $saved->url);

    if ($savedUrl === $candidateUrl) {
        return false;
    }

    // Only compare duplicate titles within the same source.
    $savedTitle = $this->normalizeTitle((string) $saved->title);

    if (
        $saved->source_name === $sourceName &&
        $savedTitle === $candidateTitle
    ) {
        return false;
    }
}

                                $publishedAt = null;

                                if (!empty($article['published_at'])) {
                                    try {
                                        $publishedAt = Carbon::parse(
                                            $article['published_at']
                                        );
                                    } catch (\Throwable $e) {
                                        $publishedAt = null;
                                    }
                                }

                                NewsArticle::create([
                                    'title' => $title,
                                    'url' => $url,
                                    'summary' => $article['summary'] ?? null,
                                    'content' => $article['content'] ?? null,
                                    'image_url' => $article['image_url'] ?? null,
                                    'source_name' => $sourceName,
                                   'category' => $this->detectCategory(
                                    $title,
                                    $article['summary'] ?? null,
                                    $article['content'] ?? null
                                ),
                                'language' => $article['language'] ?? 'en',
                                'published_at' => $publishedAt,
                                ]);

                         return true;
                            }
                        );

                        if ($wasCreated) {
                            $created++;
                        } else {
                            $skipped++;
                        }
                    } catch (\Throwable $e) {
                        // A concurrent import may have inserted the same URL.
                        // Log the error and continue with the next article.
                        Log::warning('News article could not be saved', [
                            'url' => $url,
                            'message' => $e->getMessage(),
                        ]);

                        $skipped++;
                    }
                }
            } catch (\Throwable $e) {
                $failed++;

                Log::error("{$sourceName} import failed", [
                    'message' => $e->getMessage(),
                ]);

$this->error("{$sourceName} failed: " . $e->getMessage());
            }
        }

        // Delete articles published more than 30 days ago.
        $cutoff = now()->subDays(30);

        $deleted = NewsArticle::query()
            ->whereNotNull('published_at')
            ->where('published_at', '<', $cutoff)
            ->delete();

        $this->info("New articles saved: {$created}");
        $this->info("Duplicates/invalid articles skipped: {$skipped}");
        $this->info("Old articles deleted: {$deleted}");
        $this->info("Failed sources: {$failed}");

        return $failed === count($sources)
            ? self::FAILURE
            : self::SUCCESS;
    }


private function fetchWorldNews(): array
{
    $apiKey = config('services.worldnews.key');

    if (!$apiKey) {
        throw new \RuntimeException(
            'World News API key is missing.'
        );
    }

    $allArticles = [];
    $limit = 100;
    $maxPages = 20;

    for ($page = 0; $page < $maxPages; $page++) {
        $offset = $page * $limit;

        $response = Http::acceptJson()
            ->withHeaders(['x-api-key' => $apiKey])
            ->timeout(60)
            ->get('https://api.worldnewsapi.com/search-news', [
                'source-country' => 'lk',
                'language' => 'en',
                'earliest-publish-date' => Carbon::now('UTC')
                    ->subDays(30)
                    ->format('Y-m-d H:i:s'),
                'sort' => 'publish-time',
                'sort-direction' => 'DESC',
                'number' => $limit,
                'offset' => $offset,
            ]);

        $response->throw();

        $items = $response->json('news', []);

        if (!is_array($items) || count($items) === 0) {
            break;
        }

        foreach ($items as $item) {
            if (is_array($item)) {
                $allArticles[] = $this->normalizeArticle($item);
            }
        }

        $this->info(
            'World News API page ' . ($page + 1) .
            ': received ' . count($items) . ' articles.'
        );

        if (count($items) < $limit) {
            break;
        }
    }

    return $allArticles;
}


  
private function fetchInduwara(): array
{
    $allArticles = [];
    $limit = 100;
    $maxPages = 20;

    for ($page = 0; $page < $maxPages; $page++) {
        $offset = $page * $limit;

        $response = Http::acceptJson()
            ->timeout(30)
            ->get('https://induwara.lk/api/v1/news', [
                'limit' => $limit,
                'offset' => $offset,
            ]);

        $response->throw();

        $payload = $response->json();
        $items = $payload['data']['posts'] ?? [];

        if (!is_array($items) || count($items) === 0) {
            break;
        }

        foreach ($items as $item) {
            if (is_array($item)) {
                $allArticles[] = $this->normalizeArticle($item);
            }
        }

        $this->info(
            'Induwara.lk page ' . ($page + 1) .
            ': received ' . count($items) . ' articles.'
        );

        $total = (int) ($payload['data']['total'] ?? 0);

        if (
            count($items) < $limit ||
            ($total > 0 && $offset + count($items) >= $total)
        ) {
            break;
        }
    }

    return $allArticles;
}

private function fetchNewsApi(): array
{
    $apiKey = config('services.newsapi.key');

    if (!$apiKey) {
        throw new \RuntimeException('NewsAPI key is missing.');
    }

    $allArticles = [];

    $response = Http::acceptJson()
        ->timeout(30)
        ->get('https://newsapi.org/v2/everything', [
            'q'        => 'Sri Lanka',
            'language' => 'en',
            'sortBy'   => 'publishedAt',
            'pageSize' => 100,
            'page'     => 1,
            'apiKey'   => $apiKey,
        ]);

    $response->throw();

    $items = $response->json('articles', []);

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        // Skip removed/placeholder articles
        if (($item['title'] ?? '') === '[Removed]') {
            continue;
        }

        $allArticles[] = [
            'title'        => $item['title'] ?? null,
            'url'          => $item['url'] ?? null,
            'summary'      => $item['description'] ?? null,
            'content'      => $item['content'] ?? $item['description'] ?? null,
            'image_url'    => $item['urlToImage'] ?? null,
            'category'     => 'Public',
            'language'     => 'en',
            'published_at' => $item['publishedAt'] ?? null,
        ];
    }

    $this->info('NewsAPI: received ' . count($allArticles) . ' articles.');

    return $allArticles;
}


private function fetchHelakuru(): array
{
    $apiKey = config('services.rapidapi.key');
    $apiHost = config('services.rapidapi.host');

    if (!$apiKey || !$apiHost) {
        throw new \RuntimeException('Helakuru RapidAPI credentials are missing.');
    }

    $response = Http::acceptJson()
        ->withHeaders([
            'x-rapidapi-host' => $apiHost,
            'x-rapidapi-key' => $apiKey,
        ])
        ->timeout(40)
        ->retry(2, 1000)
        ->get('https://helakuru-esana-news-api.p.rapidapi.com/');

    $response->throw();

    $payload = $response->json();
    $newsData = is_array($payload) ? ($payload['news_data'] ?? null) : null;

    if (!is_array($newsData)) {
        throw new \RuntimeException('Invalid Helakuru news_data response.');
    }

    if (($newsData['status']['success'] ?? false) !== true) {
        throw new \RuntimeException('Helakuru API returned an unsuccessful response.');
    }

    $items = $newsData['data'] ?? [];

    if (!is_array($items)) {
        return [];
    }

    // Debug: shows which fields each article really has.
    if (!empty($items[0]) && is_array($items[0])) {
        $this->info('Helakuru item keys: ' . implode(', ', array_keys($items[0])));
    }

    $articles = [];

    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }

        $titleEn = trim((string) ($item['titleEn'] ?? ''));
        $titleSi = trim((string) ($item['titleSi'] ?? ''));

        $useEnglish = $titleEn !== '';
        $title = $useEnglish ? $titleEn : $titleSi;

        if ($title === '') {
            continue;
        }

        $contentEn = $this->extractHelakuruContent(
            is_array($item['contentEn'] ?? null) ? $item['contentEn'] : []
        );
        $contentSi = $this->extractHelakuruContent(
            is_array($item['contentSi'] ?? null) ? $item['contentSi'] : []
        );

        $content = $useEnglish ? $contentEn : $contentSi;

        if ($content === '') {
            $content = $useEnglish ? $contentSi : $contentEn;
        }

        $paragraphs = preg_split('/\n+/', trim($content)) ?: [];
        $summary = trim($paragraphs[0] ?? '');

        // URL: try known fields, then fall back to one built from the id.
        $url = null;

        foreach (['share_url', 'shareUrl', 'url', 'link', 'web_url'] as $key) {
            if (!empty($item[$key]) && is_string($item[$key])) {
                $url = trim($item[$key]);
                break;
            }
        }

        if (!$url && !empty($item['id'])) {
            // Unique per article, so duplicate checks work.
            $url = 'https://www.helakuru.lk/esana/news/' . $item['id'];
        }

        // Published date: try known fields, otherwise use now.
        $publishedAt = null;

        foreach (['published', 'published_at', 'publishedAt', 'date', 'time', 'created_at'] as $key) {
            if (!empty($item[$key])) {
                try {
                    $publishedAt = Carbon::parse($item[$key])->toDateTimeString();
                    break;
                } catch (\Throwable $e) {
                    $publishedAt = null;
                }
            }
        }

        if (!$publishedAt) {
            $publishedAt = now()->toDateTimeString();
        }

        $articles[] = [
            'title' => $title,
            'url' => $url,
            'summary' => $summary ?: null,
            'content' => $content ?: null,
            'image_url' => $item['thumb'] ?? $item['cover'] ?? $item['image'] ?? null,
            'category' => 'General',
            'language' => $useEnglish ? 'en' : 'si',
            'published_at' => $publishedAt,
        ];
    }

    $this->info('Helakuru Esana: received ' . count($articles) . ' articles.');

    return $articles;
}

/**
 * Extract readable text from Helakuru content blocks.
 */
private function extractHelakuruContent(array $blocks): string
{
    $paragraphs = [];

    foreach ($blocks as $block) {
        if (!is_array($block)) {
            continue;
        }

        if (($block['type'] ?? '') !== 'text') {
            continue;
        }

        $text = trim((string) ($block['data'] ?? ''));

        if ($text === '') {
            continue;
        }

        // Remove HTML tags such as <em>.
        $text = html_entity_decode(
            strip_tags($text),
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        );

        $text = trim($text);

        if ($text !== '') {
            $paragraphs[] = $text;
        }
    }

    return implode("\n\n", $paragraphs);
}


// private function fetchLankadeepa(): array
// {
// $feedUrl = 'https://www.lankadeepa.lk/rss/latest_news/1';
//     try {
//         $response = Http::timeout(30)
//             ->withHeaders([
//                 'User-Agent' => 'LankaPulseAI/1.0',
//             ])
//             ->get($feedUrl);

//         if (!$response->successful()) {
//             $this->error('Lankadeepa RSS request failed: ' . $response->status());
//             return [];
//         }

//         libxml_use_internal_errors(true);

//         $xml = simplexml_load_string(
//             $response->body(),
//             'SimpleXMLElement',
//             LIBXML_NOCDATA
//         );

//         if (!$xml || !isset($xml->channel->item)) {
//             $this->error('Unable to parse Lankadeepa RSS feed.');
//             return [];
//         }

//         $namespaces = $xml->getNamespaces(true);
//         $articles = [];

//         foreach ($xml->channel->item as $item) {

//             $title = trim((string) $item->title);
//             $url = trim((string) $item->link);
//             $description = (string) $item->description;

//             // Extract content:encoded if available.
//             $content = '';

//             if (isset($namespaces['content'])) {
//                 $contentItems = $item->children($namespaces['content']);

//                 $content = (string) ($contentItems->encoded ?? '');
//             }

//             // Extract image from description or article content.
//             $imageUrl = null;

//             $html = $description . ' ' . $content;

//             if (preg_match(
//                 '/<img[^>]+src=["\']([^"\']+)["\']/i',
//                 $html,
//                 $imageMatch
//             )) {
//                 $imageUrl = html_entity_decode($imageMatch[1]);
//             }

//             // Check media:content image if available.
//             if (!$imageUrl && isset($namespaces['media'])) {
//                 $media = $item->children($namespaces['media']);

//                 if (isset($media->content)) {
//                     $attributes = $media->content->attributes();

//                     $imageUrl = isset($attributes['url'])
//                         ? (string) $attributes['url']
//                         : null;
//                 }
//             }

//             // Check enclosure image.
//             if (!$imageUrl && isset($item->enclosure)) {
//                 $attributes = $item->enclosure->attributes();

//                 if (
//                     isset($attributes['type']) &&
//                     str_starts_with((string) $attributes['type'], 'image/')
//                 ) {
//                     $imageUrl = (string) $attributes['url'];
//                 }
//             }

//             // Extract publication date.
//             $publishedAt = null;

//             if (!empty((string) $item->pubDate)) {
//                 try {
//                     $publishedAt = \Carbon\Carbon::parse(
//                         (string) $item->pubDate
//                     )->toDateTimeString();
//                 } catch (\Throwable $e) {
//                     $publishedAt = now()->toDateTimeString();
//                 }
//             }

//             // Basic validation.
//             if (empty($title) || empty($url)) {
//                 continue;
//             }

// if (!$this->isValidArticleUrl($url)) {
//     continue;
// }

//             // Clean summary.
//             $summary = trim(
//                 html_entity_decode(
//                     strip_tags($description),
//                     ENT_QUOTES | ENT_HTML5,
//                     'UTF-8'
//                 )
//             );

//             $articles[] = [
//                 'title' => $title,
//                 'url' => $url,
//                 'summary' => $summary,
//                 'content' => null,
//                 'image_url' => $imageUrl,
//                 'source_name' => 'Lankadeepa',
//                 'category' => 'Public',
//                 'language' => 'si',
//                 'published_at' => $publishedAt,
//             ];
//         }

//         libxml_clear_errors();

//         $this->info(
//             'Lankadeepa: received ' . count($articles) . ' articles.'
//         );

//         return $articles;

//     } catch (\Throwable $e) {
//         $this->error('Lankadeepa error: ' . $e->getMessage());

//         return [];
//     }
// }


   private function normalizeArticle(array $item): array
{
    return [
        'title' => $item['title']
            ?? $item['headline']
            ?? $item['name']
            ?? null,

        'url' => $item['url']
            ?? $item['link']
            ?? $item['article_url']
            ?? $item['canonical_url']
            ?? null,

        'summary' => $item['summary']
            ?? $item['description']
            ?? $item['excerpt']
            ?? null,

        'content' => $item['text']
            ?? $item['content']
            ?? $item['body']
            ?? null,

        'image_url' => $item['image']
            ?? $item['image_url']
            ?? $item['thumbnail']
            ?? null,

        'category' => $item['category']
            ?? $item['section']
            ?? 'General',

        'language' => $item['language'] ?? 'en',

        'published_at' => $item['publish_date']
            ?? $item['published_at']
            ?? $item['publishedAt']
            ?? $item['date']
            ?? null,
    ];
}

    private function normalizeTitle(string $title): string
    {
        $title = mb_strtolower(trim($title));
        $title = preg_replace('/[^\p{L}\p{N}\s]/u', '', $title) ?? $title;

        return preg_replace('/\s+/u', ' ', $title) ?? $title;
    }

    private function normalizeUrl(string $url): string
    {
        $parts = parse_url(trim($url));

        if (!$parts || empty($parts['host'])) {
            return strtolower(trim($url));
        }

        $host = strtolower($parts['host']);

        // Treat www.example.com and example.com as the same host.
        $host = preg_replace('/^www\./', '', $host) ?? $host;

        $path = rtrim($parts['path'] ?? '/', '/');

        // Ignore scheme, query string and fragment.
        return $host . $path;
    }

private function isValidArticleUrl(string $url): bool
{
    $url = trim($url);

    if ($url === '') {
        return false;
    }

    // Encode non-ASCII path segments so validation works
    $parts = parse_url($url);

    if (!$parts || empty($parts['scheme']) || empty($parts['host'])) {
        return false;
    }

    $scheme = strtolower($parts['scheme']);
    if (!in_array($scheme, ['http', 'https'], true)) {
        return false;
    }

    // Rebuild a safe URL for validation if needed
    $host = $parts['host'];
    $path = $parts['path'] ?? '/';

    // Percent-encode non-ASCII characters in the path
    $encodedPath = preg_replace_callback(
        '/[^\x20-\x7E]/u',
        fn ($m) => rawurlencode($m[0]),
        $path
    );

    $checkUrl = $scheme . '://' . $host . $encodedPath;

    return filter_var($checkUrl, FILTER_VALIDATE_URL) !== false;
}

private function detectCategory(string $title, ?string $summary = null, ?string $content = null): string
{
    // Prefer title + summary (more reliable than long content)
    $text = mb_strtolower(trim(
        $title . ' ' . ($summary ?? '') . ' ' . mb_substr($content ?? '', 0, 500)
    ));

    $rules = [
        'Weather' => [
            'rainfall', 'heavy rain', 'thundershower', 'low-pressure', 'low pressure',
            'meteorology', 'weather forecast', 'cyclone', 'storm warning', 'showers will',
            'department of meteorology',
        ],
        'Sports' => [
            'cricket', 'odi', 't20', 'test match', 'football', 'rugby', 'athletics',
            'school games', 'tournament', 'innings', 'wicket', 'run chase', 'batting',
        ],
        'Crime' => [
            'arrested', 'arrest', 'bribery', 'ciaboc', 'warrant', 'murder', 'remanded',
            'money laundering', 'suspect', 'detention', 'sentenced', 'fraud case',
            'police arrested', 'court remanded',
        ],
        'Health' => [
            'hospital', 'medical', 'doctor', 'patient', 'vaccine', 'clinic', 'dengue',
            'covid', 'health ministry', 'disease',
        ],
        'Education' => [
            'university', 'school', 'student', 'students', 'exam', 'teacher',
            'education', 'curriculum', 'classroom', 'cfa', 'research challenge',
            'undergraduate', 'faculty',
        ],
        'Environment' => [
            'elephant', 'wildlife', 'conservation', 'dam safety', 'biodiversity',
            'forest', 'pollution', 'climate change', 'environmental',
        ],
        'Technology' => [
            'digital', 'e-filing', 'software', 'artificial intelligence', 'cyber',
            'online system', 'cloud', 'app launch', 'technology',
        ],
        'Economy' => [
            'tax', 'revenue', 'imf', 'export', 'import', 'inflation', 'bond',
            'rupee', 'gdp', 'investment', 'central bank', 'fitch', 'trade deficit',
            'economy', 'finance', 'stock exchange', 'debenture', 'capital market',
        ],
        'International' => [
            'embassy', 'diplomatic', 'united states', 'saudi arabia', 'foreign affairs',
            'overseas', 'high commissioner',
        ],
        'Culture' => [
            'actor', 'actress', 'film', 'movie', 'book fair', 'cinema', 'drama',
            'music', 'festival', 'entertainment',
        ],
        'Public' => [
            'power cut', 'electricity', 'water supply', 'bus', 'transport',
            'motorcycle', 'land release', 'railway', 'public service',
        ],
        'Politics' => [
            'parliament', 'minister', 'president', 'prime minister', 'cabinet',
            'election', 'constitution', 'opposition', 'bill passed', 'government',
            'mp ', 'policy',
        ],
    ];

    $scores = [];

    foreach ($rules as $category => $keywords) {
        $score = 0;
        foreach ($keywords as $keyword) {
            if (str_contains($text, $keyword)) {
                // Longer / more specific keywords get higher weight
                $score += strlen($keyword) > 8 ? 3 : 2;
            }
        }
        if ($score > 0) {
            $scores[$category] = $score;
        }
    }

    if (empty($scores)) {
        return 'Public';
    }

    // Highest score wins
    arsort($scores);
    return array_key_first($scores);
}

}