<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Dashboard', [
        'message' => 'Welcome to the About Us page!',
    ]);
});

Route::get('/size-guide', function () {
    return Inertia::render('SizeGuide');
});

Route::get('/shop', function () {
    return Inertia::render('Shop/BaseShop');
});
