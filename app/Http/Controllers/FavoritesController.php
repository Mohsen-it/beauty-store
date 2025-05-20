<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FavoritesController extends Controller
{
    /**
     * Display a listing of the user's favorite products.
     */
   public function index()
{
    if (!Auth::check()) {
        return redirect()->route('login');
    }

    $user = Auth::user();
    $likedProducts = $user->likedProducts()->with('category', 'images')->get(); // Load images with category

    return Inertia::render('Favorites/Index', [
        'likedProducts' => $likedProducts->map(fn($product) => [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'image' => $product->images->first()->url ?? null, // Display first image if available
            'category' => [
                'name' => $product->category->name,
            ],
        ])
    ]);
}

}
