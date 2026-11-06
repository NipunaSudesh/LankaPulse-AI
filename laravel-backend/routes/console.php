<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('news:fetch-sri-lanka')
    ->hourly()
    // ->everyFiveMinutes()
    ->withoutOverlapping();

   Schedule::command('news:publish-facebook --limit=1')
    ->everyThirtyMinutes()
    ->withoutOverlapping()
    ->runInBackground();