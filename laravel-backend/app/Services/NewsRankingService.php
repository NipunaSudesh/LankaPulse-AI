<?php

namespace App\Services;

use App\Models\NewsArticle;

class NewsRankingService
{
    public function calculate(array $analysis): int
    {
        $weights = [
            'public_usefulness' => 0.25,
            'national_impact' => 0.20,
            'source_credibility' => 0.20,
            'freshness' => 0.15,
            'public_interest' => 0.10,
            'uniqueness' => 0.10,
        ];

        $total = 0;

        foreach ($weights as $field => $weight) {
            $total += $analysis[$field] * $weight;
        }

        return (int) round($total);
    }

    public function priority(int $score): string
    {
        return match (true) {
            $score >= 85 => 'critical',
            $score >= 70 => 'high',
            $score >= 50 => 'medium',
            default => 'low',
        };
    }

    public function save(
        NewsArticle $article,
        array $analysis
    ): void {
        $score = $this->calculate($analysis);

        $needsReview =
            $analysis['requires_human_review'] ||
            $analysis['potentially_misleading'] ||
            $analysis['confidence'] < 60;

        $article->update([
            'ai_score' => $score,
            'ai_priority' => $this->priority($score),
            'ai_category' => $analysis['category'],

            'ai_usefulness_score' => $analysis['public_usefulness'],
            'ai_impact_score' => $analysis['national_impact'],
            'ai_credibility_score' => $analysis['source_credibility'],
            'ai_freshness_score' => $analysis['freshness'],
            'ai_interest_score' => $analysis['public_interest'],
            'ai_uniqueness_score' => $analysis['uniqueness'],

            'ai_confidence' => $analysis['confidence'],
            'ai_analysis' => $analysis,
            'ai_summary_reason' => $analysis['reason'],

            'ai_requires_review' => $needsReview,
            'ai_status' => $needsReview ? 'review' : 'analyzed',
            'ai_analyzed_at' => now(),
        ]);
    }
}
