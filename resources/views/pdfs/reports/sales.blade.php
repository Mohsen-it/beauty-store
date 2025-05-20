<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sales Report</title>
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
        .summary {
            margin-bottom: 20px;
            padding: 10px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
        }
        .summary h2 {
            font-size: 16px;
            margin-top: 0;
            margin-bottom: 10px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
        }
        .summary-item {
            text-align: center;
        }
        .summary-item h3 {
            font-size: 14px;
            margin: 0;
        }
        .summary-item p {
            font-size: 16px;
            font-weight: bold;
            margin: 5px 0 0;
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
        <h1>Sales Report</h1>
        <p>Period: {{ ucfirst($period) }}</p>
        <p>Generated on: {{ now()->format('F j, Y, g:i a') }}</p>
    </div>

    <div class="summary">
        <h2>Summary</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <h3>Total Revenue</h3>
                <p>${{ number_format($salesData['summary']['total'], 2) }}</p>
            </div>
            <div class="summary-item">
                <h3>Orders</h3>
                <p>{{ $salesData['summary']['count'] }}</p>
            </div>
            <div class="summary-item">
                <h3>Items Sold</h3>
                <p>{{ $salesData['summary']['items'] }}</p>
            </div>
            <div class="summary-item">
                <h3>Average Order Value</h3>
                <p>${{ number_format($salesData['summary']['average'], 2) }}</p>
            </div>
        </div>
    </div>

    <h2>Detailed Sales Data</h2>
    <table>
        <thead>
            <tr>
                <th>Date/Period</th>
                <th>Orders</th>
                <th>Items Sold</th>
                <th>Revenue</th>
            </tr>
        </thead>
        <tbody>
            @foreach($salesData['details'] as $detail)
            <tr>
                <td>{{ $detail['date'] }}</td>
                <td>{{ $detail['orders'] }}</td>
                <td>{{ $detail['items'] }}</td>
                <td>${{ number_format($detail['revenue'], 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Beauty Shop - Sales Report - Confidential</p>
        <p>Page 1 of 1</p>
    </div>
</body>
</html>
