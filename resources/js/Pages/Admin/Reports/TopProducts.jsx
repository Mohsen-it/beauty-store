import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopProductsReport = ({ productsData, timeRanges }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [limit, setLimit] = useState(10);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({}); // Initialize chart options state

  // Apply filters
  const applyFilters = () => {
    window.location.href = route('admin.reports.top-products', {
      period: timeRange,
      limit: limit
    });
  };

  // Prepare chart data and options when productsData, timeRange, or limit changes
  useEffect(() => {
    if (productsData) {
      // Determine text color based on dark mode
      const isDarkMode = document.documentElement.classList.contains('dark');
      const textColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // Example: gray-200 for dark, gray-800 for light
      const gridColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(209, 213, 219, 0.3)'; // Dark/Light grid lines
      const tooltipBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
      const tooltipBorderColor = isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.5)';

      setChartData({
        labels: productsData.map(product => product.name),
        datasets: [
          {
            label: 'Units Sold',
            data: productsData.map(product => product.quantity),
            backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
          {
            label: 'Revenue',
            data: productsData.map(product => product.revenue),
            backgroundColor: 'rgba(236, 72, 153, 0.5)', // Pink
            borderColor: 'rgba(236, 72, 153, 1)',
            borderWidth: 1,
          },
        ],
      });

      // Update chart options dynamically
      setChartOptions({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: textColor, // Set legend text color
            }
          },
          title: {
            display: true,
            text: `Top ${limit} Products - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
            color: textColor, // Set title text color
          },
          tooltip: {
            titleColor: textColor,
            bodyColor: textColor,
            backgroundColor: tooltipBgColor,
            borderColor: tooltipBorderColor,
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColor, // Set X-axis label color
            },
            grid: {
              color: gridColor, // Dark/Light grid lines
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor, // Set Y-axis label color
            },
            grid: {
              color: gridColor, // Dark/Light grid lines
            }
          },
        },
      });
    }
  }, [productsData, timeRange, limit]); // Add dependencies

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <AdminLayout title="Top Products Report">
      <Head title="Top Products Report" />

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Range Filter */}
          <div>
            <label htmlFor="timeRange" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">Time Period</label> {/* Dark text */}
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500" // Dark select
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Limit Filter */}
          <div>
            <label htmlFor="limit" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">Number of Products</label> {/* Dark text */}
            <select
              id="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500" // Dark select
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
            </select>
          </div>

          {/* Apply Button */}
          <div className="flex items-end">
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 dark:ring-offset-cinematic-800" // Dark button
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 flex justify-end space-x-2">
        <a
          href={route('admin.reports.export', { type: 'top-products', format: 'pdf', period: timeRange, limit: limit })}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:ring-offset-cinematic-800" // Dark button
          target="_blank"
        >
          Export PDF
        </a>
        <a
          href={route('admin.reports.export', { type: 'top-products', format: 'excel', period: timeRange, limit: limit })}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:ring-offset-cinematic-800" // Dark button
          target="_blank"
        >
          Export Excel
        </a>
      </div>

      {/* Products Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinematic-800 p-6 rounded-lg shadow dark:shadow-soft mb-6 border border-cinematic-200 dark:border-cinematic-700" // Dark bg, shadow, border
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Top Products Overview</h2> {/* Dark text */}
        {/* Ensure chart container has a defined height */}
        <div className="relative h-96">
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>
      </motion.div>

      {/* Products Table */}
      <div className="bg-white dark:bg-cinematic-800 shadow dark:shadow-soft overflow-hidden sm:rounded-md border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-cinematic-700"> {/* Dark border */}
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-cinematic-200">Detailed Products Data</h3> {/* Dark text */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark divider */}
            <thead className="bg-gray-50 dark:bg-cinematic-700"> {/* Dark thead */}
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Units Sold
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Revenue
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Average Price
                </th>
              </tr>
            </thead><tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark tbody, divider */}
              {productsData?.map((product, index) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50"> {/* Dark hover */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover border border-gray-200 dark:border-cinematic-600" // Dark image border
                          src={
                            product.image
                              ? `/storage/${product.image}?v=${new Date().getTime()}`
                              : product.images && product.images.length > 0
                                ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                                : `/assets/default-product.png?v=${new Date().getTime()}`
                          }
                          alt={product.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-cinematic-200">{product.name}</div> {/* Dark text */}
                        <div className="text-sm text-gray-500 dark:text-cinematic-400">{product.sku || 'No SKU'}</div> {/* Dark text */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {product.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {product.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {formatCurrency(product.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {formatCurrency(product.average_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TopProductsReport;
