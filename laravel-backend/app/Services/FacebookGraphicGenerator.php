<?php

namespace App\Services;

use App\Models\NewsArticle;
use RuntimeException;
use Spatie\Browsershot\Browsershot;

/**
 * Renders the "Alert Poster" (1080x1350) on the server.
 * Mirrors AlertGraphic in the React Graphic Studio, so keep the two in sync.
 */
class FacebookGraphicGenerator
{
    private const WIDTH = 1080;
    private const HEIGHT = 1350;

    // Same palette as THEMES in the React page.
    private const THEMES = [
        'alert'   => ['from' => '#e11d2e', 'to' => '#6b0812', 'chip' => '#facc15'],
        'pulse'   => ['from' => '#0000e6', 'to' => '#020a5c', 'chip' => '#00ffff'],
        'emerald' => ['from' => '#00b894', 'to' => '#013d33', 'chip' => '#00ff9d'],
    ];

    private const DEFAULTS = [
        'theme'        => 'alert',
        'sinhala_size' => 50,
        'show_en'      => true,
        'show_date'    => true,
        'zoom'         => 1.0,
        'x'            => 50,
        'y'            => 50,
    ];

    // Put the font you use on the website first. It must be installed on the server.
    private const LATIN_FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
    private const SINHALA_FONT = "'Noto Sans Sinhala', 'Iskoola Pota', 'Nirmala UI', sans-serif";

    public function generate(NewsArticle $article, array $options = []): string
    {
        $directory = storage_path('app/facebook-graphics');

        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new RuntimeException('Unable to create Facebook graphics directory.');
        }

        $path = $directory . '/article-' . $article->id . '-' . uniqid() . '.png';

        $html = $this->buildHtml($article, $this->normalizeOptions($options));

        try {
            Browsershot::html($html)
                ->setNodeModulePath(base_path('node_modules'))
                ->windowSize(self::WIDTH, self::HEIGHT)
                ->deviceScaleFactor(1)
                ->setScreenshotType('png')
                ->waitUntilNetworkIdle()
                ->save($path);
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

    private function normalizeOptions(array $options): array
    {
        $o = array_merge(self::DEFAULTS, $options);

        return [
            'theme'       => self::THEMES[$o['theme']] ?? self::THEMES['alert'],
            'sinhalaSize' => max(40, min(90, (int) $o['sinhala_size'])),
            'showEn'      => filter_var($o['show_en'], FILTER_VALIDATE_BOOLEAN),
            'showDate'    => filter_var($o['show_date'], FILTER_VALIDATE_BOOLEAN),
            'zoom'        => round(max(1.0, min(2.5, (float) $o['zoom'])), 2),
            'x'           => round(max(0.0, min(100.0, (float) $o['x'])), 2),
            'y'           => round(max(0.0, min(100.0, (float) $o['y'])), 2),
        ];
    }

    private function buildHtml(NewsArticle $article, array $o): string
    {
        $titleSi = $this->escape($article->title_si ?: $article->title);
        $titleEn = $this->escape($article->title ?: $article->title_si);

        $date = $this->escape(
            ($article->published_at ?? now())->format('Y-m-d')
        );

        // Theme colours come from the constant above, never from user input.
        $from = $o['theme']['from'];
        $to = $o['theme']['to'];
        $chip = $o['theme']['chip'];

        $sinhalaSize = $o['sinhalaSize'];
        $titleSiMax = $o['showEn'] ? 230 : 290;

        $latinFont = self::LATIN_FONT;
        $sinhalaFont = self::SINHALA_FONT;

        // News photo (same behaviour as NewsPhoto in React: contain + position + zoom).
        $imageUrl = trim((string) $article->image_url);
        $photoHtml = '';

        if ($imageUrl !== '' && filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            $src = $this->escape($imageUrl);
            $photoHtml = sprintf(
                '<img class="photo" src="%s" alt="" style="object-position:%s%% %s%%;transform:scale(%s);transform-origin:%s%% %s%%;">',
                $src,
                $o['x'], $o['y'], $o['zoom'], $o['x'], $o['y']
            );
        }

        // Logo from the Laravel public directory, embedded as base64.
        $logoHtml = '';
        $logoPath = public_path('LP_logo.png');

        if (file_exists($logoPath)) {
            $logoBase64 = base64_encode(file_get_contents($logoPath));
            $logoHtml = '<div class="logo-wrap"><div class="logo-box">'
                . '<img src="data:image/png;base64,' . $logoBase64 . '" alt="LankaPulse AI">'
                . '</div></div>';
        }

        $dateHtml = $o['showDate']
            ? '<div class="date">' . $date . '</div>'
            : '';

        $titleEnHtml = $o['showEn']
            ? '<div class="title-en">' . $titleEn . '</div>'
            : '';

        return <<<HTML
<!DOCTYPE html>
<html lang="si">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080, initial-scale=1">

<style>
* { box-sizing: border-box; }

html, body {
    margin: 0;
    padding: 0;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
}

body {
    font-family: {$latinFont};
    line-height: 1.5;               /* Tailwind's default, keeps badge heights identical */
    background: #081326;
    color: #ffffff;
}

.poster {
    position: relative;
    width: 1080px;
    height: 1350px;
    overflow: hidden;
    background: #081326;
}

/* ---------- Header ---------- */

.header {
    position: absolute;
    top: 0;
    left: 0;
    width: 1080px;
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, {$to}, {$from} 50%, {$to});
    box-shadow: 0 12px 40px rgba(0,0,0,.45);
    z-index: 5;
}

.header-text {
    display: flex;
    align-items: baseline;
    gap: 20px;
    font-style: italic;
}

.header-text span {
    font-size: 78px;
    font-weight: 900;
    letter-spacing: -0.025em;
    white-space: nowrap;
}

.header-text .alert {
    color: {$chip};
    text-shadow: 0 0 30px rgba(255,255,255,.25);
}

/* ---------- Photo area ---------- */

.photo-area {
    position: absolute;
    top: 170px;
    left: 0;
    width: 1080px;
    height: 840px;
    overflow: hidden;
    background: linear-gradient(160deg, #0b1d3a, {$to});
}

.photo {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 1;
}

.photo-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,0) 50%, rgba(0,0,0,0));
    z-index: 2;
}

/* ---------- Brand badge on the photo ---------- */

.photo-brand {
    position: absolute;
    right: 16px;
    bottom: 120px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px;
    background: #000000;
    border: 1px solid rgba(255,255,255,.25);
    border-radius: 12px;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,.25);
    z-index: 3;
}

.logo-wrap {
    position: relative;
    flex-shrink: 0;
}

.logo-wrap::before {
    content: "";
    position: absolute;
    inset: -4px;
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(34,211,238,.4), rgba(37,99,235,.4));
    filter: blur(12px);
}

.logo-box {
    position: relative;
    width: 62px;                    /* 52px logo + 4px padding + 1px border, each side */
    height: 62px;
    padding: 4px;
    overflow: hidden;
    background: #0f172a;
    border: 1px solid rgba(34,211,238,.2);
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1);
}

.logo-box img {
    display: block;
    width: 52px;
    height: 52px;
    object-fit: contain;
    border-radius: 8px;
}

.brand-name {
    font-size: 25px;
    font-weight: 900;
    letter-spacing: -0.025em;
    white-space: nowrap;
    color: #ffffff;
}

.brand-name span { color: #67e8f9; }

/* ---------- Date badge ---------- */

.date {
    position: absolute;
    top: 200px;
    left: 40px;
    z-index: 6;
    padding: 8px 24px;
    border-radius: 8px;
    background: rgba(0,0,0,.75);
    font-size: 34px;
    font-weight: 600;
    letter-spacing: 0.025em;
}

/* ---------- Headline panel ---------- */

.headline-panel {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 1080px;
    height: 440px;
    display: flex;
    flex-direction: column;
    background: linear-gradient(to bottom, transparent 0, {$from} 95px, {$to} 100%);
    z-index: 4;
}

.headline-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 60px;
    padding: 0 16px;
    text-align: center;
}

.title-si {
    max-height: {$titleSiMax}px;
    overflow: hidden;
    font-family: {$sinhalaFont};
    font-size: {$sinhalaSize}px;
    font-weight: 800;
    line-height: 1.35;
    text-shadow: 0 3px 14px rgba(0,0,0,.35);
    overflow-wrap: anywhere;
}

.title-en {
    max-height: 82px;
    max-width: 900px;
    margin: 16px auto 0;
    overflow: hidden;
    font-size: 30px;
    line-height: 1.35;
    color: rgba(255,255,255,.85);
    overflow-wrap: anywhere;
}
</style>
</head>

<body>
<div class="poster">

    <div class="photo-area">
        {$photoHtml}
        <div class="photo-overlay"></div>

        <div class="photo-brand">
            {$logoHtml}
            <div class="brand-name">LankaPulse <span>AI</span></div>
        </div>
    </div>

    <div class="header">
        <div class="header-text">
            <span>LANKAPULSE</span>
            <span class="alert">ALERT</span>
        </div>
    </div>

    {$dateHtml}

    <div class="headline-panel">
        <div class="headline-content">
            <div class="title-si">{$titleSi}</div>
            {$titleEnHtml}
        </div>
    </div>

</div>
</body>
</html>
HTML;
    }

    private function escape(?string $value): string
    {
        return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}