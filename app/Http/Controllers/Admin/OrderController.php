<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderHistory;
use App\Mail\OrderStatusUpdated;
use App\Mail\PaymentStatusUpdated;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use PDF;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request)
    {
        $query = Order::query()->with('user');

        // Apply search filter
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhere('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($query) use ($search) {
                      $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Apply status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Apply payment method filter
        if ($request->has('payment_method') && $request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }

        // Apply payment status filter
        if ($request->has('payment_status') && $request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        // Apply date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Get paginated results
        $orders = $query->latest()->paginate(10)->withQueryString();

        // Add items count to each order
        $orders->getCollection()->transform(function ($order) {
            $order->items_count = $order->items()->count();
            return $order;
        });

        // Get available payment methods and statuses for filters
        $paymentMethods = ['credit_card', 'cash_on_delivery'];
        $paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'paymentMethods' => $paymentMethods,
            'paymentStatuses' => $paymentStatuses,
            'filters' => $request->only(['search', 'status', 'payment_method', 'payment_status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'history']);

        // Available statuses for dropdown
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

        // Available payment statuses for dropdown
        $paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

        // Format payment method for display
        $paymentMethodLabels = [
            'credit_card' => 'Credit Card',
            'cash_on_delivery' => 'Cash on Delivery (COD)'
        ];

        $order->payment_method_label = $paymentMethodLabels[$order->payment_method] ?? $order->payment_method;

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
            'statuses' => $statuses,
            'paymentStatuses' => $paymentStatuses,
        ]);
    }

    /**
     * Update the status of the specified order.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'sometimes|required|in:pending,completed,failed,refunded',
            'notify_customer' => 'boolean',
        ]);

        // Store old values for history
        $oldStatus = $order->status;
        $oldPaymentStatus = $order->payment_status;

        // Prepare update data
        $updateData = [
            'status' => $request->status,
        ];

        // If payment status is provided, update it
        if ($request->has('payment_status')) {
            $updateData['payment_status'] = $request->payment_status;
        }

        // Update the order
        $order->update($updateData);

        // Refresh the order to get the updated values
        $order->refresh();

        // Add to order history
        $historyComment = $request->comment ?? null;

        // Add payment status change to history comment if applicable
        if ($request->has('payment_status') && $oldPaymentStatus !== $request->payment_status) {
            $paymentStatusChange = "Payment status changed from {$oldPaymentStatus} to {$request->payment_status}";
            $historyComment = $historyComment
                ? $historyComment . ". " . $paymentStatusChange
                : $paymentStatusChange;
        }

        OrderHistory::create([
            'order_id' => $order->id,
            'status' => $request->status,
            'comment' => $historyComment,
        ]);

        // Send email notification if requested
        if ($request->notify_customer) {
            Mail::to($order->email)->send(new OrderStatusUpdated($order));
        }

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Generate invoice PDF for the specified order.
     */
    public function generateInvoice(Order $order)
    {
        $order->load(['user', 'items.product']);

        $pdf = PDF::loadView('pdfs.invoice', [
            'order' => $order,
        ]);

        return $pdf->download('invoice-' . $order->id . '.pdf');
    }

    /**
     * Generate packing slip PDF for the specified order.
     */
    public function generatePackingSlip(Order $order)
    {
        $order->load(['items.product']);

        $pdf = PDF::loadView('pdfs.packing-slip', [
            'order' => $order,
        ]);

        return $pdf->download('packing-slip-' . $order->id . '.pdf');
    }

    /**
     * Update the payment status of the specified order.
     * This is especially useful for Cash on Delivery orders.
     */
    public function updatePaymentStatus(Request $request, Order $order)
    {
        $request->validate([
            'payment_status' => 'required|in:pending,completed,failed,refunded',
            'notify_customer' => 'boolean',
        ]);

        // Store old payment status for history
        $oldPaymentStatus = $order->payment_status;

        // Update payment status
        $order->update([
            'payment_status' => $request->payment_status,
        ]);

        // Refresh the order to get the updated values
        $order->refresh();

        // Add to order history
        $historyComment = "Payment status updated from {$oldPaymentStatus} to {$request->payment_status}";
        if ($request->has('comment') && $request->comment) {
            $historyComment .= ". " . $request->comment;
        }

        OrderHistory::create([
            'order_id' => $order->id,
            'status' => $order->status, // Keep the same order status
            'comment' => $historyComment,
        ]);

        // Send email notification if requested
        if ($request->notify_customer) {
            Mail::to($order->email)->send(new PaymentStatusUpdated($order));
        }

        return back()->with('success', 'Payment status updated successfully.');
    }
}
