<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->string('ai_status')
                ->default('pending')
                ->index();

            $table->decimal('ai_score', 5, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropIndex(['ai_status']);
            $table->dropColumn(['ai_status', 'ai_score']);
        });
    }
};