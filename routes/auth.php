<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');

    Route::post('/register', [RegisteredUserController::class, 'store']);

    Route::get('/forgot-password', function () {
        return Inertia::render('Auth/ForgotPassword');
    })->name('password.request');

    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('/reset-password/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');
});

// Authenticated routes
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Email Verification Routes
    Route::get('/email/verify', function () {
        return Inertia::render('Auth/VerifyEmail');
    })->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware(['throttle:6,1'])
        ->name('verification.send');

    // Routes that require verified email
    Route::middleware(['verified'])->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Auth/Dashboard', [
                'user' => Auth::user(),
            ]);
        })->name('dashboard');
    });
});
