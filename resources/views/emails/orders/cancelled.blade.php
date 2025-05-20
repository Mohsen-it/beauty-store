@extends('emails.layouts.master')

@section('title', 'Order Cancelled')

@section('header', 'Order Cancelled')

@section('content')
    <p>Hello {{ $order->first_name }} {{ $order->last_name }},</p>

    <p>We would like to inform you that your order <strong>#{{ $order->order_number }}</strong> has been successfully cancelled.</p>

    @if($reason)
        <div class="order-details" style="background-color: #f8d7da; border-color: #f5c6cb;">
            <h3>Cancellation Reason</h3>
            <p>{{ $reason }}</p>
        </div>
    @endif

    <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
        <p><strong>Total:</strong> ${{ number_format($order->total, 2) }} {{ config('app.currency_symbol') }}</p>

        <h4>Products:</h4>
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
        </table>
    </div>

    <p>If you have any questions, please reply to this email or contact customer service.</p>

    <a href="{{ url('/') }}" class="btn">Return to Store</a>
@endsection
