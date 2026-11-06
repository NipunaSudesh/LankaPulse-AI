
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->string('title_si')->nullable();
            $table->text('summary_si')->nullable();
            $table->longText('content_si')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropColumn([
                'title_si',
                'summary_si',
                'content_si',
            ]);
        });
    }
};
