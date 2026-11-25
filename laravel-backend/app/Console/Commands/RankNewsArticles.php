<?php

namespace App\Console\Commands;

use App\Models\NewsArticle;
use App\Services\NewsIntelligenceService;
use App\Services\NewsRankingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Throwable;

class RankNewsArticles extends Command
{
    protected $signature = 'news:rank
                            {--limit=20 : Maximum articles to analyse}';

    protected $description = 'Analyse and rank Sri Lankan news using Gemini AI';

    public function handle(
        NewsIntelligenceService $intelligence,
        NewsRankingService $ranking
    ): int {
        $limit = max(1, min(100, (int) $this->option('limit')));

$cutoff = now()->subHours(12);

$articles = NewsArticle::query()
    ->where('ai_status', 'pending')
    ->whereNotNull('title')
    ->where('title', '!=', '')
    ->whereNotNull('published_at')
    ->whereBetween('published_at', [$cutoff, now()])
    ->where('created_at', '>=', $cutoff)
    ->orderByDesc('published_at')
    ->limit($limit)
    ->get();

        if ($articles->isEmpty()) {
            $this->info('No pending articles for AI analysis.');

            return self::SUCCESS;
        }

        $this->info("Analysing {$articles->count()} articles...");

        $successful = 0;
        $failed = 0;

        foreach ($articles as $article) {
            try {
                $article->update([
                    'ai_status' => 'analyzing',
                ]);

                $analysis = $intelligence->analyze($article);

                $ranking->save($article, $analysis);

                $successful++;

                $this->info(
                    "ID {$article->id} | Score: {$article->fresh()->ai_score} | {$article->title}"
                );
            } catch (Throwable $e) {
                $failed++;

                $article->update([
                    'ai_status' => 'failed',
                ]);

                Log::error('News AI analysis failed', [
                    'article_id' => $article->id,
                    'error' => $e->getMessage(),
                ]);

                $this->error(
                    "Failed article ID {$article->id}: {$e->getMessage()}"
                );
            }
        }

        $this->newLine();

        $this->info("Successful: {$successful}");
        $this->error("Failed: {$failed}");

        return $failed > 0 ? self::FAILURE : self::SUCCESS;
    }
}
