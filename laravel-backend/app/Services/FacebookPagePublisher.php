<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class FacebookPagePublisher
{
    public function publishPhotoPost(
        string $imageUrl,
        string $caption
    ): string {
        $this->validateCredentials();

        $version = config('services.facebook.graph_version');
        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');

        $response = Http::asForm()
            ->timeout(60)
            ->post(
                "https://graph.facebook.com/{$version}/{$pageId}/photos",
                [
                    'url' => $imageUrl,
                    'caption' => $caption,
                    'access_token' => $token,
                ]
            );

        return $this->extractPostId($response);
    }

    public function publishPhotoFile(
        string $imagePath,
        string $caption
    ): string {
        $this->validateCredentials();

        if (!file_exists($imagePath)) {
            throw new RuntimeException('Facebook image file does not exist.');
        }

        $version = config('services.facebook.graph_version');
        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');

        $response = Http::timeout(90)
            ->attach(
                'source',
                file_get_contents($imagePath),
                basename($imagePath)
            )
            ->post(
                "https://graph.facebook.com/{$version}/{$pageId}/photos",
                [
                    'caption' => $caption,
                    'access_token' => $token,
                ]
            );

        return $this->extractPostId($response);
    }

    private function validateCredentials(): void
    {
        if (
            !config('services.facebook.page_id') ||
            !config('services.facebook.page_access_token')
        ) {
            throw new RuntimeException(
                'Facebook Page ID or Page Access Token is missing.'
            );
        }
    }

    private function extractPostId($response): string
    {
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