<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NewsController extends Controller
{
    // GET /api/v1/news
  public function index(Request $request)
{
    $query = NewsArticle::query()
        ->orderByDesc('published_at');

    if ($request->filled('category')) {
        $query->where('category', $request->query('category'));
    }

    return response()->json([
        'success' => true,
         'total' => $query->count(),
        'data' => $query->get(),
       
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
}
