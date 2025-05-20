import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-pink-600">
                  Cosmetics Store
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={route('admin.dashboard')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href={route('admin.products.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href={route('admin.categories.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
                <Link
                  href={route('admin.orders.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Orders
                </Link>
                <Link
                  href={route('admin.users.index')}
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Users
                </Link>
                <Link
                  href={route('admin.reports.index')}
                  className="border-pink-500 dark:border-pink-600 text-gray-900 dark:text-cinematic-100 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Reports
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href={route('home')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                View Store
              </Link>
              <div className="ml-3 relative">
                <Link
                  href={route('profile.edit')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const ReportsDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('sales');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Add state for dark mode

  // Detect dark mode (example using localStorage or system preference)
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark'); // Apply dark class to HTML element
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Add listener for system changes if needed
  }, []);

  // Sample data for reports
  const salesData = {
    daily: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Sales',
          data: [1200, 1900, 1500, 2000, 2400, 2800, 3200],
          borderColor: 'rgb(219, 39, 119)',
          backgroundColor: 'rgba(219, 39, 119, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    weekly: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Sales',
          data: [8500, 10200, 9800, 12500],
          borderColor: 'rgb(219, 39, 119)',
          backgroundColor: 'rgba(219, 39, 119, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    },
    month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Sales',
          data: [30000, 35000, 32000, 38000, 42000, 45000, 48000, 50000, 47000, 52000, 55000, 60000],
          borderColor: isDarkMode ? 'rgb(236, 72, 153)' : 'rgb(219, 39, 119)', // Lighter pink for dark
          backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.2)' : 'rgba(219, 39, 119, 0.1)', // Adjusted alpha
          fill: true,
          tension: 0.4
        }
      ]
    },
    year: {
      labels: ['2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Sales',
          data: [350000, 420000, 480000, 520000, 580000],
          borderColor: 'rgb(219, 39, 119)',
          backgroundColor: 'rgba(219, 39, 119, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }
  };
  
  const productData = {
    daily: {
      labels: ['Hydrating Face Cream', 'Volumizing Mascara', 'Nourishing Shampoo', 'Exfoliating Body Scrub', 'Floral Perfume'],
      datasets: [
        {
          label: 'Units Sold',
          data: [25, 40, 30, 20, 15],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    weekly: {
      labels: ['Hydrating Face Cream', 'Volumizing Mascara', 'Nourishing Shampoo', 'Exfoliating Body Scrub', 'Floral Perfume'],
      datasets: [
        {
          label: 'Units Sold',
          data: [120, 180, 150, 100, 90],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    month: {
      labels: ['Hydrating Face Cream', 'Volumizing Mascara', 'Nourishing Shampoo', 'Exfoliating Body Scrub', 'Floral Perfume'],
      datasets: [
        {
          label: 'Units Sold',
          data: [520, 780, 650, 430, 380],
          backgroundColor: isDarkMode ? [
            'rgba(255, 119, 147, 0.7)', // Lighter Red
            'rgba(84, 182, 255, 0.7)', // Lighter Blue
            'rgba(255, 216, 116, 0.7)',// Lighter Yellow
            'rgba(105, 212, 212, 0.7)',// Lighter Teal
            'rgba(183, 132, 255, 0.7)' // Lighter Purple
          ] : [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: isDarkMode ? [ // Add darker borders for dark mode if needed
            'rgba(255, 119, 147, 1)',
            'rgba(84, 182, 255, 1)',
            'rgba(255, 216, 116, 1)',
            'rgba(105, 212, 212, 1)',
            'rgba(183, 132, 255, 1)'
          ] : [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    year: {
      labels: ['Hydrating Face Cream', 'Volumizing Mascara', 'Nourishing Shampoo', 'Exfoliating Body Scrub', 'Floral Perfume'],
      datasets: [
        {
          label: 'Units Sold',
          data: [6200, 9300, 7800, 5100, 4500],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  };
  
  const customerData = {
    daily: {
      labels: ['Jane Smith', 'John Doe', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson'],
      datasets: [
        {
          label: 'Purchase Amount',
          data: [129.99, 75.98, 49.99, 89.97, 64.99],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    weekly: {
      labels: ['Jane Smith', 'John Doe', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson'],
      datasets: [
        {
          label: 'Purchase Amount',
          data: [350.50, 220.75, 180.25, 275.80, 195.40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    month: {
      labels: ['Jane Smith', 'John Doe', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson'],
      datasets: [
        {
          label: 'Purchase Amount',
          data: [1250.75, 980.50, 820.25, 1100.80, 750.40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    },
    year: {
      labels: ['Jane Smith', 'John Doe', 'Emily Johnson', 'Michael Brown', 'Sarah Wilson'],
      datasets: [
        {
          label: 'Purchase Amount',
          data: [15250.75, 12980.50, 10820.25, 13100.80, 9750.40],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  };
  
  const categoryData = {
    month: {
      labels: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools'],
      datasets: [
        {
          label: 'Sales by Category',
          data: [42000, 35000, 28000, 22000, 18000, 15000],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  };
  
  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Best Selling Products',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Customers',
      },
    },
  };
  
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Category',
      },
    },
  };
  
  // Handle report generation
  const generateReport = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle export to CSV
  const exportToCSV = () => {
    alert('Report exported to CSV');
  };
  
  // Handle export to PDF
  const exportToPDF = () => {
    alert('Report exported to PDF');
  };
  
  // Handle print report
  const printReport = () => {
    window.print();
  };
  
  return (
    <AdminLayout>
      <Head title="Reports & Statistics - Admin Dashboard" />
      
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-cinematic-100">Reports & Statistics</h1> {/* Dark text */}
        <p className="mt-1 text-sm text-gray-600 dark:text-cinematic-400"> {/* Dark text */}
          Generate and view detailed reports about your store's performance.
        </p>
      </div>
      
      {/* Report Controls */}
      <div className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden mb-6 border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300 mb-1"> {/* Dark text */}
                Report Type
              </label>
              <select
                id="report-type"
                className="form-input dark:bg-cinematic-700 dark:border-cinematic-600 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500" // Dark select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="sales">Sales Report</option>
                <option value="products">Best-Selling Products</option>
                <option value="customers">Top Customers</option>
                <option value="categories">Sales by Category</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="time-range" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300 mb-1"> {/* Dark text */}
                Time Range
              </label>
              <select
                id="time-range"
                className="form-input dark:bg-cinematic-700 dark:border-cinematic-600 dark:text-white dark:focus:ring-pink-500 dark:focus:border-pink-500" // Dark select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                className="btn btn-primary w-full dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-700 dark:focus:ring-offset-cinematic-800" // Dark button
                onClick={generateReport}
                disabled={isLoading}
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Visualization */}
      <div className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden mb-6 border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-cinematic-700 flex justify-between items-center"> {/* Dark border */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-cinematic-200"> {/* Dark text */}
            {reportType === 'sales' && 'Sales Report'}
            {reportType === 'products' && 'Best-Selling Products'}
            {reportType === 'customers' && 'Top Customers'}
            {reportType === 'categories' && 'Sales by Category'}
          </h2>
          <div className="flex space-x-2">
            {/* Add dark styles to export/print buttons */}
            <button
              type="button"
              className="btn btn-secondary btn-sm dark:bg-cinematic-600 dark:hover:bg-cinematic-500 dark:text-cinematic-200 dark:border-cinematic-500"
              onClick={exportToCSV}
            >
              Export CSV
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm dark:bg-cinematic-600 dark:hover:bg-cinematic-500 dark:text-cinematic-200 dark:border-cinematic-500"
              onClick={exportToPDF}
            >
              Export PDF
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm dark:bg-cinematic-600 dark:hover:bg-cinematic-500 dark:text-cinematic-200 dark:border-cinematic-500"
              onClick={printReport}
            >
              Print
            </button>
          </div>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-pink-600 dark:text-pink-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> {/* Dark spinner */}
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-2 text-sm text-gray-600 dark:text-cinematic-400">Generating report...</p> {/* Dark text */}
              </div>
            </div>
          ) : (
            <div>
              {/* Charts will use the updated options */}
              {reportType === 'sales' && (
                <div className="h-80">
                  <Line options={lineOptions} data={salesData[timeRange]} />
                </div>
              )}

              {reportType === 'products' && (
                <div className="h-80">
                  <Bar options={barOptions} data={productData[timeRange]} />
                </div>
              )}

              {reportType === 'customers' && (
                <div className="h-80 flex justify-center"> {/* Center pie/doughnut */}
                  <Pie options={pieOptions} data={customerData[timeRange]} />
                </div>
              )}

              {reportType === 'categories' && (
                <div className="h-80 flex justify-center"> {/* Center pie/doughnut */}
                  <Doughnut options={doughnutOptions} data={categoryData.month} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Report Data Table */}
      <div className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-cinematic-700"> {/* Dark border */}
          <h2 className="text-lg font-medium text-gray-900 dark:text-cinematic-200"> {/* Dark text */}
            Detailed Data
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700"> {/* Dark divider */}
            <thead className="bg-gray-50 dark:bg-cinematic-700"> {/* Dark thead */}
              <tr>
                {/* Add dark text color to all th elements */}
                {reportType === 'sales' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Period
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Avg. Order Value
                    </th>
                  </>
                )}

                {reportType === 'products' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Units Sold
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Total Revenue
                    </th>
                  </>
                )}

                {reportType === 'customers' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Orders Placed
                    </th>
                  </>
                )}

                {reportType === 'categories' && (
                  <>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Total Sales
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      % of Total Sales
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                      Units Sold
                    </th>
                  </>
                )}
              </tr>
            </thead>
            {/* Add dark text color and hover effect to tbody */}
            <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700">
              {/* Example Row - Apply dark styles to td elements */}
              {/* You would dynamically generate these rows based on report data */}
              <tr className="hover:bg-gray-50 dark:hover:bg-cinematic-700/50">
                {reportType === 'sales' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-200">Sample Period</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">100</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">$5,000.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">$50.00</td>
                  </>
                )}
                 {reportType === 'products' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-200">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">Sample Product</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">50</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">50</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">50</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">50</td>
                  </>
                )}
                {/* Add similar structures for other report types */}
                 {reportType === 'customers' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-200">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">Sample Customer</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">$500.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">10</td>
                  </>
                )}
                 {reportType === 'categories' && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-cinematic-200">Sample Category</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">$2,000.00</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">40%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-cinematic-400">100</td>
                  </>
                )}
              </tr>
              {/* Add more rows as needed */}
              <tr>
                 <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-cinematic-500"> {/* Dark text for empty state */}
                   No detailed data available for this selection.
                 </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ReportsDashboard;
