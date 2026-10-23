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
            'Induwara.lk' => fn () => $this->fetchInduwara(),
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

                    if (
                        $title === '' ||
                        !$this->isValidArticleUrl($url)
                    ) {
                        $skipped++;
                        continue;
                    }

                    try {
                        $wasCreated = DB::transaction(
                            function () use ($article, $title, $url, $sourceName) {
                                // Load existing URL/title pairs for duplicate checks.
                                $existing = NewsArticle::query()
                                    ->get(['url', 'title']);

                                $candidateUrl = $this->normalizeUrl($url);
                                $candidateTitle = $this->normalizeTitle($title);

                                foreach ($existing as $saved) {
                                    if (
                                        $this->normalizeUrl((string) $saved->url)
                                            === $candidateUrl
                                        || $this->normalizeTitle(
                                            (string) $saved->title
                                        ) === $candidateTitle
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
                                    'category' => $article['category'] ?? 'General',
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

                $this->error(
                    "{$sourceName} failed. Check storage/logs/laravel.log."
                );
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
        return filter_var($url, FILTER_VALIDATE_URL) !== false
            && in_array(
                strtolower((string) parse_url($url, PHP_URL_SCHEME)),
                ['http', 'https'],
                true
            );
    }
}
