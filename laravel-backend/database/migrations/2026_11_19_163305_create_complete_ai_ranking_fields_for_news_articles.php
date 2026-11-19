
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {

            // Overall ranking
            $table->unsignedTinyInteger('ai_score')->nullable();
            $table->string('ai_priority', 50)->nullable();
            $table->string('ai_category', 50)->nullable();

            // Individual scores (0–100)
            $table->unsignedTinyInteger('ai_usefulness_score')->nullable();
            $table->unsignedTinyInteger('ai_impact_score')->nullable();
            $table->unsignedTinyInteger('ai_credibility_score')->nullable();
            $table->unsignedTinyInteger('ai_freshness_score')->nullable();
            $table->unsignedTinyInteger('ai_interest_score')->nullable();
            $table->unsignedTinyInteger('ai_uniqueness_score')->nullable();

            // AI confidence and analysis
            $table->unsignedTinyInteger('ai_confidence')->nullable();
            $table->json('ai_analysis')->nullable();
            $table->text('ai_summary_reason')->nullable();

            // Review and processing status
            $table->string('ai_status', 50)
                ->default('pending')
                ->index();

            $table->boolean('ai_requires_review')->default(false);
            $table->timestamp('ai_analyzed_at')->nullable();

            // News event grouping
            $table->string('news_event_key')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('news_articles', function (Blueprint $table) {

            $table->dropIndex(['ai_status']);
            $table->dropIndex(['news_event_key']);

            $table->dropColumn([
                'ai_score',
                'ai_priority',
                'ai_category',
                'ai_usefulness_score',
                'ai_impact_score',
                'ai_credibility_score',
                'ai_freshness_score',
                'ai_interest_score',
                'ai_uniqueness_score',
                'ai_confidence',
                'ai_analysis',
                'ai_summary_reason',
                'ai_status',
                'ai_requires_review',
                'ai_analyzed_at',
                'news_event_key',
            ]);
        });
    }
};
