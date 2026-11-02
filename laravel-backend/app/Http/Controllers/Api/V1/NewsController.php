<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/v1/news
    | GET /api/v1/news?category=Technology
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $query = NewsArticle::query()
            ->orderByDesc('published_at');

        // Category filtering.
        if ($request->filled('category')) {

            $categoryInput = trim(
                $request->query('category')
            );

            $category = Category::query()
                ->where('is_active', true)
                ->where(function ($q) use ($categoryInput) {
                    $q->whereRaw(
                        'LOWER(name) = ?',
                        [mb_strtolower($categoryInput)]
                    )->orWhereRaw(
                        'LOWER(slug) = ?',
                        [mb_strtolower($categoryInput)]
                    );
                })
                ->first();

            $categoryName = $category?->name
                ?? $categoryInput;

            $categorySlug = $category?->slug
                ?? $categoryInput;

            $query->where(function ($q) use (
                $categoryName,
                $categorySlug
            ) {
                $q->whereRaw(
                    'LOWER(category) = ?',
                    [mb_strtolower($categoryName)]
                )->orWhereRaw(
                    'LOWER(category) = ?',
                    [mb_strtolower($categorySlug)]
                );
            });
        }

        // Total matching articles.
        $total = (clone $query)->count();

        // Return all matching articles.
        $articles = $query->get();

        return response()->json([
            'success' => true,
            'total' => $total,
            'data' => $articles,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/v1/news/{newsArticle}
    |--------------------------------------------------------------------------
    */

    public function show(NewsArticle $newsArticle)
    {
        return response()->json([
            'success' => true,
            'data' => $newsArticle,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | GET /api/v1/news/categories
    |--------------------------------------------------------------------------
    */

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
    | GET /api/v1/test/newsapi
    |--------------------------------------------------------------------------
    */

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
                ->get(
                    'https://newsapi.org/v2/everything',
                    [
                        'q' => '"Sri Lanka"',
                        'language' => 'en',
                        'sortBy' => 'publishedAt',
                        'pageSize' => 20,
                        'page' => 1,
                        'apiKey' => $apiKey,
                    ]
                );

            $response->throw();

            $items = $response->json('articles', []);

            if (!is_array($items)) {
                $items = [];
            }

            $articles = collect($items)
                ->filter(function ($item) {
                    return is_array($item)
                        && ($item['title'] ?? '') !== '[Removed]';
                })
                ->map(function ($item) {
                    return [
                        'title' => $item['title'] ?? null,

                        'url' => $item['url'] ?? null,

                        'summary' => $item['description'] ?? null,

                        'content' => $item['content']
                            ?? $item['description']
                            ?? null,

                        'image_url' => $item['urlToImage'] ?? null,

                        'published_at' => $item['publishedAt'] ?? null,

                        'source_name' => $item['source']['name'] ?? null,

                        'language' => 'en',
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'total' => $articles->count(),
                'data' => $articles,
            ]);

        } catch (\Throwable $e) {

            Log::error('NewsAPI test failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to fetch NewsAPI articles.',
                'error' => config('app.debug')
                    ? $e->getMessage()
                    : null,
            ], 500);
        }
    }

    
// public function testLankadeepa()
// {
//     try {
// $feedUrl = 'https://www.lankadeepa.lk/rss/latest_news/1';

//         $response = Http::timeout(30)
//             ->withHeaders([
//                 'User-Agent' => 'LankaPulseAI/1.0',
//             ])
//             ->get($feedUrl);

//         if (!$response->successful()) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Lankadeepa RSS request failed.',
//                 'status' => $response->status(),
//             ], 502);
//         }

//         libxml_use_internal_errors(true);

//         $xml = simplexml_load_string(
//             $response->body(),
//             'SimpleXMLElement',
//             LIBXML_NOCDATA
//         );

//         if (!$xml || !isset($xml->channel->item)) {
//             return response()->json([
//                 'success' => false,
//                 'message' => 'Unable to parse RSS feed.',
//             ], 500);
//         }

//         $namespaces = $xml->getNamespaces(true);
//         $articles = [];

//         foreach ($xml->channel->item as $item) {
//             $title = trim((string) $item->title);
//             $url = trim((string) $item->link);
//             $description = (string) $item->description;

//             $content = '';

//             if (isset($namespaces['content'])) {
//                 $contentItems = $item->children($namespaces['content']);
//                 $content = (string) ($contentItems->encoded ?? '');
//             }

//             $html = $description . ' ' . $content;
//             $imageUrl = null;

//             if (preg_match(
//                 '/<img[^>]+src=["\']([^"\']+)["\']/i',
//                 $html,
//                 $imageMatch
//             )) {
//                 $imageUrl = html_entity_decode($imageMatch[1]);
//             }

//             if (!$imageUrl && isset($namespaces['media'])) {
//                 $media = $item->children($namespaces['media']);

//                 if (isset($media->content)) {
//                     $attributes = $media->content->attributes();

//                     $imageUrl = isset($attributes['url'])
//                         ? (string) $attributes['url']
//                         : null;
//                 }
//             }

//             if (!$imageUrl && isset($item->enclosure)) {
//                 $attributes = $item->enclosure->attributes();

//                 if (
//                     isset($attributes['type']) &&
//                     str_starts_with((string) $attributes['type'], 'image/')
//                 ) {
//                     $imageUrl = (string) $attributes['url'];
//                 }
//             }

//             $publishedAt = null;

//             if (!empty((string) $item->pubDate)) {
//                 try {
//                     $publishedAt = \Carbon\Carbon::parse(
//                         (string) $item->pubDate
//                     )->toDateTimeString();
//                 } catch (\Throwable $e) {
//                     $publishedAt = null;
//                 }
//             }

//             if (empty($title) || empty($url)) {
//                 continue;
//             }

//             $articles[] = [
//                 'title' => $title,
//                 'url' => $url,
//                 'summary' => trim(html_entity_decode(
//                     strip_tags($description),
//                     ENT_QUOTES | ENT_HTML5,
//                     'UTF-8'
//                 )),
//                 'content' => $content ?: null,
//                 'image_url' => $imageUrl,
//                 'source_name' => 'Lankadeepa',
//                 'category' => 'Public',
//                 'language' => 'si',
//                 'published_at' => $publishedAt,
//             ];
//         }

//         libxml_clear_errors();

//         return response()->json([
//             'success' => true,
//             'source' => 'Lankadeepa',
//             'total' => count($articles),
//             'data' => $articles,
//         ]);

//     } catch (\Throwable $e) {
//         return response()->json([
//             'success' => false,
//             'message' => $e->getMessage(),
//         ], 500);
//     }
// }

}
