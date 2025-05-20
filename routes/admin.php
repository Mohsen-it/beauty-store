<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application.
| These routes are loaded by the RouteServiceProvider within a group which
| contains the "web" and "admin" middleware groups.
|
*/

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products Management
    Route::resource('products', ProductController::class);
    Route::post('products/{product}/toggle-featured', [ProductController::class, 'toggleFeatured'])->name('products.toggle-featured');
    Route::post('products/upload-image', [ProductController::class, 'uploadImage'])->name('products.upload-image');
    Route::delete('products/remove-image/{id}', [ProductController::class, 'removeImage'])->name('products.remove-image');

    // Categories Management
    Route::resource('categories', CategoryController::class);
    Route::post('categories/reorder', [CategoryController::class, 'reorder'])->name('categories.reorder');
    Route::post('categories/{category}/toggle-active', [CategoryController::class, 'toggleis_active'])->name('categories.toggle-active');
    // Route removed as uploadImage method was removed from CategoryController
    // Orders Management
    Route::resource('orders', OrderController::class);
    Route::post('orders/{order}/update-status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    Route::post('orders/{order}/update-payment-status', [OrderController::class, 'updatePaymentStatus'])->name('orders.update-payment-status');
    Route::get('orders/{order}/invoice', [OrderController::class, 'generateInvoice'])->name('orders.invoice');
    Route::get('orders/{order}/packing-slip', [OrderController::class, 'generatePackingSlip'])->name('orders.packing-slip');

    // Users Management
    Route::resource('users', UserController::class);
    Route::post('users/{user}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggle-active');
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.assign-role');

    // Reports
    Route::get('reports/sales', [ReportController::class, 'salesReport'])->name('reports.sales');
    Route::get('reports/top-products', [ReportController::class, 'topProductsReport'])->name('reports.top-products');
    Route::get('reports/top-customers', [ReportController::class, 'topCustomers'])->name('reports.top-customers');
    Route::get('reports/export/{type}/{format}', [ReportController::class, 'exportReport'])->name('reports.export');

});
