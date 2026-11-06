<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_posts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('news_article_id')
                ->nullable()
                ->constrained('news_articles')
                ->nullOnDelete();

            $table->string('facebook_post_id')->nullable()->unique();
            $table->text('message')->nullable();
            $table->text('post_url')->nullable();

            $table->string('status')->default('pending');
            $table->text('error_message')->nullable();

            $table->timestamp('published_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_posts');
    }
};