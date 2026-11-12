<?php

namespace App\Services;

use App\Models\NewsArticle;
use Spatie\Browsershot\Browsershot;
use RuntimeException;

class FacebookGraphicGenerator
{
    public function generate(NewsArticle $article): string
    {
        $directory = storage_path('app/facebook-graphics');

        if (
            !is_dir($directory) &&
            !mkdir($directory, 0755, true) &&
            !is_dir($directory)
        ) {
            throw new RuntimeException(
                'Unable to create Facebook graphics directory.'
            );
        }

        $path = $directory . '/article-' . $article->id . '-' . uniqid() . '.png';

        $html = $this->buildHtml($article);

        try {
            $browser = Browsershot::html($html)
                ->windowSize(1080, 1350)
                ->setScreenshotType('png')
                ->waitUntilNetworkIdle();

            $browser->setNodeModulePath(base_path('node_modules'));

            $browser->save($path);
        } catch (\Throwable $e) {
            throw new RuntimeException(
                'Facebook graphic generation failed: ' . $e->getMessage(),
                previous: $e
            );
        }

        if (!file_exists($path) || filesize($path) === 0) {
            throw new RuntimeException(
                'Generated Facebook graphic is empty.'
            );
        }

        return $path;
    }

    private function buildHtml(NewsArticle $article): string
    {
        $titleSi = $this->escape(
            $article->title_si ?: $article->title
        );

        $titleEn = $this->escape(
            $article->title ?: $article->title_si
        );

        $imageUrl = trim((string) $article->image_url);

        if (
            $imageUrl !== '' &&
            !filter_var($imageUrl, FILTER_VALIDATE_URL)
        ) {
            $imageUrl = '';
        }

        $imageStyle = $imageUrl !== ''
            ? "background-image: url('" . $this->escape($imageUrl) . "');"
            : '';

        $date = $article->published_at
            ? $article->published_at->format('Y-m-d')
            : now()->format('Y-m-d');

        $date = $this->escape($date);

        // Load logo from Laravel public directory.
        $logoPath = public_path('LP_logo.png');

        $logoHtml = '';

        if (file_exists($logoPath)) {
            $logoBase64 = base64_encode(
                file_get_contents($logoPath)
            );

            $logoHtml = '
                <div class="logo-box">
                    <img
                        src="data:image/png;base64,' . $logoBase64 . '"
                        alt="LankaPulse AI"
                    >
                </div>
            ';
        }

        return <<<HTML
<!DOCTYPE html>
<html lang="si">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080, initial-scale=1">

<style>
* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
}

body {
    font-family:
        "Noto Sans Sinhala",
        "Iskoola Pota",
        "Nirmala UI",
        sans-serif;

    background: #081326;
    color: white;
}

.poster {
    position: relative;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
    background: #081326;
}

/* HEADER */

.header {
    position: absolute;
    top: 0;
    left: 0;
    width: 1080px;
    height: 170px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;

    background: linear-gradient(
        90deg,
        #6b0812,
        #e11d2e 50%,
        #6b0812
    );

    box-shadow: 0 12px 40px rgba(0,0,0,.45);
    z-index: 5;
}

.brand,
.alert {
    font-size: 78px;
    font-weight: 900;
    font-style: italic;
    letter-spacing: -2px;
    white-space: nowrap;
}

.alert {
    color: #facc15;
}

/* NEWS IMAGE */

.photo-area {
    position: absolute;
    top: 170px;
    left: 0;
    width: 1080px;
    height: 840px;
    overflow: hidden;

    background: linear-gradient(
        160deg,
        #0b1d3a,
        #6b0812
    );
}

.photo {
    position: absolute;
    inset: 0;

    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;

    z-index: 1;
}

.photo-overlay {
    position: absolute;
    inset: 0;

    background: linear-gradient(
        to bottom,
        rgba(0,0,0,.35),
        transparent 40%,
        transparent
    );

    z-index: 2;
}

/* LOGO AND BRAND NAME ON PHOTO */

.photo-brand {
    position: absolute;
    right: 16px;
    bottom: 150px;

    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px 16px;

    /* Solid black background */
    background: #000000;

    border: 1px solid rgba(255,255,255,.25);
    border-radius: 12px;

    box-shadow: 0 10px 30px rgba(0,0,0,.4);

    z-index: 3;
}

.logo-box {
    position: relative;
    width: 68px;
    height: 68px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 4px;

    background: #0f172a;
    border: 1px solid rgba(34,211,238,.3);
    border-radius: 12px;

    box-shadow: 0 0 15px rgba(34,211,238,.2);
    overflow: hidden;
    flex-shrink: 0;
}

.logo-box img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
}

.brand-name {
    font-size: 30px;
    font-weight: 900;
    letter-spacing: -0.5px;
    white-space: nowrap;
    color: #ffffff;
}

.brand-name span {
    color: #67e8f9;
}

/* DATE BADGE */

.date {
    position: absolute;
    top: 200px;
    left: 40px;

    z-index: 6;

    padding: 8px 24px;
    border-radius: 8px;

    background: rgba(0,0,0,.75);

    color: white;
    font-size: 34px;
    font-weight: 600;
    letter-spacing: 1px;
}

/* HEADLINE PANEL */

.headline-panel {
    position: absolute;
    left: 0;
    bottom: 0;

    width: 1080px;
    height: 440px;

    display: flex;
    flex-direction: column;

    background: linear-gradient(
        to bottom,
        transparent 0,
        #e11d2e 95px,
        #6b0812 100%
    );

    z-index: 4;
}

.headline-content {
    flex: 1;

    display: flex;
    flex-direction: column;
    justify-content: center;

    padding: 20px 56px 0;
    text-align: center;
}

.title-si {
    max-height: 230px;
    overflow: hidden;

    font-size: 50px;
    font-weight: 800;
    line-height: 1.35;

    color: #ffffff;

    text-shadow: 0 3px 14px rgba(0,0,0,.35);
    overflow-wrap: anywhere;
}

.title-en {
    max-height: 82px;
    overflow: hidden;

    margin: 16px auto 0;
    max-width: 900px;

    color: rgba(255,255,255,.85);

    font-size: 30px;
    line-height: 1.35;

    overflow-wrap: anywhere;
}
</style>
</head>

<body>

<div class="poster">

    <!-- NEWS IMAGE -->
    <div class="photo-area">

        <div
            class="photo"
            style="{$imageStyle}"
        ></div>

        <div class="photo-overlay"></div>

        <!-- LANKAPULSE AI BRANDING ON IMAGE -->
        <div class="photo-brand">

            {$logoHtml}

            <div class="brand-name">
                LankaPulse <span>AI</span>
            </div>

        </div>

    </div>

    <!-- HEADER -->
    <div class="header">

        <span class="brand">LANKAPULSE</span>

        <span class="alert">ALERT</span>

    </div>

    <!-- DATE -->
    <div class="date">
        {$date}
    </div>

    <!-- HEADLINE -->
    <div class="headline-panel">

        <div class="headline-content">

            <div class="title-si">
                {$titleSi}
            </div>

            <div class="title-en">
                {$titleEn}
            </div>

        </div>

    </div>

</div>

</body>
</html>
HTML;
    }

    private function escape(?string $value): string
    {
        return htmlspecialchars(
            (string) $value,
            ENT_QUOTES | ENT_SUBSTITUTE,
            'UTF-8'
        );
    }
}
