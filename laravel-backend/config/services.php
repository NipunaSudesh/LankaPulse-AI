<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],
'gemini' => [
    'key' => env('GEMINI_API_KEY'),
    'model' => env('GEMINI_MODEL', 'gemini-2.5-flash'),
],

'worldnews' => [
    'key' => env('WORLD_NEWS_API_KEY'),
],
'induwara' => [
    'key' => env('INDUWARA_NEWS_API_KEY'),
],
'newsapi' => [
    'key' => env('NEWSAPI_KEY'),
],
'newsdata' => [
    'key' => env('NEWS_DATA_API_KEY'),
],


'rss' => [
    'feeds' => [
[
    'name' => 'Lankadeepa',
    'url' => 'https://www.lankadeepa.lk/rss/latest_news/1',
    'enabled' => true,
    'language' => 'si',
],
        [
            'name' => 'News21',
            'url' => 'https://www.news21.lk/english/rss/latest-posts',
            'enabled' => true,
            'language' => 'en',
        ],
    ],
],

'rapidapi' => [
    'key' => env('RAPIDAPI_KEY'),
    'host' => env('RAPIDAPI_HOST'),
],

'facebook' => [
    'graph_version' => env('FACEBOOK_GRAPH_VERSION', 'v26.0'),
    'page_id' => env('FACEBOOK_PAGE_ID'),
    'page_access_token' => env('FACEBOOK_PAGE_ACCESS_TOKEN'),

    'auto_publish' => env('FACEBOOK_AUTO_PUBLISH', true),
    'daily_limit' => (int) env('FACEBOOK_DAILY_LIMIT', 20),
    'max_article_age_hours' => (int) env('FACEBOOK_MAX_ARTICLE_AGE_HOURS', 48),

    'publish_api_key' => env('FACEBOOK_PUBLISH_API_KEY'),

    'graphic_width' => 1200,
    'graphic_height' => 630,
],
    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

];
