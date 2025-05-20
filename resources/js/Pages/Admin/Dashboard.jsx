import React, { useState, useEffect, useRef } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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
import { motion } from "framer-motion";

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

const Card = ({ title, value, icon, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white dark:bg-cinematic-800 overflow-hidden shadow dark:shadow-soft rounded-lg border border-cinematic-200 dark:border-cinematic-700 ${color}`}
  >
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-cinematic-100 dark:bg-cinematic-700 rounded-md p-3">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-cinematic-500 dark:text-cinematic-400 truncate">
              {title}
            </dt>
            <dd>
              <div className="text-lg font-medium text-cinematic-900 dark:text-white">
                {value}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </motion.div>
);

const Dashboard = ({
  stats,
  recentOrders,
  topProducts,
  salesData,
  ordersByStatus,
}) => {
  const [timeFilter, setTimeFilter] = useState("week");
  const [filteredSalesData, setFilteredSalesData] = useState(salesData);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );
  const isInitialMount = useRef(true); // الخطاف لتتبع التحميل الأولي

  // هذا الـ useEffect سيقوم بتحديث filteredSalesData عندما تتغير خاصية salesData القادمة من الخادم
  useEffect(() => {
    setFilteredSalesData(salesData);
  }, [salesData]);

  // هذا الـ useEffect سيقوم بجلب البيانات الجديدة عند تغيير timeFilter
  useEffect(() => {
    if (isInitialMount.current) {
      // في التحميل الأول، لا تقم بإرسال الطلب لأن البيانات الأولية
      // يجب أن تكون متوافقة مع timeFilter الافتراضي ('week')
      isInitialMount.current = false;
    } else {
      // فقط قم بإرسال الطلب إذا لم يكن التحميل الأولي
      router.get(
        route("admin.dashboard", { period: timeFilter }),
        {},
        {
          preserveState: true,
          preserveScroll: true,
          replace: true,
          // يمكنك إضافة معالجات onError أو onFinish هنا للمساعدة في التصحيح إذا لزم الأمر
          // onError: (errors) => console.error('Inertia request failed:', errors),
          // onFinish: () => console.log('Inertia request finished for period:', timeFilter),
        }
      );
    }
  }, [timeFilter]); // يتم تشغيل هذا الـ hook عند تغيير timeFilter

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const salesChartData = {
    labels: filteredSalesData.labels,
    datasets: [
      {
        label: "Sales",
        data: filteredSalesData.values,
        backgroundColor: "rgba(236, 72, 153, 0.2)",
        borderColor: "rgba(236, 72, 153, 1)",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: isDarkMode
          ? "rgba(236, 72, 153, 1)"
          : "rgba(236, 72, 153, 1)",
        pointBorderColor: isDarkMode ? "#1f2937" : "#fff", // Adjust point border for dark mode
      },
    ],
  };

  const orderStatusChartData = {
    labels: Object.keys(ordersByStatus),
    datasets: [
      {
        label: "Orders by Status",
        data: Object.values(ordersByStatus),
        backgroundColor: [
          "rgba(52, 211, 153, 0.8)", // Emerald
          "rgba(59, 130, 246, 0.8)", // Blue
          "rgba(236, 72, 153, 0.8)", // Pink
          "rgba(251, 191, 36, 0.8)", // Amber
          "rgba(239, 68, 68, 0.8)", // Red
        ],
        borderColor: isDarkMode ? "#374151" : "#fff", // Add border for better visibility in dark mode
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize vertically
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDarkMode ? "#e5e7eb" : "#374151", // Use Tailwind gray colors
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(55, 65, 81, 0.9)"
          : "rgba(31, 41, 55, 0.9)", // Darker tooltip
        titleColor: isDarkMode ? "#f9fafb" : "#f9fafb",
        bodyColor: isDarkMode ? "#d1d5db" : "#d1d5db",
        borderColor: isDarkMode ? "#4b5563" : "#6b7280",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: isDarkMode ? "#9ca3af" : "#6b7280", // Lighter ticks for dark
          font: {
            size: 10,
          },
        },
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.5)"
            : "rgba(229, 231, 235, 0.8)", // Darker grid lines
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: isDarkMode ? "#9ca3af" : "#6b7280", // Lighter ticks for dark
          font: {
            size: 10,
          },
        },
        grid: {
          color: isDarkMode
            ? "rgba(75, 85, 99, 0.5)"
            : "rgba(229, 231, 235, 0.8)", // Darker grid lines
          drawBorder: false,
        },
      },
    },
  };

  return (
    <AdminLayout title="Dashboard">
      <Head title="Admin Dashboard" />

      <div className="mb-6">
        <div className="flex space-x-4 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
          <button
            onClick={() => setTimeFilter("day")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeFilter === "day" ? "bg-primary-600 dark:bg-primary-700 text-white" : "bg-cinematic-100 dark:bg-cinematic-700 text-cinematic-700 dark:text-cinematic-300 hover:bg-cinematic-200 dark:hover:bg-cinematic-600"} transition-colors duration-300`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeFilter("week")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeFilter === "week" ? "bg-primary-600 dark:bg-primary-700 text-white" : "bg-cinematic-100 dark:bg-cinematic-700 text-cinematic-700 dark:text-cinematic-300 hover:bg-cinematic-200 dark:hover:bg-cinematic-600"} transition-colors duration-300`}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeFilter("month")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeFilter === "month" ? "bg-primary-600 dark:bg-primary-700 text-white" : "bg-cinematic-100 dark:bg-cinematic-700 text-cinematic-700 dark:text-cinematic-300 hover:bg-cinematic-200 dark:hover:bg-cinematic-600"} transition-colors duration-300`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeFilter("year")}
            className={`px-4 py-2 rounded-md text-sm font-medium ${timeFilter === "year" ? "bg-primary-600 dark:bg-primary-700 text-white" : "bg-cinematic-100 dark:bg-cinematic-700 text-cinematic-700 dark:text-cinematic-300 hover:bg-cinematic-200 dark:hover:bg-cinematic-600"} transition-colors duration-300`}
          >
            This Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Products"
          value={stats.products}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          }
          color="border-primary-600 dark:border-primary-500"
        />

        <Card
          title="Total Orders"
          value={stats.orders}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          }
          color="border-blue-600 dark:border-blue-500"
        />

        <Card
          title="Total Revenue"
          value={`$${stats.revenue}`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="border-green-600 dark:border-green-500"
        />

        <Card
          title="Total Users"
          value={stats.users}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
          color="border-purple-600 dark:border-purple-500"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-cinematic-800 p-6 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"
        >
          <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">
            Sales Overview
          </h2>
          <div className="h-64">
            {" "}
            {/* Set a fixed height for the chart container */}
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-cinematic-800 p-6 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"
        >
          <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">
            Orders by Status
          </h2>
          <div className="h-64">
            {" "}
            {/* Set a fixed height for the chart container */}
            <Bar data={orderStatusChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden border border-cinematic-200 dark:border-cinematic-700"
        >
          <div className="px-6 py-4 border-b border-cinematic-200 dark:border-cinematic-700">
            <h2 className="text-lg font-medium text-cinematic-900 dark:text-white">
              Recent Orders
            </h2>
          </div>
          <div className="divide-y divide-cinematic-200 dark:divide-cinematic-700">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-6 py-4 hover:bg-cinematic-50 dark:hover:bg-cinematic-700/50 transition-colors duration-150"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cinematic-900 dark:text-white">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-cinematic-500 dark:text-cinematic-400">
                        {order.user && order.user.name
                          ? order.user.name
                          : "Unknown User"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-cinematic-900 dark:text-white">
                        ${order.total}
                      </p>
                      <p className="text-xs text-cinematic-500 dark:text-cinematic-400">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleDateString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-cinematic-500 dark:text-cinematic-400">
                No recent orders
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-cinematic-50 dark:bg-cinematic-900 border-t border-cinematic-200 dark:border-cinematic-700">
            <a
              href={route("admin.orders.index")}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              View all orders →
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-cinematic-800 shadow-md dark:shadow-soft rounded-lg overflow-hidden border border-cinematic-200 dark:border-cinematic-700"
        >
          <div className="px-6 py-4 border-b border-cinematic-200 dark:border-cinematic-700">
            <h2 className="text-lg font-medium text-cinematic-900 dark:text-white">
              Top Products
            </h2>
          </div>
          <div className="divide-y divide-cinematic-200 dark:divide-cinematic-700">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div
                  key={product.id}
                  className="px-6 py-4 hover:bg-cinematic-50 dark:hover:bg-cinematic-700/50 transition-colors duration-150"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-cinematic-100 dark:bg-cinematic-700">
                      <img
                        src={
                          product.image
                            ? `/storage/${product.image}?v=${new Date().getTime()}`
                            : product.images && product.images[0]?.url
                              ? (product.images[0].image_url ? `${product.images[0].image_url}?v=${new Date().getTime()}` : `/storage/${product.images[0].url}?v=${new Date().getTime()}`)
                              : `/assets/default-product.png?v=${new Date().getTime()}`
                        }
                        alt={product.name || "Product"}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-cinematic-900 dark:text-white">
                        {product.name || "Unnamed Product"}
                      </p>
                      <p className="text-sm text-cinematic-500 dark:text-cinematic-400">
                        {product.category
                          ? product.category.name
                          : "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-cinematic-900 dark:text-white">
                        ${product.price}
                      </p>
                      <p className="text-xs text-cinematic-500 dark:text-cinematic-400">
                        {product.sales_count || 0} sold
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-4 text-center text-cinematic-500 dark:text-cinematic-400">
                No top products data
              </div>
            )}
          </div>
          <div className="px-6 py-4 bg-cinematic-50 dark:bg-cinematic-900 border-t border-cinematic-200 dark:border-cinematic-700">
            <a
              href={route("admin.products.index")}
              className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
            >
              View all products →
            </a>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
