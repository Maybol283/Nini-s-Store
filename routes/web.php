<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ShopController;
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

Route::get('/shop/item/{id}', [ShopController::class, 'show'])->name('shop.item');

Route::middleware(['web'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/remove/{cartItemId}', [CartController::class, 'remove'])->name('cart.remove');
    Route::patch('/cart/update/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/summary', [CartController::class, 'summary'])->name('cart.summary');
});

// Admin routes
Route::prefix('admin')->name('admin.')->middleware(['auth', 'admin'])->group(function () {
    // Products management
    Route::get('/products/create', [App\Http\Controllers\Admin\ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [App\Http\Controllers\Admin\ProductController::class, 'store'])->name('products.store');
    Route::get('/products', [App\Http\Controllers\Admin\ProductController::class, 'index'])->name('products.index');
});
