import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export const ProductStatusChart = ({ productData }) => {
  // Options for doughnut chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Product Status Overview',
        font: {
          size: 16,
        },
      },
    },
    cutout: '70%',
  };

  // Format data for chart
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
      <Doughnut options={options} data={data} />
    </div>
  );
};

export const OrderStatusChart = ({ orderData }) => {
  // Options for doughnut chart
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Order Status Overview',
        font: {
          size: 16,
        },
      },
    },
    cutout: '70%',
  };

  // Format data for chart
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
      <Doughnut options={options} data={data} />
    </div>
  );
};
