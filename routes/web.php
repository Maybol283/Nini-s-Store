<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ShopController;
use App\Http\Middleware\AdminOnly;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Share cart data with all Inertia responses
Inertia::share('cart', function () {
    if (session()->has('cart')) {
        return session('cart');
    }

    return [
        'items' => [],
        'total' => 0,
        'itemCount' => 0,
    ];
});

// Share auth data with all Inertia responses
Inertia::share('auth', function () {
    return [
        'user' => Auth::user() ? [
            'id' => Auth::user()->id,
            'name' => Auth::user()->name,
            'email' => Auth::user()->email,
            'role' => Auth::user()->role,
        ] : null,
    ];
});

Route::get('/', function () {
    return Inertia::render('LandingPage', [
        'message' => 'Welcome to the About Us page!',
    ]);
});

Route::get('/about', function () {
    return Inertia::render('Home/About');
});

// Include Auth routes
require __DIR__ . '/auth.php';

Route::get('/size-guide', function () {
    return Inertia::render('SizeGuide');
});

// Shop routes - order matters!
Route::get('/shop', function () {
    return Inertia::render('Shop/ShopLandingPage');
});

Route::get('/shop/search', function () {
    return Inertia::render('Shop/ShopBrowse');
});

Route::get('/shop/item/{id}', [ShopController::class, 'show'])->name('shop.item');

Route::get('/shop/{age_group}', function (string $age_group) {
    if (!in_array($age_group, ['adult', 'baby'])) {
        abort(404);
    }
    return Inertia::render('Shop/ShopBrowse', [
        'ageGroup' => $age_group
    ]);
})->where('age_group', 'adult|baby');

Route::middleware(['web'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::delete('/cart/remove/{cartItemId}', [CartController::class, 'remove'])->name('cart.remove');
    Route::patch('/cart/update/{cartItemId}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/summary', [CartController::class, 'summary'])->name('cart.summary');
    // Add a cart sync route for the client-side cart
    Route::post('/cart/sync', [CartController::class, 'sync'])->name('cart.sync');
});

// Admin routes - using direct class reference 
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['web', 'auth', AdminOnly::class])
    ->group(function () {
        // Products management
        Route::get('/products/create', [\App\Http\Controllers\Admin\ProductController::class, 'create'])
            ->name('products.create');
        Route::post('/products', [\App\Http\Controllers\Admin\ProductController::class, 'store'])
            ->name('products.store');
        Route::get('/products', [\App\Http\Controllers\Admin\ProductController::class, 'index'])
            ->name('products.index');
        Route::get('/products/{product}/edit', [\App\Http\Controllers\Admin\ProductController::class, 'edit'])
            ->name('products.edit');
        Route::put('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'update'])
            ->name('products.update');
        Route::delete('/products/{product}', [\App\Http\Controllers\Admin\ProductController::class, 'destroy'])
            ->name('products.destroy');
    });
