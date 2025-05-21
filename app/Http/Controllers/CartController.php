<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Display the cart contents.
     */
    public function index()
    {
        $cart = $this->getOrCreateCart();
        // Load items and their associated product details and images
        $cart->load('items.product.category', 'items.product.images'); // إضافة images لتحميل الصور

        return Inertia::render('Cart/Index', [
            'cart' => [
                'items' => $cart->items->map(fn($item) => [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'image' => $item->product->images->first()->url ?? null, // استخدم الصورة الأولى إن وجدت
                        'category' => [
                            'name' => $item->product->category->name,
                        ],
                        'stock' => $item->product->stock,
                    ],
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                    'subtotal' => $item->subtotal,
                ]),
                'total' => $cart->total,
            ]
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function addToCart(Request $request)
    {
        if (!Auth::check()) {
            session(['pending_cart_product' => $request->only(['product_id', 'quantity'])]);
            return redirect()->route('login');
        }

        // Check if this is a redirect from login with old input
        $productId = $request->old('product_id') ?? $request->input('product_id');
        $quantity = $request->old('quantity') ?? $request->input('quantity');

        // Create a new request with the correct data if using old input
        if ($request->hasOldInput()) {
            $request->merge([
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $cart = $this->getOrCreateCart();
            $product = Product::findOrFail($validated['product_id']);

            if ($product->stock < $validated['quantity']) {
                return redirect()->back()->with('error', 'The requested quantity is not available in stock.');
            }

            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->first();

            if ($cartItem) {
                $newQuantity = $cartItem->quantity + $validated['quantity'];

                if ($newQuantity > $product->stock) {
                    return redirect()->back()->with('error', 'Cannot add a quantity larger than available in stock.');
                }

                $cartItem->quantity = $newQuantity;
                $cartItem->subtotal = $cartItem->price * $cartItem->quantity;
                $cartItem->save();
            } else {
                $price = $product->sale_price ?? $product->price;

                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'quantity' => $validated['quantity'],
                    'price' => $price,
                    'subtotal' => $price * $validated['quantity'],
                ]);
            }

            $this->updateCartTotal($cart);

            // Get updated cart count
            $cartCount = CartItem::where('cart_id', $cart->id)->sum('quantity');

            // For AJAX requests, return JSON with cart count
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product added to cart successfully.',
                    'count' => $cartCount
                ]);
            }

            return redirect()->back()->with('success', 'Product added to cart successfully.')->with('cartCount', $cartCount);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'An error occurred while adding to cart: ' . $e->getMessage());
        }
    }

    /**
     * Update cart item quantity.
     */
    public function updateQuantity(Request $request, CartItem $cartItem)
    {

        if ($cartItem->cart->id !== $this->getOrCreateCart()->id) {
            abort(403, 'Unauthorized action.');
        }
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            // Add this stock check:
            if ($cartItem->product->stock < $request->quantity) {
                return redirect()->back()->with('error', 'The requested quantity is not available in stock.');
            }

            $cartItem->quantity = $request->quantity;
            $cartItem->subtotal = $cartItem->price * $cartItem->quantity;
            $cartItem->save();

            // Update cart total
            $this->updateCartTotal($cartItem->cart);

            // Get updated cart count
            $cartCount = CartItem::where('cart_id', $cartItem->cart->id)->sum('quantity');

            // For AJAX requests, return JSON with cart count
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Cart updated successfully.',
                    'count' => $cartCount
                ]);
            }

            // Instead of redirect, return the same page with new data
            return $this->index()->with('cartCount', $cartCount);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update cart: ' . $e->getMessage());
        }
    }

    /**
     * Remove an item from the cart.
     */
    public function removeItem(Request $request, CartItem $cartItem)
    {
        try {
            $cart = $cartItem->cart;
            $cartItem->delete();

            // Update cart total
            $this->updateCartTotal($cart);

            // Get updated cart count
            $cartCount = CartItem::where('cart_id', $cart->id)->sum('quantity');

            // For AJAX requests, return JSON with cart count
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Product removed from cart successfully.',
                    'count' => $cartCount
                ]);
            }

            return redirect()->back()->with('success', 'Item removed from cart')->with('cartCount', $cartCount);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to remove item: ' . $e->getMessage());
        }
    }

    /**
     * Clear the cart.
     */
    public function clearCart(Request $request)
    {
        try {
            $cart = $this->getOrCreateCart();
            CartItem::where('cart_id', $cart->id)->delete();

            $cart->total = 0;
            $cart->save();

            // For AJAX requests, return JSON with cart count (which is now 0)
            if ($request->ajax() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Cart cleared successfully.',
                    'count' => 0
                ]);
            }

            return redirect()->back()->with('success', 'Cart cleared successfully')->with('cartCount', 0);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to clear cart: ' . $e->getMessage());
        }
    }

    /**
     * Get the current cart or create a new one.
     */
    private function getOrCreateCart()
    {
        $sessionId = Session::getId();
        $userId = auth()->id();

        $cart = Cart::where(function ($query) use ($sessionId, $userId) {
            if ($userId) {
                $query->where('user_id', $userId);
            } else {
                $query->where('session_id', $sessionId);
            }
        })->first();

        if (!$cart) {
            $cart = Cart::create([
                'session_id' => $sessionId,
                'user_id' => $userId,
                'total' => 0,
            ]);
        }

        return $cart;
    }

    /**
     * Update the cart total based on items.
     */
    private function updateCartTotal(Cart $cart)
    {
        $total = CartItem::where('cart_id', $cart->id)->sum('subtotal');
        $cart->total = $total;
        $cart->save();
    }

    /**
     * Get the count of items in the cart.
     */
    public function getCartCount()
    {
        $cart = $this->getOrCreateCart();
        $count = CartItem::where('cart_id', $cart->id)->sum('quantity');

        return response()->json(['count' => $count]);
    }
}
