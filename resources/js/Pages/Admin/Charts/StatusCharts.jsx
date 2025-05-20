import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export const ProductStatusChart = ({ productData }) => {
  const [chartOptions, setChartOptions] = useState({}); // State for options

  useEffect(() => {
    // Determine colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // gray-200 dark, gray-800 light
    const tooltipBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const tooltipBorderColor = isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.5)';

    // Options for doughnut chart
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor, // Dynamic text color
          }
        },
        title: {
          display: true,
          text: 'Product Status Overview',
          font: {
            size: 16,
          },
          color: textColor, // Dynamic text color
        },
        tooltip: { // Add tooltip styling for dark mode
          titleColor: textColor,
          bodyColor: textColor,
          backgroundColor: tooltipBgColor,
          borderColor: tooltipBorderColor,
          borderWidth: 1,
        }
      },
      cutout: '70%',
    };
    setChartOptions(options); // Set the options in state

  }, [productData]); // Re-run effect if data changes

  // Format data for chart (remains the same)
  const data = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [productData.inStock, productData.lowStock, productData.outOfStock],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)', // emerald-600 (green)
          'rgba(245, 158, 11, 0.7)', // amber-600 (yellow)
          'rgba(239, 68, 68, 0.7)',  // red-600
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-64">
      {/* Render chart only when options are ready */}
      {Object.keys(chartOptions).length > 0 && <Doughnut options={chartOptions} data={data} />}
    </div>
  );
};

export const OrderStatusChart = ({ orderData }) => {
  const [chartOptions, setChartOptions] = useState({}); // State for options

  useEffect(() => {
    // Determine colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // gray-200 dark, gray-800 light
    const tooltipBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const tooltipBorderColor = isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.5)';

    // Options for doughnut chart
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor, // Dynamic text color
          }
        },
        title: {
          display: true,
          text: 'Order Status Overview',
          font: {
            size: 16,
          },
          color: textColor, // Dynamic text color
        },
        tooltip: { // Add tooltip styling for dark mode
          titleColor: textColor,
          bodyColor: textColor,
          backgroundColor: tooltipBgColor,
          borderColor: tooltipBorderColor,
          borderWidth: 1,
        }
      },
      cutout: '70%',
    };
    setChartOptions(options); // Set the options in state

  }, [orderData]); // Re-run effect if data changes

  // Format data for chart (remains the same)
  const data = {
    labels: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [
      {
        data: [
          orderData.pending, 
          orderData.processing, 
          orderData.shipped, 
          orderData.delivered, 
          orderData.cancelled
        ],
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',  // indigo-600 (blue-purple)
          'rgba(245, 158, 11, 0.7)', // amber-600 (yellow)
          'rgba(37, 99, 235, 0.7)',  // blue-600
          'rgba(16, 185, 129, 0.7)', // emerald-600 (green)
          'rgba(239, 68, 68, 0.7)',  // red-600
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-64">
      {/* Render chart only when options are ready */}
      {Object.keys(chartOptions).length > 0 && <Doughnut options={chartOptions} data={data} />}
    </div>
  );
};
