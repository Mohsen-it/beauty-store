import React, { useEffect, useState } from 'react'; // Import useState and useEffect
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const SalesLineChart = ({ salesData, period = 'monthly' }) => {
  const [chartOptions, setChartOptions] = useState({}); // State for options

  useEffect(() => {
    // Determine colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // gray-200 dark, gray-800 light
    const gridColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(209, 213, 219, 0.3)'; // gray-700 dark, gray-300 light
    const tooltipBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const tooltipBorderColor = isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.5)';

    // Default options for line chart
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor, // Dynamic text color
          }
        },
        title: {
          display: true,
          text: `${period.charAt(0).toUpperCase() + period.slice(1)} Sales Overview`,
          font: {
            size: 16,
          },
          color: textColor, // Dynamic text color
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          titleColor: textColor,
          bodyColor: textColor,
          backgroundColor: tooltipBgColor,
          borderColor: tooltipBorderColor,
          borderWidth: 1,
        },
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue ($)',
            color: textColor, // Dynamic text color
          },
          ticks: {
            color: textColor, // Dynamic tick color
          },
          grid: {
            color: gridColor, // Dynamic grid color
          }
        },
        x: {
          title: {
            display: true,
            text: period === 'monthly' ? 'Month' : period === 'weekly' ? 'Week' : 'Day',
            color: textColor, // Dynamic text color
          },
          ticks: {
            color: textColor, // Dynamic tick color
          },
          grid: {
            color: gridColor, // Dynamic grid color
          }
        },
      },
    };
    setChartOptions(options); // Set the options in state

    // Optional: Add listener for theme changes if needed, requires cleanup
    // const observer = new MutationObserver(...)
    // observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    // return () => observer.disconnect();

  }, [period, salesData]); // Re-run effect if period or data changes

  // Format data for chart (remains the same)
  const data = {
    labels: salesData.labels,
    datasets: [
      {
        label: 'Sales',
        data: salesData.sales,
        borderColor: 'rgb(219, 39, 119)', // pink-600
        backgroundColor: 'rgba(219, 39, 119, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Orders',
        data: salesData.orders,
        borderColor: 'rgb(79, 70, 229)', // indigo-600
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-full h-80">
      {/* Render chart only when options are ready */}
      {Object.keys(chartOptions).length > 0 && <Line options={chartOptions} data={data} />}
    </div>
  );
};

export const CategorySalesChart = ({ categoryData }) => {
  const [chartOptions, setChartOptions] = useState({}); // State for options

  useEffect(() => {
    // Determine colors based on dark mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#1f2937'; // gray-200 dark, gray-800 light
    const gridColor = isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(209, 213, 219, 0.3)'; // gray-700 dark, gray-300 light
    const tooltipBgColor = isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    const tooltipBorderColor = isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(209, 213, 219, 0.5)';

    // Options for bar chart
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor, // Dynamic text color
          }
        },
        title: {
          display: true,
          text: 'Sales by Category',
          font: {
            size: 16,
          },
          color: textColor, // Dynamic text color
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
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue ($)',
            color: textColor, // Dynamic text color
          },
          ticks: {
            color: textColor, // Dynamic tick color
          },
          grid: {
            color: gridColor, // Dynamic grid color
          }
        },
        x: { // Added X-axis configuration for consistency
          ticks: {
            color: textColor, // Dynamic tick color
          },
          grid: {
            color: gridColor, // Dynamic grid color
          }
        }
      },
    };
    setChartOptions(options); // Set the options in state

  }, [categoryData]); // Re-run effect if data changes

  // Format data for chart (remains the same)
  const data = {
    labels: categoryData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: categoryData.revenue,
        backgroundColor: [
          'rgba(219, 39, 119, 0.7)', // pink-600
          'rgba(79, 70, 229, 0.7)',  // indigo-600
          'rgba(16, 185, 129, 0.7)', // emerald-600
          'rgba(245, 158, 11, 0.7)', // amber-600
          'rgba(239, 68, 68, 0.7)',  // red-600
          'rgba(37, 99, 235, 0.7)',  // blue-600
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-80">
      {/* Render chart only when options are ready */}
      {Object.keys(chartOptions).length > 0 && <Bar options={chartOptions} data={data} />}
    </div>
  );
};
