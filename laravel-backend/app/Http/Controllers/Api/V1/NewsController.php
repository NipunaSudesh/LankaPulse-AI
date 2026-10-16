<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    // GET /api/v1/news
    public function index(Request $request)
    {
        $query = NewsArticle::query()
            ->orderByDesc('published_at');

        if ($request->filled('category')) {
            $query->where(
                'category',
                $request->query('category')
            );
        }

        return response()->json([
            'success' => true,
            'data' => $query->paginate(12),
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
}
