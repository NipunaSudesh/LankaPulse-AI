<?php

use Illuminate\Support\Facades\Schedule;

// Fetch Sri Lankan news every hour.
Schedule::command('news:fetch-sri-lanka')
    ->hourly()
    ->withoutOverlapping();

// Publish one Facebook post every hour,
// 10 minutes after news fetching starts.
Schedule::command('news:publish-facebook --limit=1')
    ->cron('10 * * * *')
    ->withoutOverlapping();
