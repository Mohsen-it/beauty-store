<?php

use App\Http\Controllers\PaymentController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

// Payment routes - removed auth middleware to allow guest checkout
Route::post('/payment/create-intent', [PaymentController::class, 'createPaymentIntent'])->name('payment.create-intent');
Route::post('/payment/validate-method', [PaymentController::class, 'validatePaymentMethod'])->name('payment.validate-method');
Route::post('/payment/confirm', [PaymentController::class, 'confirmPayment'])->name('payment.confirm');
Route::post('/orders/{order}/complete', [OrderController::class, 'completeOrder'])->name('orders.complete');
Route::post('/orders/create-temporary', [OrderController::class, 'createTemporaryOrder'])->name('orders.create-temporary');

// Webhook route - no CSRF protection needed
Route::post('/stripe/webhook', [PaymentController::class, 'handleWebhook'])->name('stripe.webhook')->withoutMiddleware([\App\Http\Middleware\VerifyCsrfToken::class]);
