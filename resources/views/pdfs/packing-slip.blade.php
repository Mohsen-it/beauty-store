<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Packing Slip</title>
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
        .packing-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .order-number {
            font-size: 16px;
            color: #666;
        }
        .company-details {
            text-align: left;
            float: left;
            width: 50%;
        }
        .shipping-details {
            text-align: right;
            float: right;
            width: 50%;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
        .order-meta {
            margin: 20px 0;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
        }
        .order-meta-item {
            display: inline-block;
            margin-right: 20px;
        }
        .order-meta-label {
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
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .notes {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="packing-title">PACKING SLIP</div>
            <div class="order-number">Order #{{ $order->id }}</div>
        </div>
        
        <div class="clearfix">
            <div class="company-details">
                <h3>From</h3>
                <p>
                    Beauty Cosmetics<br>
                    123 Beauty Street<br>
                    Cosmetics City, BC 12345<br>
                    Phone: (123) 456-7890
                </p>
            </div>
            
            <div class="shipping-details">
                <h3>Ship To</h3>
                <p>
                    {{ $order->shipping_address->name }}<br>
                    {{ $order->shipping_address->address_line1 }}<br>
                    @if($order->shipping_address->address_line2)
                        {{ $order->shipping_address->address_line2 }}<br>
                    @endif
                    {{ $order->shipping_address->city }}, {{ $order->shipping_address->state }} {{ $order->shipping_address->postal_code }}<br>
                    {{ $order->shipping_address->country }}
                </p>
            </div>
        </div>
        
        <div class="order-meta">
            <div class="order-meta-item">
                <span class="order-meta-label">Order Date:</span>
                <span>{{ date('F j, Y', strtotime($order->created_at)) }}</span>
            </div>
            <div class="order-meta-item">
                <span class="order-meta-label">Shipping Method:</span>
                <span>{{ $order->shipping_method ?? 'Standard Shipping' }}</span>
            </div>
            @if($order->tracking_number)
            <div class="order-meta-item">
                <span class="order-meta-label">Tracking Number:</span>
                <span>{{ $order->tracking_number }}</span>
            </div>
            @endif
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->items as $item)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $item->product->sku ?? 'N/A' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>{{ $item->product->name }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
        
        @if($order->notes)
        <div class="notes">
            <h3>Order Notes</h3>
            <p>{{ $order->notes }}</p>
        </div>
        @endif
        
        <div class="footer">
            <p>This is not an invoice. No prices are included.</p>
            <p>Thank you for your order!</p>
            <p>&copy; {{ date('Y') }} Beauty Cosmetics. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
