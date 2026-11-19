<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\FacebookGraphicPreviewController;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'LankaPulse AI Laravel Backend',
    ]);
});

Route::middleware('web')->group(function () {
    Route::get(
        '/dev/facebook-graphic',
        [FacebookGraphicPreviewController::class, 'index']
    )->name('facebook.preview');

    Route::get(
        '/dev/facebook-graphic/image',
        [FacebookGraphicPreviewController::class, 'image']
    )->name('facebook.preview.image');

    Route::get(
        '/dev/facebook-graphic/version',
        [FacebookGraphicPreviewController::class, 'version']
    )->name('facebook.preview.version');
});
