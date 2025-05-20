import React from 'react';
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
  // Default options for line chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${period.charAt(0).toUpperCase() + period.slice(1)} Sales Overview`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
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
        },
      },
      x: {
        title: {
          display: true,
          text: period === 'monthly' ? 'Month' : period === 'weekly' ? 'Week' : 'Day',
        },
      },
    },
  };

  // Format data for chart
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
      <Line options={options} data={data} />
    </div>
  );
};

export const CategorySalesChart = ({ categoryData }) => {
  // Options for bar chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Category',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
    },
  };

  // Format data for chart
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
      <Bar options={options} data={data} />
    </div>
  );
};
