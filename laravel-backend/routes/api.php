<?php
use App\Http\Controllers\Api\V1\NewsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/categories', [NewsController::class, 'categories']);
    Route::get('/news/{newsArticle}', [NewsController::class, 'show']);

    Route::get('/test/world-news', [ NewsController::class,
        'fetchWorldNews',
    ]);

    Route::get('/test/induwara', [  NewsController::class,
        'fetchInduwara',
    ]);
    Route::get('/test/newsapi', [  NewsController::class,
        'testNewsApi',
    ]);
});