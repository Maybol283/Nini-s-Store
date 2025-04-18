<?php

use App\Http\Controllers\CartController;
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
    return Inertia::render('Shop/ShopLandingPage');
});

Route::get('/shop/search', function () {
    return Inertia::render('Shop/ShopBrowse');
});

Route::middleware(['web'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/remove/{cartItemId}', [CartController::class, 'remove'])->name('cart.remove');
    Route::patch('/cart/update/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/summary', [CartController::class, 'summary'])->name('cart.summary');
});
