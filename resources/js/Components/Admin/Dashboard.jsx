import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { SalesLineChart, CategorySalesChart } from '@/Components/Admin/Charts/SalesChart';
import { ProductStatusChart, OrderStatusChart } from '@/Components/Admin/Charts/StatusCharts';
import { t } from '@/utils/translate';

// Components
const Card = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')} text-${color.replace('border-', '').replace('-600', '-600')}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-pink-600">
                  {t('app.name')}
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href={route('admin.dashboard')}
                  className="border-pink-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {t('navigation.dashboard')}
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {t('navigation.products')}
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {t('navigation.orders')}
                </Link>
                <Link
                  href="#"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {t('admin.users')}
                </Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link
                href={route('home')}
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                {t('admin.view_store')}
              </Link>
              <div className="ml-3 relative">
                <Link
                  href={route('profile.edit')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('navigation.profile')}
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

const Dashboard = ({ stats, recentOrders, topProducts }) => {
  // Sample data for charts - in a real app, this would come from the backend
  const [salesData, setSalesData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    sales: [1500, 2500, 2000, 3000, 2800, 3500, 4000, 3800, 4200, 4500, 5000, 4800],
    orders: [25, 30, 28, 32, 30, 40, 45, 42, 48, 50, 55, 52]
  });

  const [categoryData, setCategoryData] = useState({
    labels: ['Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Bath & Body', 'Tools'],
    revenue: [12000, 9500, 7800, 6500, 5200, 4100]
  });

  const [productData, setProductData] = useState({
    inStock: 120,
    lowStock: 35,
    outOfStock: 15
  });

  const [orderData, setOrderData] = useState({
    pending: 25,
    processing: 18,
    shipped: 32,
    delivered: 120,
    cancelled: 8
  });

  const [timeRange, setTimeRange] = useState('monthly');

  // Function to change time range for sales chart
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);

    // Sample data for different time ranges
    if (range === 'weekly') {
      setSalesData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        sales: [1200, 1500, 1800, 1600],
        orders: [18, 22, 25, 20]
      });
    } else if (range === 'daily') {
      setSalesData({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        sales: [500, 600, 550, 700, 800, 950, 700],
        orders: [8, 10, 9, 12, 15, 18, 14]
      });
    } else {
      // Monthly
      setSalesData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        sales: [1500, 2500, 2000, 3000, 2800, 3500, 4000, 3800, 4200, 4500, 5000, 4800],
        orders: [25, 30, 28, 32, 30, 40, 45, 42, 48, 50, 55, 52]
      });
    }
  };

  return (
    <AdminLayout>
      <Head title={`${t('navigation.admin')} - ${t('app.name')}`} />

      <div className="px-4 sm:px-0">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold text-gray-900"
        >
          {t('navigation.dashboard')}
        </motion.h1>
        <p className="mt-2 text-sm text-gray-700">
          {t('admin.dashboard_welcome')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title={t('admin.total_products')}
          value={stats?.products || 170}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="border-blue-600"
        />

        <Card
          title={t('admin.total_orders')}
          value={stats?.orders || 203}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          color="border-green-600"
        />

        <Card
          title={t('admin.total_users')}
          value={stats?.users || 542}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="border-purple-600"
        />

        <Card
          title={t('navigation.categories')}
          value={stats?.categories || 8}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
          color="border-pink-600"
        />
      </div>

      {/* Sales Chart */}
      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">{t('admin.sales_overview')}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleTimeRangeChange('daily')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'daily' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t('admin.daily')}
            </button>
            <button
              onClick={() => handleTimeRangeChange('weekly')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'weekly' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t('admin.weekly')}
            </button>
            <button
              onClick={() => handleTimeRangeChange('monthly')}
              className={`px-3 py-1 text-sm rounded-md ${timeRange === 'monthly' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {t('admin.monthly')}
            </button>
          </div>
        </div>
        <div className="p-6">
          <SalesLineChart salesData={salesData} period={timeRange} />
        </div>
      </div>

      {/* Category Sales & Status Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('admin.sales_by_category')}</h2>
          </div>
          <div className="p-6">
            <CategorySalesChart categoryData={categoryData} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('admin.product_status')}</h2>
            </div>
            <div className="p-6">
              <ProductStatusChart productData={productData} />
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">{t('admin.order_status')}</h2>
            </div>
            <div className="p-6">
              <OrderStatusChart orderData={orderData} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders & Top Products */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('admin.recent_orders')}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{order.user?.name || 'Customer'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${order.total || '0.00'}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #{1000 + index}</p>
                      <p className="text-sm text-gray-500">Customer Name</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">${(Math.random() * 200 + 50).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(Date.now() - index * 86400000).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <Link href="#" className="text-sm font-medium text-pink-600 hover:text-pink-800">
              {t('admin.view_all_orders')} →
            </Link>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">{t('admin.top_products')}</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                      <img
                        src={
                          product.image
                            ? `/storage/${product.image}?v=${new Date().getTime()}`
                            : product.images && product.images[0]?.url
                              ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                              : `/assets/default-product.png?v=${new Date().getTime()}`
                        }
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{product.order_items_count || 0} sold</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              Array(5).fill(0).map((_, index) => (
                <div key={index} className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-200">
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">Product Name {index + 1}</p>
                      <p className="text-sm text-gray-500">${(Math.random() * 100 + 20).toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{Math.floor(Math.random() * 50 + 10)} sold</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50">
            <Link href="#" className="text-sm font-medium text-pink-600 hover:text-pink-800">
              {t('admin.view_all_products')} →
            </Link>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
