<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class NewsArticle extends Model
{
    protected $fillable = [
        // Existing news fields
        'title',
        'summary',
        'content',
        'title_si',
        'summary_si',
        'content_si',
        'url',
        'image_url',
        'source_name',
        'category',
        'language',
        'published_at',

        // AI intelligence fields
        'ai_score',
        'ai_priority',
        'ai_category',
        'ai_usefulness_score',
        'ai_impact_score',
        'ai_credibility_score',
        'ai_freshness_score',
        'ai_interest_score',
        'ai_uniqueness_score',
        'ai_confidence',
        'ai_analysis',
        'ai_summary_reason',
        'ai_status',
        'ai_requires_review',
        'ai_analyzed_at',
        'news_event_key',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'ai_analyzed_at' => 'datetime',

            'ai_analysis' => 'array',

            'ai_score' => 'integer',
            'ai_usefulness_score' => 'integer',
            'ai_impact_score' => 'integer',
            'ai_credibility_score' => 'integer',
            'ai_freshness_score' => 'integer',
            'ai_interest_score' => 'integer',
            'ai_uniqueness_score' => 'integer',
            'ai_confidence' => 'integer',

            'ai_requires_review' => 'boolean',
        ];
    }

    public function facebookPost(): HasOne
    {
        return $this->hasOne(FacebookPost::class);
    }
}
