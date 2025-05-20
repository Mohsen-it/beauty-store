@extends('emails.layouts.master')

@section('title', 'Order Modified')

@section('header', 'Order Modified')

@section('content')
    <p>Hello {{ $order->first_name }} {{ $order->last_name }},</p>

    <p>We would like to inform you that the shipping information for your order <strong>#{{ $order->order_number }}</strong> has been successfully modified.</p>

    <div class="order-details" style="background-color: #e8f4fd; border-color: #b8daff;">
        <h3>Changes Made</h3>
        <table>
            <tr>
                <th>Field</th>
                <th>Previous Value</th>
                <th>New Value</th>
            </tr>
            @if($oldValues['address'] !== $order->address)
            <tr>
                <td>Address</td>
                <td>{{ $oldValues['address'] }}</td>
                <td>{{ $order->address }}</td>
            </tr>
            @endif
            @if($oldValues['city'] !== $order->city)
            <tr>
                <td>City</td>
                <td>{{ $oldValues['city'] }}</td>
                <td>{{ $order->city }}</td>
            </tr>
            @endif
            @if($oldValues['state'] !== $order->state)
            <tr>
                <td>State/Province</td>
                <td>{{ $oldValues['state'] ?: 'Not available' }}</td>
                <td>{{ $order->state ?: 'Not available' }}</td>
            </tr>
            @endif
            @if($oldValues['postal_code'] !== $order->postal_code)
            <tr>
                <td>Postal Code</td>
                <td>{{ $oldValues['postal_code'] }}</td>
                <td>{{ $order->postal_code }}</td>
            </tr>
            @endif
            @if($oldValues['country'] !== $order->country)
            <tr>
                <td>Country</td>
                <td>{{ $oldValues['country'] }}</td>
                <td>{{ $order->country }}</td>
            </tr>
            @endif
            @if($oldValues['phone'] !== $order->phone)
            <tr>
                <td>Phone</td>
                <td>{{ $oldValues['phone'] ?: 'Not available' }}</td>
                <td>{{ $order->phone ?: 'Not available' }}</td>
            </tr>
            @endif
            @if($oldValues['notes'] !== $order->notes)
            <tr>
                <td>Notes</td>
                <td>{{ $oldValues['notes'] ?: 'Not available' }}</td>
                <td>{{ $order->notes ?: 'Not available' }}</td>
            </tr>
            @endif
        </table>
    </div>

    <div class="order-details">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y') }}</p>
        <p>
            <strong>Status:</strong>
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
        <p><strong>Total:</strong> ${{ number_format($order->total, 2) }} {{ config('app.currency_symbol') }}</p>
    </div>

    <p>If you have any questions, please reply to this email or contact customer service.</p>

    <a href="{{ route('orders.show', $order->id) }}" class="btn">View Order Details</a>
@endsection
