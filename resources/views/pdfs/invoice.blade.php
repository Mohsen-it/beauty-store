<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Invoice</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .invoice-number {
            font-size: 16px;
            color: #666;
        }
        .company-details {
            text-align: left;
            float: left;
            width: 50%;
        }
        .customer-details {
            text-align: right;
            float: right;
            width: 50%;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        .invoice-meta {
            margin: 20px 0;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
        }
        .invoice-meta-item {
            display: inline-block;
            margin-right: 20px;
        }
        .invoice-meta-label {
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f8f8f8;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            width: 300px;
            float: right;
            margin-top: 20px;
        }
        .total-row {
            padding: 5px 0;
        }
        .total-row.final {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #333;
            padding-top: 10px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#{{ $order->id }}</div>
        </div>
        
        <div class="clearfix">
            <div class="company-details">
                <h3>Beauty Cosmetics</h3>
                <p>
                    123 Beauty Street<br>
                    Cosmetics City, BC 12345<br>
                    Phone: (123) 456-7890<br>
                    Email: info@beautycosmetics.com
                </p>
            </div>
            
            <div class="customer-details">
                <h3>Bill To</h3>
                <p>
                    {{ $order->user->name }}<br>
                    {{ $order->shipping_address->address_line1 }}<br>
                    @if($order->shipping_address->address_line2)
                        {{ $order->shipping_address->address_line2 }}<br>
                    @endif
                    {{ $order->shipping_address->city }}, {{ $order->shipping_address->state }} {{ $order->shipping_address->postal_code }}<br>
                    {{ $order->shipping_address->country }}<br>
                    Email: {{ $order->user->email }}
                </p>
            </div>
        </div>
        
        <div class="invoice-meta">
            <div class="invoice-meta-item">
                <span class="invoice-meta-label">Invoice Date:</span>
                <span>{{ date('F j, Y', strtotime($order->created_at)) }}</span>
            </div>
            <div class="invoice-meta-item">
                <span class="invoice-meta-label">Order Date:</span>
                <span>{{ date('F j, Y', strtotime($order->created_at)) }}</span>
            </div>
            <div class="invoice-meta-item">
                <span class="invoice-meta-label">Payment Method:</span>
                <span>{{ $order->payment_method ?? 'Credit Card' }}</span>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th class="text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>
                        {{ $item->product->name }}
                        @if($item->product->sku)
                            <br><small>SKU: {{ $item->product->sku }}</small>
                        @endif
                    </td>
                    <td>${{ number_format($item->price, 2) }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td class="text-right">${{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        <div class="totals">
            <div class="total-row">
                <div class="clearfix">
                    <div style="float: left;">Subtotal</div>
                    <div style="float: right;">${{ number_format($order->subtotal, 2) }}</div>
                </div>
            </div>
            <div class="total-row">
                <div class="clearfix">
                    <div style="float: left;">Shipping</div>
                    <div style="float: right;">${{ number_format($order->shipping_cost, 2) }}</div>
                </div>
            </div>
            @if($order->discount > 0)
            <div class="total-row">
                <div class="clearfix">
                    <div style="float: left;">Discount</div>
                    <div style="float: right;">-${{ number_format($order->discount, 2) }}</div>
                </div>
            </div>
            @endif
            <div class="total-row">
                <div class="clearfix">
                    <div style="float: left;">Tax</div>
                    <div style="float: right;">${{ number_format($order->tax, 2) }}</div>
                </div>
            </div>
            <div class="total-row final">
                <div class="clearfix">
                    <div style="float: left;">Total</div>
                    <div style="float: right;">${{ number_format($order->total, 2) }}</div>
                </div>
            </div>
        </div>
        
        <div style="clear: both;"></div>
        
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>&copy; {{ date('Y') }} Beauty Cosmetics. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
