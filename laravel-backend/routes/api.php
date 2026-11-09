<?php

use App\Http\Controllers\Api\V1\FacebookPostController;
use App\Http\Controllers\Api\V1\NewsController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/categories', [NewsController::class, 'categories']);
    Route::get('/news/{newsArticle}', [NewsController::class, 'show']);

    Route::get('/test/world-news', [NewsController::class, 'testWorldNews']);
    Route::get('/test/induwara', [NewsController::class, 'testInduwara']);
    Route::get('/test/newsapi', [NewsController::class, 'testNewsApi']);
    Route::get('/test/lankadeepa', [NewsController::class, 'testLankadeepa']);
    Route::get('/test/helakuru', [NewsController::class, 'testHelakuru']);

    Route::get('/facebook-posts', [FacebookPostController::class, 'index']);
    Route::get('/facebook-posts/{id}', [FacebookPostController::class, 'show']);

    Route::post('/facebook-posts/publish', [
        FacebookPostController::class,
        'publish',
    ])->middleware('throttle:5,1');
});