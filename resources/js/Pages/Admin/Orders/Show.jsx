import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const OrderDetails = ({ order, statuses, paymentStatuses }) => {
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [showPaymentStatusForm, setShowPaymentStatusForm] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    status: order.status,
    notify_customer: true,
  });

  const paymentForm = useForm({
    payment_status: order.payment_status,
    notify_customer: true,
    comment: '',
  });

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    post(route('admin.orders.update-status', order.id), {
      onSuccess: () => {
        setShowStatusForm(false);
        toast.success('Order status updated successfully');
      },
      onError: () => toast.error('Failed to update order status'),
    });
  };

  const handlePaymentStatusUpdate = (e) => {
    e.preventDefault();
    paymentForm.post(route('admin.orders.update-payment-status', order.id), {
      onSuccess: () => {
        setShowPaymentStatusForm(false);
        toast.success('Payment status updated successfully');
      },
      onError: () => toast.error('Failed to update payment status'),
    });
  };

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

  // Get status badge color with dark mode support
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

  // Get payment status badge color with dark mode support
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
    <AdminLayout title={`Order #${order.id}`}>
      <Head title={`Order #${order.id}`} />

      {/* Order Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4"> {/* Adjusted layout */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-cinematic-200">Order #{order.id}</h2> {/* Dark text */}
          <p className="text-sm text-gray-500 dark:text-cinematic-400">Placed on {formatDate(order.created_at)}</p> {/* Dark text */}
        </div>
        <div className="flex space-x-2 flex-shrink-0"> {/* Prevent button wrap */}
          <a
            href={route('admin.orders.invoice', order.id)}
            target="_blank"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 dark:ring-offset-cinematic-800" // Dark mode button
          >
            Generate Invoice
          </a>
          <a
            href={route('admin.orders.packing-slip', order.id)}
            target="_blank"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:ring-offset-cinematic-800" // Dark mode button
          >
            Packing Slip
          </a>
        </div>
      </div>

      {/* Order Status */}
      <div className="mb-6 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200">Order Status</h3> {/* Dark text */}
            <div className="mt-2">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowStatusForm(!showStatusForm)}
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 dark:ring-offset-cinematic-800" // Dark mode button
          >
            Update Status
          </button>
        </div>

        {/* Status Update Form */}
        {showStatusForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-4 border-t border-cinematic-200 dark:border-cinematic-700 pt-4" // Dark border
          >
            <form onSubmit={handleStatusUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300"> {/* Dark text */}
                    New Status
                  </label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500" // Dark form styles
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    id="notify_customer"
                    type="checkbox"
                    checked={data.notify_customer}
                    onChange={(e) => setData('notify_customer', e.target.checked)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 rounded" // Dark checkbox
                  />
                  <label htmlFor="notify_customer" className="ml-2 block text-sm text-gray-700 dark:text-cinematic-300"> {/* Dark text */}
                    Notify customer via email
                  </label>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowStatusForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 dark:border-cinematic-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-cinematic-300 bg-white dark:bg-cinematic-700 hover:bg-gray-50 dark:hover:bg-cinematic-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:ring-offset-cinematic-800" // Dark cancel button
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:bg-pink-700 dark:hover:bg-pink-600 dark:ring-offset-cinematic-800" // Dark submit button
                >
                  {processing ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Payment Information */}
      <div className="mb-6 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200">Payment Information</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-cinematic-400">Payment Method:</p>
                <p className="text-sm font-medium text-gray-900 dark:text-cinematic-300">
                  {getPaymentMethodLabel(order.payment_method)}
                  {order.payment_method === 'cash_on_delivery' && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                      COD
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-700 dark:text-cinematic-400">Payment Status:</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          {order.payment_method === 'cash_on_delivery' && (
            <button
              type="button"
              onClick={() => setShowPaymentStatusForm(!showPaymentStatusForm)}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600 dark:ring-offset-cinematic-800"
            >
              Update Payment Status
            </button>
          )}
        </div>

        {/* Payment Status Update Form - Only for Cash on Delivery */}
        {showPaymentStatusForm && order.payment_method === 'cash_on_delivery' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mt-4 border-t border-cinematic-200 dark:border-cinematic-700 pt-4"
          >
            <form onSubmit={handlePaymentStatusUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="payment_status" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                    New Payment Status
                  </label>
                  <select
                    id="payment_status"
                    value={paymentForm.data.payment_status}
                    onChange={(e) => paymentForm.setData('payment_status', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  >
                    {paymentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    id="payment_notify_customer"
                    type="checkbox"
                    checked={paymentForm.data.notify_customer}
                    onChange={(e) => paymentForm.setData('notify_customer', e.target.checked)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 rounded"
                  />
                  <label htmlFor="payment_notify_customer" className="ml-2 block text-sm text-gray-700 dark:text-cinematic-300">
                    Notify customer via email
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="payment_comment" className="block text-sm font-medium text-gray-700 dark:text-cinematic-300">
                    Comment (optional)
                  </label>
                  <textarea
                    id="payment_comment"
                    value={paymentForm.data.comment}
                    onChange={(e) => paymentForm.setData('comment', e.target.value)}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-cinematic-600 dark:bg-cinematic-700 dark:text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    placeholder="Add a comment about this payment status update"
                  ></textarea>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentStatusForm(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 dark:border-cinematic-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-cinematic-300 bg-white dark:bg-cinematic-700 hover:bg-gray-50 dark:hover:bg-cinematic-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:ring-offset-cinematic-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentForm.processing}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600 dark:ring-offset-cinematic-800"
                >
                  {paymentForm.processing ? 'Updating...' : 'Update Payment Status'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Customer Information */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Customer Information</h3> {/* Dark text */}
          <div className="space-y-2">
            <p className="text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
              <span className="font-medium">Name:</span> {order.first_name} {order.last_name}
            </p>
            <p className="text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
              <span className="font-medium">Email:</span> {order.email || 'N/A'}
            </p>
            <p className="text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
              <span className="font-medium">Phone:</span> {order.phone || 'N/A'}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Shipping Address</h3> {/* Dark text */}
          <div className="space-y-2">
            <p className="text-sm text-gray-900 dark:text-cinematic-300">{order.first_name} {order.last_name}</p> {/* Dark text */}
            <p className="text-sm text-gray-900 dark:text-cinematic-300">{order.address}</p> {/* Dark text */}
            <p className="text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
              {order.city}, {order.state || 'N/A'} {order.postal_code}
            </p>
            <p className="text-sm text-gray-900 dark:text-cinematic-300">{order.country}</p> {/* Dark text */}

            {/* Show geolocation information if available */}
            {(order.latitude && order.longitude) && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-cinematic-700">
                <p className="text-sm text-gray-900 dark:text-cinematic-300">
                  <span className="font-medium">Geolocation:</span> Available
                </p>
                <p className="text-xs text-gray-500 dark:text-cinematic-400">
                  Lat: {order.latitude}, Long: {order.longitude}
                </p>
                {order.location_details && (
                  <p className="text-xs text-gray-500 dark:text-cinematic-400 mt-1">
                    {order.location_details}
                  </p>
                )}
                <a
                  href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mb-6 bg-white dark:bg-cinematic-800 rounded-lg shadow dark:shadow-soft overflow-hidden border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-cinematic-700"> {/* Dark border */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200">Order Items</h3> {/* Dark text */}
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-cinematic-700">{/* Dark divider */}
          <thead className="bg-gray-50 dark:bg-cinematic-700">{/* Dark thead */}
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-cinematic-400 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-gray-200 dark:divide-cinematic-700">{/* Dark tbody, divider */}
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-md object-cover bg-gray-200 dark:bg-cinematic-700" // Dark image bg
                        src={
                          item.product.image
                            ? `/storage/${item.product.image.replace(/^\/storage\//, '')}?v=${new Date().getTime()}`
                            : item.product.images && item.product.images[0]?.url
                              ? (item.product.images[0].image_url ? `${item.product.images[0].image_url}?v=${new Date().getTime()}` : `/storage/${item.product.images[0].url}?v=${new Date().getTime()}`)
                              : `/assets/default-product.png?v=${new Date().getTime()}`
                        }
                        alt={item.product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-cinematic-200">{item.product.name}</div> {/* Dark text */}
                      <div className="text-sm text-gray-500 dark:text-cinematic-400">{item.product.sku || 'No SKU'}</div> {/* Dark text */}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-cinematic-300">${item.price}</div> {/* Dark text */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-cinematic-300">{item.quantity}</div> {/* Dark text */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-cinematic-300">${(item.price * item.quantity).toFixed(2)}</div> {/* Dark text */}
                </td>
              </tr>
            ))}
          </tbody><tfoot className="bg-gray-50 dark:bg-cinematic-700">{/* Ensure no whitespace between tbody and tfoot */}
            <tr>
              <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                Subtotal
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                ${order.subtotal}
              </td>
            </tr>
            <tr>
              <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                Shipping
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                ${order.shipping}
              </td>
            </tr>
            {order.discount > 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                  Discount
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium text-pink-600 dark:text-pink-400">
                  -${order.discount}
                </td>
              </tr>
            )}
            <tr>
              <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                Tax
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-cinematic-200">
                ${order.tax}
              </td>
            </tr>
            <tr className="bg-gray-100 dark:bg-cinematic-900">
              <td colSpan="3" className="px-6 py-4 text-right text-base font-bold text-gray-900 dark:text-white">
                Total
              </td>
              <td className="px-6 py-4 text-right text-base font-bold text-gray-900 dark:text-white">
                ${order.total}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div className="mb-6 bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
          <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-2">Order Notes</h3> {/* Dark text */}
          <p className="text-sm text-gray-700 dark:text-cinematic-300">{order.notes}</p> {/* Dark text */}
        </div>
      )}

      {/* Order Timeline */}
      <div className="bg-white dark:bg-cinematic-800 p-4 rounded-lg shadow dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"> {/* Dark bg, shadow, border */}
        <h3 className="text-lg font-medium text-gray-900 dark:text-cinematic-200 mb-4">Order Timeline</h3> {/* Dark text */}
        <div className="flow-root">
          <ul className="-mb-8">
            {order.history.map((event, eventIdx) => (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== order.history.length - 1 ? (
                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-cinematic-700" aria-hidden="true"></span> /* Dark line */
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-cinematic-800 ${getStatusColor(event.status)}`}> {/* Dark ring */}
                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L9 11.586 7.707 10.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-cinematic-300"> {/* Dark text */}
                          Status changed to <span className="font-medium">{event.status}</span>
                          {event.comment && <span> - {event.comment}</span>}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-cinematic-400"> {/* Dark text */}
                        {formatDate(event.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;