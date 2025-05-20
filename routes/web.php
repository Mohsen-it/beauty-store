<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HelpController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FavoritesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Home Page
Route::get('/', function () {
    $featuredData = app(ProductController::class)->featured();
    return Inertia::render('HomePage/index', $featuredData);
})->middleware(["prevent.admin.access"])->name("home");



Route::get('/dashboard', function () {
    $featuredData = app(ProductController::class)->featured();
    return Inertia::render('HomePage/index', $featuredData);
})->middleware(["auth", "verified", "prevent.admin.access"])->name("dashboard");

// Product Routes
Route::get("/products", [ProductController::class, "index"])->middleware(["prevent.admin.access"])->name("products.index");
Route::get("/products/{product:slug}", [ProductController::class, "show"])->middleware(["prevent.admin.access"])->name("products.show");
Route::post("/products/{product}/toggle-like", [ProductController::class, "toggleLike"])->middleware(["prevent.admin.access"])->name("products.toggle-like");

// Favorites Routes
Route::get("/favorites", [FavoritesController::class, "index"])->middleware(["prevent.admin.access"])->name("favorites.index");

// Cart Count Route (available for all users)
Route::get('/cart/count', [CartController::class, 'getCartCount'])->middleware(["prevent.admin.access"])->name('cart.count');

Route::middleware(["auth", "prevent.admin.access"])->group(function () {
// Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'addToCart'])->name('cart.add');
Route::patch('/cart/update/{cartItem}', [CartController::class, 'updateQuantity'])->name('cart.update');
Route::delete('/cart/remove/{cartItem}', [CartController::class, 'removeItem'])->name('cart.remove');
Route::delete('/cart/clear', [CartController::class, 'clearCart'])->name('cart.clear');

// Checkout and Order Routes
Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
Route::get('/orders/success/{order}', [OrderController::class, 'success'])->name('orders.success');

// Order Management Routes (requires authentication)

    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
    Route::post('/orders/{order}/modify', [OrderController::class, 'modify'])->name('orders.modify');


// Authentication Routes

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
// Category Routes
Route::middleware(["prevent.admin.access"])->group(function () {
    Route::get('/skincare', function() {
        $category = \App\Models\Category::where('name', 'Skincare')->first();
        return redirect()->route('products.index', ['category' => $category ? $category->id : null]);
    })->name('categories.skincare');

    Route::get('/makeup', function() {
        $category = \App\Models\Category::where('name', 'Makeup')->first();
        return redirect()->route('products.index', ['category' => $category ? $category->id : null]);
    })->name('categories.makeup');

    Route::get('/haircare', function() {
        $category = \App\Models\Category::where('name', 'Haircare')->first();
        return redirect()->route('products.index', ['category' => $category ? $category->id : null]);
    })->name('categories.haircare');

    Route::get('/fragrance', function() {
        $category = \App\Models\Category::where('name', 'Fragrance')->first();
        return redirect()->route('products.index', ['category' => $category ? $category->id : null]);
    })->name('categories.fragrance');
});

// Help Routes
Route::middleware(["prevent.admin.access"])->group(function () {
    Route::get('/about-us', [HelpController::class, 'aboutUs'])->name('help.about');
    Route::get('/terms-of-service', [HelpController::class, 'termsOfService'])->name('help.terms');
    Route::get('/privacy-policy', [HelpController::class, 'privacyPolicy'])->name('help.privacy');
    Route::get('/contact-us', [HelpController::class, 'contactUs'])->name('help.contact');
    Route::post('/contact-us', [HelpController::class, 'submitContactForm'])->name('help.contact.submit');
    Route::get('/faqs', [HelpController::class, 'faqs'])->name('help.faqs');
    Route::get('/shipping', [HelpController::class, 'shipping'])->name('help.shipping');
    Route::get('/returns', [HelpController::class, 'returns'])->name('help.returns');
});

// Newsletter Route
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// Language Route
Route::post('/language/change', [\App\Http\Controllers\LanguageController::class, 'change'])->name('language.change');

// Admin Routes are defined in admin.php
// No need to define them here as they're loaded by RouteServiceProvider

require __DIR__.'/auth.php';
