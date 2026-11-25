<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Throwable;

class RunNewsPipeline extends Command
{
    protected $signature = 'news:run-pipeline';

    protected $description = 'Fetch, analyse and publish Sri Lankan news automatically';

    public function handle(): int
    {
        $this->info('Starting LankaPulse AI pipeline...');

$steps = [
    [
        'name' => 'Fetching news',
        'command' => 'news:fetch-sri-lanka',
        'arguments' => [],
    ],
    [
        'name' => 'Analysing newly fetched news with Gemini AI',
        'command' => 'news:rank',
        'arguments' => [
            '--limit' => 100,
        ],
    ],
    [
        'name' => 'Publishing high-scoring Facebook articles',
        'command' => 'news:publish-facebook',
        'arguments' => [
            '--limit' => 3,
            '--min-score' => 70,
            '--max-age' => 12,
        ],
    ],
];

        $hasFailures = false;

        foreach ($steps as $step) {
            $this->newLine();
            $this->info('=== ' . $step['name'] . ' ===');

            try {
                $exitCode = Artisan::call(
                    $step['command'],
                    $step['arguments']
                );

                $output = Artisan::output();

                if ($output !== '') {
                    $this->line($output);
                }

                if ($exitCode !== self::SUCCESS) {
                    $hasFailures = true;

                    Log::warning('News pipeline step failed', [
                        'command' => $step['command'],
                        'exit_code' => $exitCode,
                    ]);
                }
            } catch (Throwable $e) {
                $hasFailures = true;

                Log::error('News pipeline exception', [
                    'command' => $step['command'],
                    'error' => $e->getMessage(),
                ]);

                $this->error($e->getMessage());
            }
        }

        $this->newLine();

        if ($hasFailures) {
            $this->warn('Pipeline completed with errors.');
            return self::FAILURE;
        }

        $this->info('LankaPulse AI pipeline completed successfully.');

        return self::SUCCESS;
    }
}
