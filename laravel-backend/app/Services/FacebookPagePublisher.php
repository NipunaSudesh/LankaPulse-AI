<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class FacebookPagePublisher
{
    public function publishPhotoPost(string $imageUrl, string $caption): string
    {
        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');
        $version = config('services.facebook.graph_version', 'v21.0');

        if (!$pageId || !$token) {
            throw new RuntimeException(
                'Facebook Page ID or access token is not configured.'
            );
        }

        $response = Http::asForm()
            ->timeout(30)
            ->retry(2, 1000, throw: false)
            ->post(
                "https://graph.facebook.com/{$version}/{$pageId}/photos",
                [
                    'url' => $imageUrl,
                    'caption' => $caption,
                    'access_token' => $token,
                ]
            );

        if ($response->failed()) {
            throw new RuntimeException(
                'Facebook API error: ' .
                ($response->json('error.message') ?? $response->body())
            );
        }

        $postId = $response->json('post_id')
            ?? $response->json('id');

        if (!$postId) {
            throw new RuntimeException(
                'Facebook API returned success without a post ID.'
            );
        }

        return (string) $postId;
    }
}
