<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    
public function up(): void
{
    Schema::create('news_articles', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('summary')->nullable();
        $table->longText('content')->nullable();
        $table->string('url', 2048)->unique();
        $table->text('image_url')->nullable();
        $table->string('source_name')->nullable();
        $table->string('category')->nullable();
        $table->string('language', 10)->nullable();
        $table->timestamp('published_at')->nullable();
        $table->timestamps();

        $table->index('published_at');
        $table->index('category');
    });
}

public function down(): void
{
    Schema::dropIfExists('news_articles');
}

};  