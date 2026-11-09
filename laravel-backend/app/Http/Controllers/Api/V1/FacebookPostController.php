<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FacebookPost;
use App\Models\NewsArticle;
use App\Services\FacebookPagePublisher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class FacebookPostController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->query('status', 'pending');

        $allowedStatuses = [
            'pending',
            'publishing',
            'published',
            'failed',
        ];

        if (!in_array($status, $allowedStatuses, true)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid status.',
            ], 422);
        }

        $posts = FacebookPost::with([
            'newsArticle:id,title,title_si,image_url,url,source_name',
        ])
            ->where('status', $status)
            ->latest()
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

    public function show($id)
    {
        $post = FacebookPost::with('newsArticle')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $post,
        ]);
    }

    public function publish(
        Request $request,
        FacebookPagePublisher $facebook
    ) {
        $configuredKey = (string) config(
            'services.facebook.publish_api_key'
        );

        $providedKey = (string) $request->header(
            'X-Facebook-Publish-Key'
        );

        if (
            $configuredKey === '' ||
            $providedKey === '' ||
            !hash_equals($configuredKey, $providedKey)
        ) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized publishing request.',
            ], 401);
        }

        $validated = $request->validate([
            'article_id' => ['required', 'integer', 'exists:news_articles,id'],
            'message' => ['required', 'string', 'max:5000'],
            'image' => ['required', 'image', 'mimes:png,jpg,jpeg,webp', 'max:10240'],
        ]);

        $article = NewsArticle::findOrFail($validated['article_id']);

        if ($article->facebook_post_id) {
            return response()->json([
                'success' => false,
                'message' => 'This article has already been published.',
            ], 409);
        }

        $post = FacebookPost::firstOrNew([
            'news_article_id' => $article->id,
        ]);

        if ($post->status === 'publishing') {
            return response()->json([
                'success' => false,
                'message' => 'This article is already being published.',
            ], 409);
        }

        $post->fill([
            'message' => $validated['message'],
            'status' => 'publishing',
            'error_message' => null,
        ]);

        $post->save();

        $article->forceFill([
            'facebook_publish_status' => 'publishing',
            'facebook_error' => null,
        ])->save();

        try {
            $postId = $facebook->publishPhotoFile(
                $request->file('image')->getRealPath(),
                $validated['message']
            );

            $post->update([
                'facebook_post_id' => $postId,
                'post_url' => 'https://www.facebook.com/' . $postId,
                'status' => 'published',
                'published_at' => now(),
                'error_message' => null,
            ]);

            $article->forceFill([
                'facebook_post_id' => $postId,
                'facebook_published_at' => now(),
                'facebook_publish_status' => 'published',
                'facebook_error' => null,
            ])->save();

            return response()->json([
                'success' => true,
                'message' => 'Facebook post published successfully.',
                'facebook_post_id' => $postId,
                'post_url' => 'https://www.facebook.com/' . $postId,
            ]);
        } catch (Throwable $e) {
            $post->update([
                'status' => 'failed',
                'error_message' => mb_substr($e->getMessage(), 0, 5000),
            ]);

            $article->forceFill([
                'facebook_publish_status' => 'failed',
                'facebook_error' => mb_substr($e->getMessage(), 0, 5000),
            ])->save();

            Log::error('Manual Facebook publishing failed', [
                'article_id' => $article->id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Facebook publishing failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}