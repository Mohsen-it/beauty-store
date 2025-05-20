<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Models\OrderItem;
use App\Mail\OrderConfirmation;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Mail\OrderCancelled;
use App\Mail\OrderModified;

class OrderController extends Controller
{
    protected $stripeService;

    public function __construct(StripePaymentService $stripeService = null)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Display a list of the user's orders.
     */
    public function index()
    {
        $user = auth()->user();
        $orders = Order::where('user_id', $user->id)
                      ->orderBy('created_at', 'desc')
                      ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders
        ]);
    }

    /**
     * Display the details of a specific order.
     */
    public function show(Order $order)
    {
        // Ensure the order belongs to the authenticated user
        if (auth()->id() !== $order->user_id) {
            abort(403);
        }

        $order->load(['items', 'history']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
            'orderHistory' => $order->history
        ]);
    }

    /**
     * Cancel a specific order.
     */
    public function cancel(Request $request, Order $order)
    {
        if (auth()->id() !== $order->user_id) {
            abort(403);
        }

        // Check if the order is eligible for cancellation
        if (!in_array($order->status, ['pending', 'processing'])) {
            return back()->with('error', __('orders.cannot_cancel'));
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            // Update the order status
            $order->status = 'cancelled';
            $order->save();

            // Log cancellation in order history
            OrderHistory::create([
                'order_id' => $order->id,
                'status' => 'cancelled',
                'comment' => $request->reason,
            ]);

            // Restore stock
            foreach ($order->items as $item) {
                $product = $item->product;
                if ($product) {
                    $product->stock += $item->quantity;
                    $product->save();
                }
            }

            // Send cancellation email
            Mail::to($order->email)->send(new OrderCancelled($order, $request->reason));

            DB::commit();

            return redirect()->route('orders.show', $order->id)
                             ->with('success', __('orders.cancel_success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', __('orders.cancel_error'));
        }
    }

    /**
     * Modify shipping information of an order.
     */
    public function modify(Request $request, Order $order)
    {
        if (auth()->id() !== $order->user_id) {
            abort(403);
        }

        if ($order->status !== 'pending') {
            return back()->with('error', __('orders.cannot_modify'));
        }

        $request->validate([
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $oldValues = [
                'address' => $order->address,
                'city' => $order->city,
                'state' => $order->state,
                'postal_code' => $order->postal_code,
                'country' => $order->country,
                'phone' => $order->phone,
                'notes' => $order->notes,
            ];

            // Update order shipping details
            $order->update([
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'phone' => $request->phone,
                'notes' => $request->notes,
            ]);

            // Add modification entry to order history
            OrderHistory::create([
                'order_id' => $order->id,
                'status' => $order->status,
                'comment' => __('orders.shipping_updated'),
            ]);

            // Send email about modification
            Mail::to($order->email)->send(new OrderModified($order, $oldValues));

            DB::commit();

            return redirect()->route('orders.show', $order->id)
                             ->with('success', __('orders.modify_success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', __('orders.modify_error'));
        }
    }

    /**
     * Display the checkout page.
     */
    public function checkout()
    {
        $cart = $this->getCart();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', __('cart.empty'));
        }

        $cart->load('items.product');

        return Inertia::render('Checkout', [
            'cart' => $cart,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    /**
     * Create a temporary order for payment processing without saving to database.
     */
    public function createTemporaryOrder(Request $request)
    {
        $cart = $this->getCart();

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => __('cart.empty')], 400);
        }

        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
            'payment_method' => 'required|in:credit_card',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'location_details' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            // Calculate totals
            $subtotal = $cart->total;
            $tax = $subtotal * 0.05;
            $shipping = 10.00;
            $total = $subtotal + $tax + $shipping;

            // Create a temporary order object (not saved to database)
            $temporaryOrder = [
                'user_id' => auth()->id(),
                'order_number' => $this->generateOrderNumber(),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'tax' => $tax,
                'shipping' => $shipping,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'city' => $request->city,
                'state' => $request->state,
                'postal_code' => $request->postal_code,
                'country' => $request->country,
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
                'location_details' => $request->location_details,
                'notes' => $request->notes,
                'items' => $cart->items->map(function($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->subtotal,
                    ];
                }),
            ];

            // Store the temporary order in the session
            session(['temporary_order' => $temporaryOrder]);

            return response()->json([
                'success' => true,
                'temporary_order' => $temporaryOrder,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => __('orders.processing_error', ['message' => $e->getMessage()])], 500);
        }
    }

    /**
     * Store a new order after successful payment or for cash on delivery.
     */
    public function store(Request $request)
    {
        $cart = $this->getCart();

        // Check if this is a direct order (cash on delivery) or after payment
        $temporaryOrder = session('temporary_order');
        $isCashOnDelivery = $request->has('payment_method') && $request->payment_method === 'cash_on_delivery';

        // For cash on delivery, validate the form data
        if ($isCashOnDelivery) {
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'required|string|max:255',
                'city' => 'required|string|max:255',
                'state' => 'nullable|string|max:255',
                'postal_code' => 'required|string|max:20',
                'country' => 'required|string|max:255',
                'payment_method' => 'required|in:cash_on_delivery',
                'latitude' => 'nullable|numeric',
                'longitude' => 'nullable|numeric',
                'location_details' => 'nullable|string',
                'notes' => 'nullable|string',
            ]);
        } else if (!$temporaryOrder) {
            return response()->json(['error' => __('orders.no_order_info')], 400);
        }

        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => __('cart.empty')], 400);
        }

        try {
            DB::beginTransaction();

            // Create the order in the database
            if ($isCashOnDelivery) {
                // For cash on delivery orders
                $order = Order::create([
                    'user_id' => auth()->id(),
                    'order_number' => $this->generateOrderNumber(),
                    'status' => 'pending',
                    'subtotal' => $cart->total,
                    'tax' => $cart->total * 0.05,
                    'shipping' => 10.00,
                    'total' => $cart->total + ($cart->total * 0.05) + 10.00,
                    'payment_method' => 'cash_on_delivery',
                    'payment_status' => 'pending', // Payment will be collected on delivery
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'city' => $request->city,
                    'state' => $request->state,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country,
                    'latitude' => $request->latitude,
                    'longitude' => $request->longitude,
                    'location_details' => $request->location_details,
                    'notes' => $request->notes,
                ]);
            } else {
                // For orders after online payment
                $order = Order::create([
                    'user_id' => $temporaryOrder['user_id'],
                    'order_number' => $temporaryOrder['order_number'],
                    'status' => 'processing', // Set to processing since payment is successful
                    'subtotal' => $temporaryOrder['subtotal'],
                    'tax' => $temporaryOrder['tax'],
                    'shipping' => $temporaryOrder['shipping'],
                    'total' => $temporaryOrder['total'],
                    'payment_method' => $temporaryOrder['payment_method'],
                    'payment_status' => 'completed', // Payment is already completed
                    'first_name' => $temporaryOrder['first_name'],
                    'last_name' => $temporaryOrder['last_name'],
                    'email' => $temporaryOrder['email'],
                    'phone' => $temporaryOrder['phone'],
                    'address' => $temporaryOrder['address'],
                    'city' => $temporaryOrder['city'],
                    'state' => $temporaryOrder['state'],
                    'postal_code' => $temporaryOrder['postal_code'],
                    'country' => $temporaryOrder['country'],
                    'latitude' => $temporaryOrder['latitude'] ?? null,
                    'longitude' => $temporaryOrder['longitude'] ?? null,
                    'location_details' => $temporaryOrder['location_details'] ?? null,
                    'notes' => $temporaryOrder['notes'],
                    'payment_completed_at' => now(),
                ]);
            }

            // Create order items
            foreach ($cart->items as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'product_name' => $cartItem->product->name,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->price,
                    'subtotal' => $cartItem->subtotal,
                ]);

                // Update product stock
                $product = $cartItem->product;
                $product->stock -= $cartItem->quantity;
                $product->save();
            }

            // Add order history
            OrderHistory::create([
                'order_id' => $order->id,
                'status' => $isCashOnDelivery ? 'pending' : 'processing',
                'comment' => $isCashOnDelivery ? __('orders.created_cod') : __('orders.created_paid'),
            ]);

            // Clear the cart
            CartItem::where('cart_id', $cart->id)->delete();
            $cart->total = 0;
            $cart->save();

            // Clear the temporary order from session if it exists
            if ($temporaryOrder) {
                session()->forget('temporary_order');
            }

            DB::commit();

            // Send order confirmation email
            Mail::to($order->email)->send(new OrderConfirmation($order));

            if ($isCashOnDelivery) {
                // For cash on delivery, return Inertia response for redirect
                return Inertia::render('OrderSuccess', [
                    'order' => $order,
                    'paymentMethod' => 'cash_on_delivery'
                ]);
            } else {
                // For online payment, return JSON response
                return response()->json([
                    'success' => true,
                    'order' => $order,
                    'redirect' => route('orders.success', $order->id)
                ]);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            if ($isCashOnDelivery) {
                return redirect()->back()->with('error', __('orders.processing_error', ['message' => $e->getMessage()]));
            } else {
                return response()->json(['error' => __('orders.processing_error', ['message' => $e->getMessage()])], 500);
            }
        }
    }

    /**
     * Finalize the order after a successful payment.
     */
    public function completeOrder(Request $request, Order $order)
    {
        if ($order->payment_status === 'completed') {
            return Inertia::location(route('orders.success', $order->id));
        }

        try {
            $cart = $this->getCart();
            if ($cart) {
                CartItem::where('cart_id', $cart->id)->delete();
                $cart->total = 0;
                $cart->save();
            }

            $order->load('items');

            Mail::to($order->email)->send(new OrderConfirmation($order));

            return Inertia::location(route('orders.success', $order->id));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', __('orders.completion_error'));
        }
    }

    /**
     * Display order success page.
     */
    public function success(Order $order)
    {
        return Inertia::render('OrderSuccess', ['order' => $order]);
    }

    /**
     * Generate a unique order number.
     */
    private function generateOrderNumber()
    {
        return 'ORD-' . strtoupper(Str::random(10));
    }

    /**
     * Get the current shopping cart.
     */
    private function getCart()
    {
        $sessionId = session()->getId();
        $userId = auth()->id();

        return Cart::where(function($query) use ($sessionId, $userId) {
            $query->where('session_id', $sessionId);
            if ($userId) {
                $query->orWhere('user_id', $userId);
            }
        })->with('items.product')->first();
    }
}
