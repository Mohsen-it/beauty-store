<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', config('app.name'))</title>
    <style>
        /* Base styles */
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        /* Header styles */
        .header {
            background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
            padding: 30px 20px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        
        .logo {
            max-width: 150px;
            margin-bottom: 15px;
        }
        
        /* Content styles */
        .content {
            padding: 30px 25px;
            background-color: #ffffff;
        }
        
        h2 {
            color: #333;
            font-size: 20px;
            margin-top: 0;
            margin-bottom: 20px;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 10px;
        }
        
        p {
            margin-bottom: 16px;
            color: #555;
        }
        
        /* Order details */
        .order-details {
            background-color: #f9f9f9;
            border: 1px solid #eee;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .order-details h3 {
            margin-top: 0;
            font-size: 18px;
            color: #444;
            margin-bottom: 15px;
        }
        
        /* Table styles */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th {
            background-color: #f5f5f5;
            text-align: left;
            padding: 10px;
            border-bottom: 2px solid #ddd;
            color: #555;
            font-weight: 600;
        }
        
        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            color: #666;
        }
        
        tfoot td {
            font-weight: bold;
            border-top: 2px solid #ddd;
        }
        
        /* Status indicators */
        .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: 500;
        }
        
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
        }
        
        .status-processing {
            background-color: #d1ecf1;
            color: #0c5460;
        }
        
        .status-shipped {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-delivered {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-cancelled {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .status-completed {
            background-color: #d4edda;
            color: #155724;
        }
        
        .status-failed {
            background-color: #f8d7da;
            color: #721c24;
        }
        
        .status-refunded {
            background-color: #e2e3e5;
            color: #383d41;
        }
        
        /* Button styles */
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #ff7eb3 0%, #ff758c 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-weight: 500;
            text-align: center;
            margin: 20px 0;
            transition: all 0.3s ease;
        }
        
        .btn:hover {
            background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
        }
        
        /* Footer styles */
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #eee;
        }
        
        .social-links {
            margin: 15px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 5px;
            color: #ff758c;
            text-decoration: none;
        }
        
        /* Responsive styles */
        @media only screen and (max-width: 480px) {
            .container {
                width: 100%;
                border-radius: 0;
            }
            
            .content {
                padding: 20px 15px;
            }
            
            .btn {
                display: block;
                width: 100%;
            }
            
            table {
                font-size: 14px;
            }
            
            th, td {
                padding: 8px 5px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            @if(config('app.logo'))
                <img src="{{ config('app.logo') }}" alt="{{ config('app.name') }}" class="logo">
            @endif
            <h1>@yield('header', config('app.name'))</h1>
        </div>
        
        <div class="content">
            @yield('content')
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            
            <div class="social-links">
                <a href="#" target="_blank">Facebook</a> |
                <a href="#" target="_blank">Instagram</a> |
                <a href="#" target="_blank">Twitter</a>
            </div>
            
            <p>If you have any questions, please contact our customer service at support@beautycosmetics.com</p>
            <p>This email was sent automatically. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
