<?php

namespace App\Services;

use App\Models\NewsArticle;

class FacebookCaptionBuilder
{
    public function build(NewsArticle $article): string
    {
        $titleSi = $this->clean($article->title_si)
            ?: $this->clean($article->title);

        $titleEn = $this->clean($article->title)
            ?: $titleSi;

        $summarySi = $this->clean(
            $article->summary_si ?: $article->content_si
        ) ?: $this->clean($article->summary ?: $article->content);

        $summaryEn = $this->clean(
            $article->summary ?: $article->content
        ) ?: $summarySi;

        $caption = "📰 {$titleSi}";

        if ($summarySi !== '') {
            $caption .= "\n\n" . mb_strimwidth(
                $summarySi,
                0,
                700,
                '...',
                'UTF-8'
            );
        }

        $caption .= "\n\n━━━━━━━━━━━━━━━━━━\n\n";

        $caption .= "🇬🇧 {$titleEn}";

        if ($summaryEn !== '') {
            $caption .= "\n\n" . mb_strimwidth(
                $summaryEn,
                0,
                700,
                '...',
                'UTF-8'
            );
        }

        if ($article->source_name) {
            $caption .= "\n\nමූලාශ්‍රය / Source: "
                . $article->source_name;
        }

        $caption .= "\n\nසම්පූර්ණ පුවත / Read more: "
            . $article->url;

        $caption .= "\n\n#LankaPulseAI #SriLankaNews #ශ්‍රීලංකාව";

        return $caption;
    }

    private function clean(?string $value): string
    {
        $text = html_entity_decode(
            strip_tags((string) $value),
            ENT_QUOTES | ENT_HTML5,
            'UTF-8'
        );

        return preg_replace('/\s+/u', ' ', trim($text)) ?? '';
    }
}