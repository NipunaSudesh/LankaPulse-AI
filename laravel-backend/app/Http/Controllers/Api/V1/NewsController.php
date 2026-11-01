<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Category;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    // GET /api/v1/news
// GET /api/v1/news?category=Technology
public function index(Request $request)
{
    $query = NewsArticle::query()
        ->orderByDesc('published_at');

    if ($request->filled('category')) {
        $categoryInput = trim($request->query('category'));

        // Find category using its name or slug.
        $category = Category::query()
            ->where('is_active', true)
            ->where(function ($q) use ($categoryInput) {
                $q->whereRaw('LOWER(name) = ?', [
                    strtolower($categoryInput),
                ])->orWhereRaw('LOWER(slug) = ?', [
                    strtolower($categoryInput),
                ]);
            })
            ->first();

        $categoryName = $category?->name ?? $categoryInput;
        $categorySlug = $category?->slug ?? $categoryInput;

        $query->where(function ($q) use (
            $categoryName,
            $categorySlug
        ) {
            $q->whereRaw('LOWER(category) = ?', [
                strtolower($categoryName),
            ])->orWhereRaw('LOWER(category) = ?', [
                strtolower($categorySlug),
            ]);
        });
    }

    $total = (clone $query)->count();

    $articles = $query->get();

    return response()->json([
        'success' => true,
        'total' => $total,
        'data' => $articles,
    ]);
}
    // GET /api/v1/news/{newsArticle}
    public function show(NewsArticle $newsArticle)
    {
        return response()->json([
            'success' => true,
            'data' => $newsArticle,
        ]);
    }

    // GET /api/v1/test/world-news
   private function fetchWorldNews(): array
{
    $apiKey = config('services.worldnews.key');

    if (!$apiKey) {
        throw new \RuntimeException(
            'World News API key is missing.'
        );
    }

    $allArticles = [];
    $offset = 0;
    $limit = 100;
    $maxPages = 20;

    for ($page = 0; $page < $maxPages; $page++) {
        $response = Http::acceptJson()
            ->withHeaders(['x-api-key' => $apiKey])
            ->timeout(60)
            ->get('https://api.worldnewsapi.com/search-news', [
                'source-country' => 'lk',
                'language' => 'en',
                'earliest-publish-date' => now('UTC')
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

        $offset += count($items);
    }

    return $allArticles;
}

    // GET /api/v1/test/induwara
   private function fetchInduwara(): array
{
    $allArticles = [];
    $offset = 0;
    $limit = 100;
    $maxPages = 20;

    for ($page = 0; $page < $maxPages; $page++) {
        $response = Http::acceptJson()
            ->timeout(60)
            ->get('https://induwara.lk/api/v1/news', [
                'limit' => $limit,
                'offset' => $offset,
            ]);

        $response->throw();

        $payload = $response->json();

        if (!is_array($payload)) {
            throw new \RuntimeException(
                'Unexpected Induwara API response.'
            );
        }

        $items = $payload['articles']
            ?? $payload['news']
            ?? $payload['results']
            ?? $payload['data']
            ?? $payload;

        if (is_array($items) && !array_is_list($items)) {
            $items = $items['articles']
                ?? $items['news']
                ?? $items['results']
                ?? $items['data']
                ?? [];
        }

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

        if (count($items) < $limit) {
            break;
        }

        $offset += count($items);
    }

    return $allArticles;
}

// GET /api/v1/news/categories
public function categories()
{
    $categories = Category::query()
        ->where('is_active', true)
        ->orderBy('sort_order')
        ->get(['id', 'name', 'slug', 'description', 'img_url']);

    return response()->json([
        'success' => true,
        'total'   => $categories->count(),
        'data'    => $categories,
    ]);
}

// GET /api/v1/test/newsapi
public function testNewsApi()
{
    try {
        $apiKey = config('services.newsapi.key');

        if (!$apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'NewsAPI key is missing in config/services.php',
            ], 500);
        }

        $response = Http::acceptJson()
            ->timeout(30)
            ->get('https://newsapi.org/v2/everything', [
                'q'        => 'Sri Lanka',
                'language' => 'en',
                'sortBy'   => 'publishedAt',
                'pageSize' => 20,          // keep it small for testing
                'page'     => 1,
                'apiKey'   => $apiKey,
            ]);

        $response->throw();

        $items = $response->json('articles', []);

        // Clean removed articles
        $articles = collect($items)
            ->filter(fn ($item) => ($item['title'] ?? '') !== '[Removed]')
            ->map(function ($item) {
                return [
                    'title'        => $item['title'] ?? null,
                    'url'          => $item['url'] ?? null,
                    'summary'      => $item['description'] ?? null,
                    'content'      => $item['content'] ?? $item['description'] ?? null,
                    'image_url'    => $item['urlToImage'] ?? null,
                    'published_at' => $item['publishedAt'] ?? null,
                    'source'       => $item['source']['name'] ?? null,
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'total'   => $articles->count(),
            'data'    => $articles,
        ]);
    } catch (\Throwable $e) {
        Log::error('NewsAPI test failed', ['message' => $e->getMessage()]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

/*
|--------------------------------------------------------------------------
| GET /api/v1/test/lankadeepa
|--------------------------------------------------------------------------
*/

public function testLankadeepa()
{
    try {
        $feedUrl = 'https://www.lankadeepa.lk/RSS_Feeds/latest_news';

        $response = Http::withHeaders([
            'User-Agent' => 'LankaPulse-AI/1.0',
            'Accept' => 'application/rss+xml, application/xml, text/xml',
        ])
            ->timeout(45)
            ->get($feedUrl);

        $response->throw();

        libxml_use_internal_errors(true);

        $xmlBody = $response->body();

        // Extract the RSS document if extra content exists.
        if (preg_match(
            '/<rss\b[^>]*>[\s\S]*?<\/rss>/i',
            $xmlBody,
            $matches
        )) {
            $xmlBody = $matches[0];
        }

        $xml = simplexml_load_string(
            $xmlBody,
            'SimpleXMLElement',
            LIBXML_NONET | LIBXML_NOCDATA
        );

        if ($xml === false) {
            $errors = libxml_get_errors();

            $errorMessages = [];

            foreach ($errors as $error) {
                $errorMessages[] = trim($error->message);
            }

            libxml_clear_errors();

            return response()->json([
                'success' => false,
                'message' => 'Unable to parse Lankadeepa RSS feed.',
                'errors' => $errorMessages,
                'response_preview' => substr($response->body(), 0, 1000),
            ], 500);
        }

        // Get RSS items.
        $items = $xml->channel->item ?? [];

        $articles = [];
        $debugItems = [];

        foreach ($items as $item) {
            $title = trim((string) ($item->title ?? ''));

            $url = trim((string) ($item->link ?? ''));

            // Try GUID if link is missing.
            if (!$url) {
                $url = trim((string) ($item->guid ?? ''));
            }

            // Publication date.
            $publishedAt = trim((string) (
                $item->pubDate
                ?? $item->published
                ?? $item->updated
                ?? ''
            ));

            // Description.
            $description = trim(strip_tags(
                (string) ($item->description ?? '')
            ));

            // Keep diagnostic information for every item.
            $debugItems[] = [
                'title_found' => $title !== '',
                'title' => $title,
                'link_found' => $url !== '',
                'link' => $url,
                'valid_url' => filter_var(
                    $url,
                    FILTER_VALIDATE_URL
                ) !== false,
                'published_at' => $publishedAt ?: null,
                'raw_item' => $item->asXML(),
            ];

            if (
                !$title ||
                !$url ||
                !filter_var($url, FILTER_VALIDATE_URL)
            ) {
                continue;
            }

            $articles[] = [
                'title' => $title,
                'url' => $url,
                'summary' => $description ?: null,
                'image_url' => null,
                'category' => 'General',
                'language' => 'si',
                'published_at' => $publishedAt ?: null,
                'source_name' => 'Lankadeepa',
            ];
        }

        libxml_clear_errors();

        return response()->json([
            'success' => true,
            'source' => 'Lankadeepa',
            'http_status' => $response->status(),
            'total_rss_items' => count($items),
            'valid_articles' => count($articles),
            'data' => $articles,
            'debug_items' => $debugItems,
        ]);

    } catch (\Throwable $e) {
        Log::error('Lankadeepa RSS test failed', [
            'message' => $e->getMessage(),
        ]);

        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}


}
