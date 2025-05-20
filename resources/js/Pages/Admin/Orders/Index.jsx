import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';

const OrdersIndex = ({ orders, filters, paymentMethods, paymentStatuses }) => {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(filters.payment_method || '');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState(filters.payment_status || '');
  const [dateRange, setDateRange] = useState({
    from: filters.date_from || '',
    to: filters.date_to || '',
  });
  const [currentPage, setCurrentPage] = useState(filters.page || 1);
  const [initialLoad, setInitialLoad] = useState(true);

  const { get, processing } = useForm();

  // Apply filters
  const applyFilters = () => {
    get(route('admin.orders.index', {
      search: searchTerm,
      status: selectedStatus,
      payment_method: selectedPaymentMethod,
      payment_status: selectedPaymentStatus,
      date_from: dateRange.from,
      date_to: dateRange.to,
      page: currentPage,
    }));
  };

  // Apply filters when filter values change, but not on initial load
  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }

    const timer = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, selectedPaymentMethod, selectedPaymentStatus, dateRange, currentPage]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Get payment status badge color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Format payment method for display
  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Credit Card';
      case 'cash_on_delivery':
        return 'Cash on Delivery (COD)';
      default:
        return method;
    }
  };

  return (
    <AdminLayout title="Orders Management">
      <Head title="Orders Management" />

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Manage Orders</h2>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Search</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order #, Customer name, email..."
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Order Status</label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
            <select
              id="payment_method"
              value={selectedPaymentMethod}
              onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
            >
              <option value="">All Payment Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="cash_on_delivery">Cash on Delivery (COD)</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Status</label>
            <select
              id="payment_status"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
            >
              <option value="">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="date_from" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date From</label>
            <input
              type="date"
              id="date_from"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="date_to" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date To</label>
            <input
              type="date"
              id="date_to"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Order #
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Payment
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {orders.data.length > 0 ? (
              orders.data.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">#{order.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user && order.user.name ? order.user.name : 'Unknown'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.user && order.user.email ? order.user.email : 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">{formatDate(order.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">${order.total}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{order.items_count} items</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {order.payment_method === 'cash_on_delivery' ? (
                          <span className="inline-flex items-center">
                            <span className="mr-1 h-2 w-2 rounded-full bg-amber-500"></span>
                            COD
                          </span>
                        ) : (
                          <span>Credit Card</span>
                        )}
                      </div>
                      <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={route('admin.orders.show', order.id)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        View
                      </Link>
                      <Link
                        href={route('admin.orders.invoice', order.id)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Invoice
                      </Link>
                      <Link
                        href={route('admin.orders.packing-slip', order.id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Packing Slip
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {orders.data.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{orders.from}</span> to <span className="font-medium">{orders.to}</span> of <span className="font-medium">{orders.total}</span> orders
          </div>
          <div className="flex space-x-2">
            {orders.links.map((link, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded ${
                  link.active
                    ? 'bg-pink-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                } ${link.url ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!link.url}
                onClick={() => link.url && setCurrentPage(link.label)}
              >
                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
              </button>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersIndex;
