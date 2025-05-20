import React, { useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { motion } from "framer-motion";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const SalesReport = ({ salesData, timeRanges }) => {
  const [timeRange, setTimeRange] = useState("week");
  const [chartData, setChartData] = useState(null);

  const { get, processing } = useForm();

  // Apply time range filter
  const applyTimeRange = (range) => {
    setTimeRange(range);
    get(route("admin.reports.sales", { period: range }));
  };

  // Prepare chart data when salesData changes
  useEffect(() => {
    if (salesData) {
      // Determine text color based on dark mode
      const isDarkMode = document.documentElement.classList.contains("dark");
      const textColor = isDarkMode ? "#e5e7eb" : "#1f2937"; // Example: gray-200 for dark, gray-800 for light

      setChartData({
        labels: salesData.labels,
        datasets: [
          {
            label: "Sales",
            data: salesData.values,
            backgroundColor: "rgba(236, 72, 153, 0.2)", // Pink with transparency
            borderColor: "rgba(236, 72, 153, 1)", // Solid Pink
            borderWidth: 2,
            tension: 0.4,
            pointBackgroundColor: "rgba(236, 72, 153, 1)",
            pointBorderColor: "#fff", // White border for points
          },
        ],
      });

      // Update chart options dynamically for dark mode
      setChartOptions((prevOptions) => ({
        ...prevOptions,
        plugins: {
          ...prevOptions.plugins,
          legend: {
            ...prevOptions.plugins.legend,
            labels: {
              color: textColor, // Set legend text color
            },
          },
          title: {
            ...prevOptions.plugins.title,
            color: textColor, // Set title text color
            text: `Sales Report - ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`,
          },
          tooltip: {
            titleColor: textColor,
            bodyColor: textColor,
            backgroundColor: isDarkMode
              ? "rgba(31, 41, 55, 0.8)"
              : "rgba(255, 255, 255, 0.8)", // Dark/Light tooltip bg
            borderColor: isDarkMode
              ? "rgba(107, 114, 128, 0.5)"
              : "rgba(209, 213, 219, 0.5)",
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            ticks: {
              color: textColor, // Set X-axis label color
            },
            grid: {
              color: isDarkMode
                ? "rgba(55, 65, 81, 0.3)"
                : "rgba(209, 213, 219, 0.3)", // Dark/Light grid lines
            },
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: textColor, // Set Y-axis label color
              callback: function (value) {
                return "$" + value;
              },
            },
            grid: {
              color: isDarkMode
                ? "rgba(55, 65, 81, 0.3)"
                : "rgba(209, 213, 219, 0.3)", // Dark/Light grid lines
            },
          },
        },
      }));
    }
  }, [salesData, timeRange]); // Add timeRange dependency to update title

  // Initial chart options (will be updated by useEffect)
  const [chartOptions, setChartOptions] = useState({
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize height
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#1f2937", // Default light mode color
        },
      },
      title: {
        display: true,
        text: `Sales Report`, // Initial text
        color: "#1f2937", // Default light mode color
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#1f2937", // Default light mode color
        },
        grid: {
          color: "rgba(209, 213, 219, 0.3)", // Default light mode grid
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#1f2937", // Default light mode color
          callback: function (value) {
            return "$" + value;
          },
        },
        grid: {
          color: "rgba(209, 213, 219, 0.3)", // Default light mode grid
        },
      },
    },
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <AdminLayout title="Sales Reports">
      <Head title="Sales Reports" />

      {/* Time Range Filter */}
      <div className="mb-6">
        <div className="flex space-x-4 bg-white p-4 rounded-lg shadow">
          <button
            onClick={() => applyTimeRange("day")}
            className={`px-4 py-2 rounded-md ${timeRange === "day" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Today
          </button>
          <button
            onClick={() => applyTimeRange("week")}
            className={`px-4 py-2 rounded-md ${timeRange === "week" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            This Week
          </button>
          <button
            onClick={() => applyTimeRange("month")}
            className={`px-4 py-2 rounded-md ${timeRange === "month" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            This Month
          </button>
          <button
            onClick={() => applyTimeRange("year")}
            className={`px-4 py-2 rounded-md ${timeRange === "year" ? "bg-pink-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="mb-6 flex justify-end space-x-2">
        <a
          href={route("admin.reports.export", {
            type: "sales",
            format: "pdf",
            period: timeRange,
          })}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:ring-offset-cinematic-800" // Dark button styles
          target="_blank"
        >
          Export PDF
        </a>
        <a
          href={route("admin.reports.export", {
            type: "sales",
            format: "excel",
            period: timeRange,
          })}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:ring-offset-cinematic-800" // Dark button styles
          target="_blank"
        >
          Export Excel
        </a>
      </div>

      {/* Sales Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinematic-800 p-6 rounded-lg shadow dark:shadow-soft mb-6 border border-cinematic-200 dark:border-cinematic-700" // Dark bg, shadow, border
      >
        <h2 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">
          Sales Overview
        </h2>
        {/* Dark text */}
        {/* Ensure chart container has a defined height */}
        <div className="relative h-96">
          {chartData && <Line data={chartData} options={chartOptions} />}
        </div>
      </motion.div>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
          
          {/* Dark bg, shadow, border */}
          <h3 className="text-sm font-medium text-gray-500 dark:text-cinematic-400">
            Total Sales
          </h3>
          {/* Dark text */}
          <p className="text-2xl font-bold text-gray-900 dark:text-cinematic-200">
            {formatCurrency(salesData?.summary?.total || 0)}
          </p>
          {/* Dark text */}
        </div>
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
          
          {/* Dark bg, shadow, border */}
          <h3 className="text-sm font-medium text-gray-500 dark:text-cinematic-400">
            Average Order Value
          </h3>
          {/* Dark text */}
          <p className="text-2xl font-bold text-gray-900 dark:text-cinematic-200">
            {formatCurrency(salesData?.summary?.average || 0)}
          </p>
          {/* Dark text */}
        </div>
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
          
          {/* Dark bg, shadow, border */}
          <h3 className="text-sm font-medium text-gray-500 dark:text-cinematic-400">
            Orders Count
          </h3>
          {/* Dark text */}
          <p className="text-2xl font-bold text-gray-900 dark:text-cinematic-200">
            {salesData?.summary?.count || 0}
          </p>
          {/* Dark text */}
        </div>
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
          
          {/* Dark bg, shadow, border */}
          <h3 className="text-sm font-medium text-gray-500 dark:text-cinematic-400">
            Items Sold
          </h3>
          {/* Dark text */}
          <p className="text-2xl font-bold text-gray-900 dark:text-cinematic-200">
            {salesData?.summary?.items || 0}
          </p>
          {/* Dark text */}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-cinematic-800 shadow dark:shadow-soft overflow-hidden sm:rounded-md border border-cinematic-200 dark:border-cinematic-700">
        
        {/* Dark bg, shadow, border */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-cinematic-700">
          
          {/* Dark border */}
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-cinematic-200">
            Detailed Sales Data
          </h3>
          {/* Dark text */}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700">
            
            {/* Dark divider */}
            <thead className="bg-gray-50 dark:bg-cinematic-700">
              
              {/* Dark thead */}
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"
                >
                  
                  {/* Dark th text */}
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"
                >
                  
                  {/* Dark th text */}
                  Orders
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"
                >
                  
                  {/* Dark th text */}
                  Items Sold
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider"
                >
                  
                  {/* Dark th text */}
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700">
              
              {/* Dark tbody, divider */}
              {salesData?.details?.length > 0 ? (
                salesData.details.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50"
                  >
                    
                    {/* Dark hover */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300">
                      
                      {/* Dark text */}
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300">
                      
                      {/* Dark text */}
                      {item.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300">
                      
                      {/* Dark text */}
                      {item.items}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-300">
                      
                      {/* Dark text */}
                      {formatCurrency(item.revenue)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-4 text-center text-gray-500 dark:text-cinematic-400"
                  >
                    
                    {/* Dark text */}
                    No detailed sales data available for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesReport;
