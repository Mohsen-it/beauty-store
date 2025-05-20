<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; // لاحظ الحرف الكبير في Pdf

use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SalesExport;
use App\Exports\TopProductsExport;

class ReportController extends Controller
{
    /**
     * Display sales report.
     */
    public function salesReport(Request $request)
    {
        $period = $request->period ?? 'week';
        $salesData = $this->getSalesData($period);
        
        return Inertia::render('Admin/Reports/Sales', [
            'salesData' => $salesData,
            'timeRanges' => ['day', 'week', 'month', 'year'],
        ]);
    }
    
    /**
     * Display top products report.
     */
    public function topProductsReport(Request $request)
    {
        $period = $request->period ?? 'month';
        $limit = $request->limit ?? 10;
        
        $productsData = $this->getTopProductsData($period, $limit);
        
        return Inertia::render('Admin/Reports/TopProducts', [
            'productsData' => $productsData,
            'timeRanges' => ['week', 'month', 'quarter', 'year', 'all'],
        ]);
    }
    
    /**
     * Export report to PDF or Excel.
     */
    public function exportReport(Request $request)
    {
        $type = $request->type;
        $format = $request->format;
        $period = $request->period ?? 'month';
        $limit = $request->limit ?? 10;
        
        if ($type === 'sales') {
            $data = $this->getSalesData($period);
            
            if ($format === 'pdf') {
                $pdf = Pdf::loadView('pdfs.reports.sales', [
                    'salesData' => $data,
                    'period' => $period,
                ]);
                
                return $pdf->download('sales-report-' . $period . '.pdf');
            } elseif ($format === 'excel') {
                return Excel::download(new SalesExport($data), 'sales-report-' . $period . '.xlsx');
            }
        } elseif ($type === 'top-products') {
            $data = $this->getTopProductsData($period, $limit);
            
            if ($format === 'pdf') {
                $pdf = Pdf::loadView('pdfs.reports.top-products', [
                    'productsData' => $data,
                    'period' => $period,
                    'limit' => $limit,
                ]);
                
                return $pdf->download('top-products-report-' . $period . '.pdf');
            } elseif ($format === 'excel') {
                return Excel::download(new TopProductsExport($data), 'top-products-report-' . $period . '.xlsx');
            }
        }
        
        return back()->with('error', 'Invalid report type or format.');
    }
    
    /**
     * Get sales data for the specified period.
     */
    private function getSalesData($period)
    {
        $startDate = $this->getStartDate($period);
        $endDate = Carbon::now();
        
        // Get orders within the date range
        $orders = Order::whereBetween('created_at', [$startDate, $endDate])
                       ->where('status', '!=', 'cancelled')
                       ->get();
        
        // Prepare data based on period
        $labels = [];
        $values = [];
        $details = [];
        
        if ($period === 'day') {
            // Hourly data for today
            for ($hour = 0; $hour < 24; $hour++) {
                $hourStart = Carbon::today()->addHours($hour);
                $hourEnd = Carbon::today()->addHours($hour + 1);
                
                $hourOrders = $orders->filter(function ($order) use ($hourStart, $hourEnd) {
                    return Carbon::parse($order->created_at)->between($hourStart, $hourEnd);
                });
                
                $labels[] = $hourStart->format('h:i A');
                $values[] = $hourOrders->sum('total');
                
                $details[] = [
                    'date' => $hourStart->format('h:i A'),
                    'orders' => $hourOrders->count(),
                    'items' => $hourOrders->sum(function ($order) {
                        return $order->items->sum('quantity');
                    }),
                    'revenue' => $hourOrders->sum('total'),
                ];
            }
        } elseif ($period === 'week') {
            // Daily data for this week
            for ($day = 6; $day >= 0; $day--) {
                $date = Carbon::now()->subDays($day);
                
                $dayOrders = $orders->filter(function ($order) use ($date) {
                    return Carbon::parse($order->created_at)->isSameDay($date);
                });
                
                $labels[] = $date->format('D');
                $values[] = $dayOrders->sum('total');
                
                $details[] = [
                    'date' => $date->format('D, M j'),
                    'orders' => $dayOrders->count(),
                    'items' => $dayOrders->sum(function ($order) {
                        return $order->items->sum('quantity');
                    }),
                    'revenue' => $dayOrders->sum('total'),
                ];
            }
        } elseif ($period === 'month') {
            // Weekly data for this month
            $weeksInMonth = ceil($endDate->diffInDays($startDate) / 7);
            
            for ($week = 0; $week < $weeksInMonth; $week++) {
                $weekStart = clone $startDate;
                $weekStart->addWeeks($week);
                
                $weekEnd = clone $weekStart;
                $weekEnd->addDays(6);
                
                if ($weekEnd > $endDate) {
                    $weekEnd = clone $endDate;
                }
                
                $weekOrders = $orders->filter(function ($order) use ($weekStart, $weekEnd) {
                    $orderDate = Carbon::parse($order->created_at);
                    return $orderDate->between($weekStart, $weekEnd);
                });
                
                $labels[] = $weekStart->format('M j') . ' - ' . $weekEnd->format('M j');
                $values[] = $weekOrders->sum('total');
                
                $details[] = [
                    'date' => $weekStart->format('M j') . ' - ' . $weekEnd->format('M j'),
                    'orders' => $weekOrders->count(),
                    'items' => $weekOrders->sum(function ($order) {
                        return $order->items->sum('quantity');
                    }),
                    'revenue' => $weekOrders->sum('total'),
                ];
            }
        } elseif ($period === 'year') {
            // Monthly data for this year
            for ($month = 0; $month < 12; $month++) {
                $monthStart = Carbon::now()->startOfYear()->addMonths($month);
                $monthEnd = Carbon::now()->startOfYear()->addMonths($month + 1)->subDay();
                
                if ($monthEnd > $endDate) {
                    $monthEnd = clone $endDate;
                }
                
                $monthOrders = $orders->filter(function ($order) use ($monthStart, $monthEnd) {
                    $orderDate = Carbon::parse($order->created_at);
                    return $orderDate->between($monthStart, $monthEnd);
                });
                
                $labels[] = $monthStart->format('M');
                $values[] = $monthOrders->sum('total');
                
                $details[] = [
                    'date' => $monthStart->format('F Y'),
                    'orders' => $monthOrders->count(),
                    'items' => $monthOrders->sum(function ($order) {
                        return $order->items->sum('quantity');
                    }),
                    'revenue' => $monthOrders->sum('total'),
                ];
            }
        }
        
        // Calculate summary
        $totalSales = $orders->sum('total');
        $ordersCount = $orders->count();
        $averageOrderValue = $ordersCount > 0 ? $totalSales / $ordersCount : 0;
        $itemsSold = $orders->sum(function ($order) {
            return $order->items->sum('quantity');
        });
        
        return [
            'labels' => $labels,
            'values' => $values,
            'details' => $details,
            'summary' => [
                'total' => $totalSales,
                'average' => $averageOrderValue,
                'count' => $ordersCount,
                'items' => $itemsSold,
            ],
        ];
    }
    
    /**
     * Get top products data for the specified period.
     */
    private function getTopProductsData($period, $limit)
    {
        $startDate = $this->getStartDate($period);
        $endDate = Carbon::now();
        
        // Get orders within the date range
        $orders = Order::whereBetween('created_at', [$startDate, $endDate])
                       ->where('status', '!=', 'cancelled')
                       ->with('items.product')
                       ->get();
        
        // Aggregate product sales
        $productSales = [];
        
        foreach ($orders as $order) {
            foreach ($order->items as $item) {
                $productId = $item->product_id;
                
                if (!isset($productSales[$productId])) {
                    $productSales[$productId] = [
                        'id' => $productId,
                        'name' => $item->product->name,
                        'sku' => $item->product->sku,
                        'image' => $item->product->image,
                        'category' => $item->product->category->name ?? 'Uncategorized',
                        'quantity' => 0,
                        'revenue' => 0,
                    ];
                }
                
                $productSales[$productId]['quantity'] += $item->quantity;
                $productSales[$productId]['revenue'] += $item->price * $item->quantity;
            }
        }
        
        // Sort by revenue (descending)
        usort($productSales, function ($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });
        
        // Limit results
        $productSales = array_slice($productSales, 0, $limit);
        
        // Calculate average price
        foreach ($productSales as &$product) {
            $product['average_price'] = $product['quantity'] > 0 ? $product['revenue'] / $product['quantity'] : 0;
        }
        
        return $productSales;
    }
    
    /**
     * Get start date based on period.
     */
    private function getStartDate($period)
    {
        switch ($period) {
            case 'day':
                return Carbon::today();
            case 'week':
                return Carbon::now()->subDays(6)->startOfDay();
            case 'month':
                return Carbon::now()->startOfMonth();
            case 'quarter':
                return Carbon::now()->startOfQuarter();
            case 'year':
                return Carbon::now()->startOfYear();
            case 'all':
                return Carbon::createFromDate(2000, 1, 1);
            default:
                return Carbon::now()->subDays(30);
        }
    }
}
