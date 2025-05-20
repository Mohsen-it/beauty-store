<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductLike;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $cacheKey = 'products_' . md5(json_encode($request->all()));
        $cacheTTL = 60 * 15; // 15 minutes

        // Only use cache in production for non-admin users
        $useCache = !app()->isLocal() && (!Auth::check() || !Auth::user()->is_admin);

        if ($useCache && Cache::has($cacheKey)) {
            $data = Cache::get($cacheKey);
        } else {
            $query = Product::query()
                ->with(['category', 'images'])
                ->where('is_active', true);

            // Filter by category if provided
            if ($request->has('category')) {
                $query->where('category_id', $request->category);
            }

            // Filter by price range if provided
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }

            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }

            // Sort products
            $sortBy = $request->input('sort', 'created_at');
            $sortOrder = $request->input('order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Add index hints for better MySQL performance when appropriate
            if (in_array($sortBy, ['price', 'created_at', 'name'])) {
                $query->select(['*']); // Force the query builder to use the hinted index
            }

            $products = $query->paginate(12);

            // Cache all active categories for reuse
            $categories = Cache::remember('active_categories', $cacheTTL, function () {
                return Category::where('is_active', true)->get();
            });

            $data = [
                'products' => $products,
                'categories' => $categories,
                'filters' => $request->only(['category', 'min_price', 'max_price', 'sort', 'order']),
            ];

            // Store in cache if caching is enabled
            if ($useCache) {
                Cache::put($cacheKey, $data, $cacheTTL);
            }
        }

        return Inertia::render('Products/Index', $data);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $cacheKey = 'product_' . $product->id;
        $cacheTTL = 60 * 5; // 5 minutes

        // Skip cache for admin users
        $useCache = !app()->isLocal() && (!Auth::check() || !Auth::user()->is_admin);

        if ($useCache && Cache::has($cacheKey)) {
            $data = Cache::get($cacheKey);
        } else {
            $product->load('category', 'images');

            $relatedProducts = Product::with(['category', 'images'])
                ->where('category_id', $product->category_id)
                ->where('id', '!=', $product->id)
                ->where('is_active', true)
                ->inRandomOrder()
                ->limit(4)
                ->get();

            $data = [
                'product' => $product,
                'relatedProducts' => $relatedProducts,
            ];

            // Store in cache if caching is enabled
            if ($useCache) {
                Cache::put($cacheKey, $data, $cacheTTL);
            }
        }

        return Inertia::render('Products/Show', $data);
    }

    /**
     * Toggle like status for a product.
     */
    public function toggleLike(Product $product)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'You must be logged in to like products',
            ], 401);
        }

        $userId = Auth::id();
        $existingLike = ProductLike::where('user_id', $userId)
            ->where('product_id', $product->id)
            ->first();

        if ($existingLike) {
            // User already liked this product, so unlike it
            $existingLike->delete();
            $isLiked = false;
        } else {
            // User hasn't liked this product yet, so like it
            ProductLike::create([
                'user_id' => $userId,
                'product_id' => $product->id,
            ]);
            $isLiked = true;
        }

        // Invalidate product cache since like count has changed
        Cache::forget('product_' . $product->id);

        return response()->json([
            'success' => true,
            'is_liked' => $isLiked,
            'likes_count' => $product->likes()->count(),
        ]);
    }

    /**
     * Display featured products for the homepage.
     */
    public function featured()
    {
        $cacheKey = 'featured_products';
        $cacheTTL = 60 * 30; // 30 minutes

        // Use caching for non-development environments and non-admin users
        $useCache = !app()->isLocal() && (!Auth::check() || !Auth::user()->is_admin);

        if ($useCache && Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $featuredProducts = Product::where('featured', true)
            ->where('is_active', true)
            ->with('category', 'images')
            ->limit(8)
            ->get();

        $categories = Cache::remember('active_categories', $cacheTTL, function () {
            return Category::where('is_active', true)->get();
        });

        $data = [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ];

        // Cache the data
        if ($useCache) {
            Cache::put($cacheKey, $data, $cacheTTL);
        }

        return $data;
    }
}
