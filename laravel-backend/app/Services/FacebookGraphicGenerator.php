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

        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $directory . '/article-' . $article->id . '-' . uniqid() . '.png';

        $html = $this->buildHtml($article);

        try {
            $browser = Browsershot::html($html)
                ->windowSize(1200, 630)
                ->setScreenshotType('png');

            // Use the backend's installed Puppeteer package.
            $browser->setNodeModulePath(base_path('node_modules'));

            $browser->save($path);
        } catch (\Throwable $e) {
            throw new RuntimeException(
                'Facebook graphic generation failed: ' . $e->getMessage(),
                previous: $e
            );
        }

        if (!file_exists($path) || filesize($path) === 0) {
            throw new RuntimeException('Generated Facebook graphic is empty.');
        }

        return $path;
    }

    private function buildHtml(NewsArticle $article): string
    {
        $titleSi = $this->escape(
            $article->title_si ?: $article->title
        );

        $titleEn = $this->escape($article->title);

        $summarySi = $this->escape(
            $article->summary_si ?: $article->summary
        );

        $summaryEn = $this->escape(
            $article->summary ?: $article->content
        );

        $imageUrl = $this->escape($article->image_url ?? '');

        $source = $this->escape(
            $article->source_name ?? 'LankaPulse AI'
        );

        $imageStyle = $imageUrl !== ''
            ? "background-image: url('{$imageUrl}');"
            : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="si">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1200, initial-scale=1">

<style>
* {
    box-sizing: border-box;
}

html, body {
    margin: 0;
    padding: 0;
    width: 1200px;
    height: 630px;
    overflow: hidden;
}

body {
    font-family:
        "Noto Sans Sinhala",
        "Iskoola Pota",
        "Nirmala UI",
        Arial,
        sans-serif;
    background: #081326;
    color: white;
}

.container {
    width: 1200px;
    height: 630px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(115deg, #071426, #142e52);
}

.photo {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.48;
}

.overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        90deg,
        rgba(4, 13, 29, 0.98) 0%,
        rgba(4, 13, 29, 0.90) 45%,
        rgba(4, 13, 29, 0.25) 100%
    );
}

.content {
    position: relative;
    z-index: 2;
    padding: 55px 65px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.brand {
    font-size: 27px;
    font-weight: 900;
    letter-spacing: 1px;
    color: #ffffff;
}

.brand span {
    color: #38bdf8;
}

.tagline {
    font-size: 13px;
    color: #b8c9dc;
    margin-top: 4px;
    letter-spacing: 2px;
}

.category {
    display: inline-block;
    background: #0ea5e9;
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 8px 16px;
    border-radius: 5px;
    margin-top: 40px;
    width: fit-content;
}

.title-si {
    font-size: 36px;
    font-weight: 800;
    line-height: 1.45;
    margin-top: 22px;
    max-width: 1000px;
    color: #ffffff;
}

.title-en {
    font-size: 21px;
    color: #cbd5e1;
    margin-top: 15px;
    max-width: 950px;
    line-height: 1.4;
}

.footer {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255,255,255,.25);
    padding-top: 17px;
    color: #dbeafe;
    font-size: 15px;
}

.url {
    color: #38bdf8;
    font-weight: bold;
}
</style>
</head>

<body>
<div class="container">

    <div class="photo" style="{$imageStyle}"></div>
    <div class="overlay"></div>

    <div class="content">

        <div>
            <div class="brand">
                LANKA<span>PULSE</span> AI
            </div>

            <div class="tagline">
                SRI LANKA NEWS INTELLIGENCE
            </div>
        </div>

        <div class="category">
            BREAKING NEWS
        </div>

        <div class="title-si">
            {$titleSi}
        </div>

        <div class="title-en">
            {$titleEn}
        </div>

        <div class="footer">
            <div>
                {$source}
            </div>

            <div class="url">
                LANKAPULSE AI
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