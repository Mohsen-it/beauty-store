@extends('emails.layouts.master')

@section('title', 'Order Confirmation')

@section('header', 'Order Confirmation')

@section('content')
    <p>Hello {{ $order->first_name }} {{ $order->last_name }},</p>

    <p>Thank you for your order! We have received your order and it is now being processed.</p>

    <div class="order-details">
        <h3>Order Information</h3>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Order Date:</strong> {{ date('F j, Y', strtotime($order->created_at)) }}</p>
        <p>
            <strong>Order Status:</strong>
            <span class="status status-pending">Pending</span>
        </p>
    </div>

    <h2>Order Details</h2>
    <table>
        <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product_name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>${{ number_format($item->price, 2) }} {{ config('app.currency_symbol') }}</td>
                <td>${{ number_format($item->subtotal, 2) }} {{ config('app.currency_symbol') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                <td>${{ number_format($order->subtotal, 2) }} {{ config('app.currency_symbol') }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Tax:</strong></td>
                <td>${{ number_format($order->tax, 2) }} {{ config('app.currency_symbol') }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
                <td>${{ number_format($order->shipping, 2) }} {{ config('app.currency_symbol') }}</td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                <td><strong>${{ number_format($order->total, 2) }} {{ config('app.currency_symbol') }}</strong></td>
            </tr>
        </tfoot>
    </table>

    <h2>Shipping Information</h2>
    <p>
        {{ $order->first_name }} {{ $order->last_name }}<br>
        {{ $order->address }}<br>
        {{ $order->city }}, {{ $order->state }} {{ $order->postal_code }}<br>
        {{ $order->country }}
    </p>

    <h2>Payment Method</h2>
    <p>{{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</p>

    <p>We will send you additional updates when your order ships. If you have any questions, please don't hesitate to contact us.</p>

    <p>Thank you for shopping with us!</p>

    <a href="{{ route('orders.show', $order->id) }}" class="btn">View Order Details</a>
@endsection
