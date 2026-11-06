<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacebookPost extends Model
{
    protected $fillable = [
        'news_article_id',
        'facebook_post_id',
        'message',
        'post_url',
        'status',
        'error_message',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function newsArticle(): BelongsTo
    {
        return $this->belongsTo(NewsArticle::class);
    }
}