<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Admin\ProductController;
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
Route::post('/gallery/add/{product}', [GalleryController::class, 'addToGallery'])
    ->name('gallery.add')->middleware(['auth', 'verified', AdminOnly::class]);

// Admin Gallery management routes
Route::middleware(['auth', 'verified', AdminOnly::class])->group(function () {
    Route::get('/admin/gallery', [GalleryController::class, 'manage'])->name('gallery.manage');
    Route::post('/admin/gallery/upload', [GalleryController::class, 'upload'])->name('gallery.upload');
    Route::delete('/admin/gallery/{filename}', [GalleryController::class, 'destroy'])->name('gallery.destroy');
});

// Contact routes
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Order routes for authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{id}', [OrderController::class, 'show'])->name('orders.show');

    // Admin only routes - using class name directly instead of alias
    Route::middleware([AdminOnly::class])->group(function () {
        Route::post('/orders/{id}/update-status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
    });
});

// Admin routes - using direct class reference 
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['web', 'auth', 'verified', AdminOnly::class])
    ->group(function () {
        // Products management
        Route::get('/products/create', [ProductController::class, 'create'])
            ->name('products.create');
        Route::post('/products', [ProductController::class, 'store'])
            ->name('products.store');
        Route::get('/products', [ProductController::class, 'index'])
            ->name('products.index');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])
            ->name('products.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])
            ->name('products.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])
            ->name('products.destroy');

        // Orders management
        Route::get('/orders', [OrderController::class, 'adminIndex'])
            ->name('orders.index');
    });
