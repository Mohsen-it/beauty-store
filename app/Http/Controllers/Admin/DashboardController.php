<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request)
    {
        // Get time period filter
        $period = $request->input('period', 'week');

        // Calculate date range based on period
        $startDate = $this->getStartDate($period);
        $endDate = Carbon::now();

        // Get counts for dashboard stats
        $productsCount = Product::count(); // Total count
        $ordersCount = Order::whereBetween('created_at', [$startDate, $endDate])->count(); // Period count
        $usersCount = User::count(); // Total count
        $categoriesCount = Category::count(); // Total count

        // Calculate total revenue for the period
        $revenue = Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$startDate, $endDate]) // Period filter
            ->sum('total');

        // Get recent orders for the period
        $recentOrders = Order::with('user')
            ->whereBetween('created_at', [$startDate, $endDate]) // Period filter
            ->latest()
            ->take(5)
            ->get();

        // Get top selling products for the period
        $topProducts = Product::withCount(['orderItems as sales_count' => function ($query) use ($startDate, $endDate) { // Period filter
            $query->whereHas('order', function ($subQuery) use ($startDate, $endDate) {
                $subQuery->whereBetween('created_at', [$startDate, $endDate]);
            });
        }])
        ->orderBy('sales_count', 'desc')
        ->take(5)
        ->get();

        // Get sales data for chart
        $salesData = $this->getSalesData($startDate, $endDate, $period);

        // Get orders by status for chart (this can be total or filtered by period as needed)
        $ordersByStatus = $this->getOrdersByStatus($startDate, $endDate); // Passing the period filter

        // Ensure we're using the correct path to the Dashboard component
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'products' => $productsCount,
                'orders' => $ordersCount,
                'users' => $usersCount,
                'categories' => $categoriesCount,
                'revenue' => number_format($revenue, 2),
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'salesData' => $salesData,
            'ordersByStatus' => $ordersByStatus,
        ]);
    }

    /**
     * Get start date based on period.
     */
    private function getStartDate($period)
    {
        switch ($period) {
            case 'day':
                return Carbon::now()->startOfDay();
            case 'week':
                return Carbon::now()->subWeek();
            case 'month':
                return Carbon::now()->subMonth();
            case 'year':
                return Carbon::now()->subYear();
            default:
                return Carbon::now()->subWeek();
        }
    }

    /**
     * Get sales data for chart.
     */
    private function getSalesData($startDate, $endDate, $period)
    {
        $labels = [];
        $values = [];

        // Format data based on period
        if ($period === 'day') {
            // Hourly data for today
            for ($i = 0; $i < 24; $i++) {
                $hour = Carbon::now()->startOfDay()->addHours($i);
                $labels[] = $hour->format('H:i');

                $value = Order::where('status', '!=', 'cancelled')
                    ->whereDate('created_at', $hour->toDateString())
                    ->whereTime('created_at', '>=', $hour->format('H:i:s'))
                    ->whereTime('created_at', '<', $hour->addHour()->format('H:i:s'))
                    ->sum('total');

                $values[] = $value;
            }
        } elseif ($period === 'week') {
            // Daily data for the week
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::now()->subDays($i);
                $labels[] = $date->format('D');

                $value = Order::where('status', '!=', 'cancelled')
                    ->whereDate('created_at', $date->toDateString())
                    ->sum('total');

                $values[] = $value;
            }
        } elseif ($period === 'month') {
            // Weekly data for the month
            for ($i = 0; $i < 4; $i++) {
                $weekStart = Carbon::now()->subDays(Carbon::now()->dayOfWeek)->subWeeks(3 - $i);
                $weekEnd = clone $weekStart;
                $weekEnd->addDays(6);

                $labels[] = $weekStart->format('M d') . ' - ' . $weekEnd->format('M d');

                $value = Order::where('status', '!=', 'cancelled')
                    ->whereBetween('created_at', [$weekStart->startOfDay(), $weekEnd->endOfDay()])
                    ->sum('total');

                $values[] = $value;
            }
        } else {
            // Monthly data for the year
            for ($i = 0; $i < 12; $i++) {
                $month = Carbon::now()->subMonths(11 - $i);
                $labels[] = $month->format('M');

                $value = Order::where('status', '!=', 'cancelled')
                    ->whereYear('created_at', $month->year)
                    ->whereMonth('created_at', $month->month)
                    ->sum('total');

                $values[] = $value;
            }
        }

        return [
            'labels' => $labels,
            'values' => $values,
        ];
    }

    /**
     * Get orders by status for chart.
     */
    private function getOrdersByStatus($startDate = null, $endDate = null)
    {
        $statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        $data = [];

        foreach ($statuses as $status) {
            $query = Order::where('status', $status);
            if ($startDate && $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
            $data[$status] = $query->count();
        }

        return $data;
    }
}
