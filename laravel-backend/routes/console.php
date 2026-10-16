<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('news:fetch-sri-lanka')
    ->hourly()
    ->withoutOverlapping();
