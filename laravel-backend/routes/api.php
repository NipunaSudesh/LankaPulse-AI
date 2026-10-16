<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\NewsController;

Route::prefix('v1')->group(function () {
    Route::get('/news', [NewsController::class, 'index']);
    Route::get('/news/{newsArticle}', [NewsController::class, 'show']);
});
