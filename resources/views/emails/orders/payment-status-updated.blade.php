@extends('emails.layouts.master')

@section('title', 'Payment Status Update')

@section('header', 'Payment Status Update')

@section('content')
    <p>Hello {{ $order->first_name }} {{ $order->last_name }},</p>

    <p>We would like to inform you that the payment status for your order <strong>#{{ $order->order_number }}</strong> has been updated.</p>

    <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
        <p><strong>Payment Method:</strong>
            @if($order->payment_method == 'cash_on_delivery')
                Cash on Delivery
            @elseif($order->payment_method == 'credit_card')
                Credit Card
            @else
                {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}
            @endif
        </p>
        <p>
            <strong>New Payment Status:</strong>
            <span class="status status-{{ $order->payment_status }}">
                @if($order->payment_status == 'pending')
                    Pending
                @elseif($order->payment_status == 'completed')
                    Completed
                @elseif($order->payment_status == 'failed')
                    Failed
                @elseif($order->payment_status == 'refunded')
                    Refunded
                @else
                    {{ ucfirst($order->payment_status) }}
                @endif
            </span>
        </p>

        @if($order->payment_status == 'completed')
            <p>We have successfully received your payment. Thank you for your purchase.</p>
        @elseif($order->payment_status == 'failed')
            <p>Unfortunately, the payment process has failed. Please contact customer service for assistance.</p>
        @elseif($order->payment_status == 'refunded')
            <p>Your payment has been successfully refunded. The amount will appear in your account within 3-5 business days.</p>
        @endif

        <p><strong>Total:</strong> ${{ number_format($order->total, 2) }} {{ config('app.currency_symbol') }}</p>
    </div>

    <p>If you have any questions, please reply to this email or contact customer service.</p>

    <a href="{{ route('orders.show', $order->id) }}" class="btn">View Order Details</a>
@endsection
