import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopCustomersReport = ({ customersData, timeRanges }) => {
  const [timeRange, setTimeRange] = useState('month');
  const [limit, setLimit] = useState(10);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({}); // Initialize chart options state
  
  // Apply filters
  const applyFilters = () => {
    window.location.href = route('admin.reports.top-customers', { 
      period: timeRange,
      limit: limit
    });
  };
  
  // Prepare chart data and options when customersData, timeRange, or limit changes
  useEffect(() => {
    if (customersData) {
      // Determine text color based on dark mode
      const isDarkMode = document.documentElement.classList.contains('dark');
      const textColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // Example: gray-200 for dark, gray-800 for light
      const gridColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(209, 213, 219, 0.3)'; // Dark/Light grid lines
      const tooltipBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
      const tooltipBorderColor = isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.5)';

      setChartData({
        labels: customersData.map(customer => customer.name),
        datasets: [
          {
            label: 'Orders Count',
            data: customersData.map(customer => customer.orders_count),
            backgroundColor: 'rgba(59, 130, 246, 0.5)', // Blue
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
          {
            label: 'Total Spent',
            data: customersData.map(customer => customer.total_spent),
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
            text: `Top ${limit} Customers - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
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
  }, [customersData, timeRange, limit]); // Add dependencies
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  return (
    <AdminLayout title="Top Customers Report">
      <Head title="Top Customers Report" />
      
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
            <label htmlFor="limit" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">Number of Customers</label> {/* Dark text */}
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
          href={route('admin.reports.export', { type: 'top-customers', format: 'pdf', period: timeRange, limit: limit })}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:ring-offset-cinematic-800" // Dark button
          target="_blank"
        >
          Export PDF
        </a>
        <a
          href={route('admin.reports.export', { type: 'top-customers', format: 'excel', period: timeRange, limit: limit })}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:ring-offset-cinematic-800" // Dark button
          target="_blank"
        >
          Export Excel
        </a>
      </div>
      
      {/* Customers Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinematic-800 p-6 rounded-lg shadow dark:shadow-soft mb-6 border border-cinematic-200 dark:border-cinematic-700" // Dark bg, shadow, border
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Top Customers Overview</h2> {/* Dark text */}
        {/* Ensure chart container has a defined height */}
        <div className="relative h-96">
          {chartData && <Bar data={chartData} options={chartOptions} />}
        </div>
      </motion.div>
      
      {/* Customers Table */}
      <div className="bg-white dark:bg-cinematic-800 shadow dark:shadow-soft overflow-hidden sm:rounded-md border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-cinematic-700"> {/* Dark border */}
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-cinematic-200">Detailed Customer Data</h3> {/* Dark text */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark divider */}
            <thead className="bg-gray-50 dark:bg-cinematic-700"> {/* Dark thead */}
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Rank
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Orders
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Total Spent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Average Order
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"> {/* Dark th text */}
                  Last Order
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark tbody, divider */}
              {customersData?.map((customer, index) => (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50"> {/* Dark hover */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-cinematic-600 flex items-center justify-center text-gray-500 dark:text-cinematic-300"> {/* Dark avatar bg */}
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-cinematic-200">{customer.name}</div> {/* Dark text */}
                        <div className="text-sm text-gray-500 dark:text-cinematic-400">{customer.email}</div> {/* Dark text */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {formatDate(customer.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {customer.orders_count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {formatCurrency(customer.total_spent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {formatCurrency(customer.average_order)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                    {formatDate(customer.last_order_date)}
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

export default TopCustomersReport;
