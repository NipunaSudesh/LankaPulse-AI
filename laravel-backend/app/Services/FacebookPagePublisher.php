<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class FacebookPagePublisher
{
    private function graphUrl(string $pageId): string
    {
        $version = config('services.facebook.graph_version');

        return "https://graph.facebook.com/{$version}/{$pageId}/photos";
    }

    public function publishPhotoPost(
        string $imageUrl,
        string $caption
    ): string {
        $this->validateCredentials();

        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');

        $response = Http::asForm()
            ->connectTimeout(30)
            ->timeout(120)
            ->retry(
                2,
                1000,
                function ($exception) {
                    // Retry only connection-level failures.
                    // Do not blindly retry an uncertain upload.
                    return $exception instanceof \Illuminate\Http\Client\ConnectionException;
                },
                throw: false
            )
            ->post($this->graphUrl($pageId), [
                'url' => $imageUrl,
                'caption' => $caption,
                'access_token' => $token,
            ]);

        return $this->extractPostId($response);
    }

    public function publishPhotoFile(
        string $imagePath,
        string $caption
    ): string {
        $this->validateCredentials();

        if (!file_exists($imagePath) || !is_readable($imagePath)) {
            throw new RuntimeException(
                'Facebook image file does not exist or is not readable.'
            );
        }

        $pageId = config('services.facebook.page_id');
        $token = config('services.facebook.page_access_token');

        $image = fopen($imagePath, 'rb');

        if ($image === false) {
            throw new RuntimeException(
                'Unable to open Facebook image file.'
            );
        }

        try {
            $response = Http::connectTimeout(30)
                ->timeout(180)
                ->attach(
                    'source',
                    $image,
                    basename($imagePath)
                )
                ->post($this->graphUrl($pageId), [
                    'caption' => $caption,
                    'access_token' => $token,
                ]);
        } finally {
            fclose($image);
        }

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

        if (!config('services.facebook.graph_version')) {
            throw new RuntimeException(
                'Facebook Graph API version is missing.'
            );
        }
    }

    private function extractPostId(Response $response): string
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
