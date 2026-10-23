<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $indexes = DB::select("SHOW INDEX FROM news_articles");

        foreach ($indexes as $index) {
            if (
                $index->Key_name === 'news_articles_url_unique' &&
                (int) $index->Non_unique === 0 &&
                $index->Column_name === 'url'
            ) {
                return;
            }
        }

        Schema::table('news_articles', function ($table) {
            $table->unique('url', 'news_articles_url_unique');
        });
    }

    public function down(): void
    {
        // Keep the existing index intact.
        // It may have been created before this migration.
    }
};
