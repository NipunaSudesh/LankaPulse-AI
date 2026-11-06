
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->string('facebook_post_id')->nullable();
            $table->timestamp('facebook_published_at')->nullable();
            $table->string('facebook_publish_status')
                ->default('pending');
            $table->text('facebook_error')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {
            $table->dropColumn([
                'facebook_post_id',
                'facebook_published_at',
                'facebook_publish_status',
                'facebook_error',
            ]);
        });
    }
};
