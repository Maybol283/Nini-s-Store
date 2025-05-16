<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ContactController;
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

// Home routes
Route::get('/', [HomeController::class, 'landing']);
Route::get('/about', [HomeController::class, 'about']);
Route::get('/size-guide', [HomeController::class, 'sizeGuide']);

// Include Auth routes
require __DIR__ . '/auth.php';

// Shop routes - order matters!
Route::get('/shop', [ShopController::class, 'index']);
Route::get('/shop/item/{id}', [ShopController::class, 'show'])->name('shop.item');

// Dedicated routes for adult and baby products that can handle search parameters
Route::get('/shop/adults', [ShopController::class, 'adults'])->name('shop.adults');
Route::get('/shop/babies', [ShopController::class, 'babies'])->name('shop.babies');

// Keep the existing route for backwards compatibility
Route::get('/shop/{age_group}', [ShopController::class, 'byAgeGroup'])->where('age_group', 'adult|baby');

// Cart routes
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

// Checkout routes
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout/create-payment-intent', [CheckoutController::class, 'createPaymentIntent'])->name('checkout.payment-intent');
Route::post('/checkout/process-payment', [CheckoutController::class, 'processPayment'])->name('checkout.process-payment');
Route::get('/checkout/thank-you', [CheckoutController::class, 'thankYou'])->name('checkout.thank-you');

// Gallery routes
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');

// Contact routes
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

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
