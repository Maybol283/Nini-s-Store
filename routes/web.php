<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('About', [
        'message' => 'Welcome to the About Us page!',
    ]);
});


Route::get('about', function () {
    return Inertia::render('About', [
        'message' => 'Welcome to the About Us page!',
    ]);
});
