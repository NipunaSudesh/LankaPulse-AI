<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
{
    protected $fillable = [
        'title',
        'summary',
        'content',
        'url',
        'image_url',
        'title_si',
'summary_si',
'content_si',
        'source_name',
        'category',
        'language',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
    public function facebookPost()
{
    return $this->hasOne(\App\Models\FacebookPost::class);
}
}
