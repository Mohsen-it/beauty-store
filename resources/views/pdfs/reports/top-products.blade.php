<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Top Products Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            font-size: 18px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 14px;
            margin: 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .product-info {
            display: flex;
            align-items: center;
        }
        .product-image {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            object-fit: cover;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            color: #777;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Top Products Report</h1>
        <p>Period: {{ ucfirst($period) }}</p>
        <p>Showing top {{ $limit }} products</p>
        <p>Generated on: {{ now()->format('F j, Y, g:i a') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Product</th>
                <th>Category</th>
                <th>Quantity Sold</th>
                <th>Revenue</th>
                <th>Avg. Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach($productsData as $index => $product)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>
                    <div class="product-info">
                        <img src="{{ $product['image'] }}" alt="{{ $product['name'] }}" class="product-image">
                        <div>
                            <div><strong>{{ $product['name'] }}</strong></div>
                            <div>SKU: {{ $product['sku'] ?? 'N/A' }}</div>
                        </div>
                    </div>
                </td>
                <td>{{ $product['category'] }}</td>
                <td>{{ $product['quantity'] }}</td>
                <td>${{ number_format($product['revenue'], 2) }}</td>
                <td>${{ number_format($product['average_price'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Beauty Shop - Top Products Report - Confidential</p>
        <p>Page 1 of 1</p>
    </div>
</body>
</html>
