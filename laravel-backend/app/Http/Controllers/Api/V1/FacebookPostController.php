<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FacebookPost;
use Illuminate\Http\Request;

class FacebookPostController extends Controller
{
    /**
     * Display Facebook posts filtered by status.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        $allowedStatuses = ['pending', 'published', 'failed'];

        if (!in_array($status, $allowedStatuses, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status. Allowed: pending, published, failed.',
            ], 422);
        }

        $posts = FacebookPost::with([
            'newsArticle:id,title,image_url,url,source_name'
        ])
            ->where('status', $status)
            ->latest('created_at')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'status' => $status,
            'total' => $posts->total(),
            'data' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    /**
     * Display a single Facebook post.
     */
    public function show($id)
    {
        $post = FacebookPost::with('newsArticle')
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $post,
        ]);
    }
}
