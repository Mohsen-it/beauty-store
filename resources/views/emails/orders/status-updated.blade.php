@extends('emails.layouts.master')

@section('title', 'Order Status Update')

@section('header', 'Order Status Update')

@section('content')
    <p>Hello {{ $order->first_name }} {{ $order->last_name }},</p>

    <p>We would like to inform you that the status of your order <strong>#{{ $order->order_number }}</strong> has been updated.</p>

    <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
        <p>
            <strong>New Status:</strong>
            <span class="status status-{{ $order->status }}">
                @if($order->status == 'pending')
                    Pending
                @elseif($order->status == 'processing')
                    Processing
                @elseif($order->status == 'shipped')
                    Shipped
                @elseif($order->status == 'delivered')
                    Delivered
                @elseif($order->status == 'cancelled')
                    Cancelled
                @else
                    {{ ucfirst($order->status) }}
                @endif
            </span>
        </p>

        @if($order->status == 'shipped')
            <p>Your order has been shipped and is on its way to you. You can track the status of your order through your account.</p>
        @elseif($order->status == 'delivered')
            <p>Your order has been successfully delivered. We hope you are satisfied with our products and services.</p>
        @elseif($order->status == 'processing')
            <p>We are currently processing your order. We will notify you when it ships.</p>
        @elseif($order->status == 'cancelled')
            <p>Your order has been cancelled. If you did not request this cancellation, please contact customer service immediately.</p>
        @endif

        <p><strong>Total:</strong> ${{ number_format($order->total, 2) }} {{ config('app.currency_symbol') }}</p>
    </div>

    <p>If you have any questions, please reply to this email or contact customer service.</p>

    <a href="{{ route('orders.show', $order->id) }}" class="btn">View Order Details</a>
@endsection
