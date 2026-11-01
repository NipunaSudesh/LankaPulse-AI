<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

    // GET /api/v1/categories
    public function categories()
    {
        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get([
                'id',
                'name',
                'slug',
                'description',
                'img_url',
            ]);

        return response()->json([
            'success' => true,
            'total' => $categories->count(),
            'data' => $categories,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | World News API
    |--------------------------------------------------------------------------
    */

    // GET /api/v1/test/world-news
    public function testWorldNews()
    {
        try {
            $articles = $this->fetchWorldNews();

            return response()->json([
                'success' => true,
                'source' => 'World News API',
                'total' => count($articles),
                'data' => $articles,
            ]);
        } catch (\Throwable $e) {
            Log::error('World News API test failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
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
        $offset = 0;

        for ($page = 0; $page < 4; $page++) {
            $response = Http::acceptJson()
                ->withHeaders([
                    'x-api-key' => $apiKey,
                ])
                ->timeout(60)
                ->get(
                    'https://api.worldnewsapi.com/search-news',
                    [
                        'source-country' => 'lk',
                        'language' => 'en',
                        'earliest-publish-date' => now('UTC')
                            ->subDays(30)
                            ->format('Y-m-d H:i:s'),
                        'sort' => 'publish-time',
                        'sort-direction' => 'DESC',
                        'number' => $limit,
                        'offset' => $offset,
                    ]
                );

            $response->throw();

            $items = $response->json('news', []);

            if (!is_array($items) || empty($items)) {
                break;
            }

            foreach ($items as $item) {
                if (!is_array($item)) {
                    continue;
                }

                $allArticles[] = $this->normalizeArticle([
                    'title' => $item['title'] ?? null,
                    'url' => $item['url'] ?? null,
                    'summary' => $item['summary'] ?? null,
                    'published_at' => $item['publish_date'] ?? null,
                    'language' => $item['language'] ?? 'en',
                    'source_name' => 'World News API',
                ]);
            }

            Log::info('World News API page fetched', [
                'page' => $page + 1,
                'count' => count($items),
            ]);

            if (count($items) < $limit) {
                break;
            }

            $offset += count($items);
        }

        return $allArticles;
    }

    /*
    |--------------------------------------------------------------------------
    | Induwara.lk API
    |--------------------------------------------------------------------------
    */

    // GET /api/v1/test/induwara
    public function testInduwara()
    {
        try {
            $articles = $this->fetchInduwara();

            return response()->json([
                'success' => true,
                'source' => 'Induwara.lk',
                'total' => count($articles),
                'data' => $articles,
            ]);
        } catch (\Throwable $e) {
            Log::error('Induwara API test failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function fetchInduwara(): array
    {
        $allArticles = [];
        $limit = 100;
        $offset = 0;

        for ($page = 0; $page < 5; $page++) {
            $response = Http::acceptJson()
                ->timeout(60)
                ->get(
                    'https://induwara.lk/api/v1/news',
                    [
                        'limit' => $limit,
                        'offset' => $offset,
                    ]
                );

            $response->throw();

            $payload = $response->json();

            if (!is_array($payload)) {
                throw new \RuntimeException(
                    'Unexpected Induwara API response.'
                );
            }

            // Induwara response: data.posts
            $items = $payload['data']['posts']
                ?? $payload['articles']
                ?? $payload['news']
                ?? $payload['results']
                ?? [];

            if (!is_array($items) || empty($items)) {
                break;
            }

            foreach ($items as $item) {
                if (!is_array($item)) {
                    continue;
                }

                $allArticles[] = $this->normalizeArticle([
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

                    'published_at' => $item['publishedAt']
                        ?? $item['updatedAt']
                        ?? $item['published_at']
                        ?? $item['published']
                        ?? $item['publish_date']
                        ?? $item['created_at']
                        ?? $item['createdAt']
                        ?? $item['date']
                        ?? null,

                    'language' => $item['language'] ?? 'si',
                    'source_name' => 'Induwara.lk',
                ]);
            }

            Log::info('Induwara API page fetched', [
                'page' => $page + 1,
                'count' => count($items),
            ]);

            if (count($items) < $limit) {
                break;
            }

            $offset += $limit;
        }

        return $allArticles;
    }

    /*
    |--------------------------------------------------------------------------
    | NewsAPI
    |--------------------------------------------------------------------------
    */

    // GET /api/v1/test/newsapi
    public function testNewsApi()
    {
        try {
            $apiKey = config('services.newsapi.key');

            if (!$apiKey) {
                throw new \RuntimeException(
                    'NewsAPI key is missing.'
                );
            }

            $response = Http::acceptJson()
                ->timeout(30)
                ->get('https://newsapi.org/v2/everything', [
                    'q' => 'Sri Lanka',
                    'language' => 'en',
                    'sortBy' => 'publishedAt',
                    'pageSize' => 20,
                    'page' => 1,
                    'apiKey' => $apiKey,
                ]);

            $response->throw();

            $items = $response->json('articles', []);

            $articles = collect($items)
                ->filter(fn ($item) =>
                    ($item['title'] ?? '') !== '[Removed]'
                )
                ->map(function ($item) {
                    return [
                        'title' => $item['title'] ?? null,
                        'url' => $item['url'] ?? null,
                        'summary' => $item['description'] ?? null,
                        'content' => $item['content'] ?? null,
                        'image_url' => $item['urlToImage'] ?? null,
                        'published_at' => $item['publishedAt'] ?? null,
                        'source_name' => $item['source']['name'] ?? null,
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'source' => 'NewsAPI',
                'total' => $articles->count(),
                'data' => $articles,
            ]);
        } catch (\Throwable $e) {
            Log::error('NewsAPI test failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Normalize API Article
    |--------------------------------------------------------------------------
    */

    private function normalizeArticle(array $item): array
    {
        return [
            'title' => isset($item['title'])
                ? trim(strip_tags((string) $item['title']))
                : null,

            'url' => isset($item['url'])
                ? trim((string) $item['url'])
                : null,

            'summary' => isset($item['summary'])
                ? trim(strip_tags((string) $item['summary']))
                : null,

            'content' => $item['content'] ?? null,

            'image_url' => $item['image_url'] ?? null,

            'category' => $item['category'] ?? 'General',

            'language' => $item['language'] ?? 'en',

            'published_at' => $item['published_at'] ?? null,

            'source_name' => $item['source_name'] ?? null,
        ];
    }
}
