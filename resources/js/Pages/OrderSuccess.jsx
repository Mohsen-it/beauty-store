import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

import CinematicLayout from '@/Layouts/CinematicLayout';

const OrderSuccess = ({ order, paymentMethod }) => {
  // If paymentMethod is not explicitly passed, use the one from the order
  const actualPaymentMethod = paymentMethod || order.payment_method;
  return (
    <CinematicLayout>
    <Head title="Order Confirmation - Cosmetics Store" />

    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft p-8 border border-cinematic-200 dark:border-cinematic-700"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h1 className="text-3xl font-bold text-cinematic-900 dark:text-white mb-2">Thank You for Your Order!</h1>
          <p className="text-cinematic-600 dark:text-cinematic-400">Your order has been received and is being processed.</p>

          {/* Show different messages based on payment method */}
          {actualPaymentMethod === 'cash_on_delivery' && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <p className="text-blue-700 dark:text-blue-300">
                You have chosen to pay upon delivery. Our delivery team will contact you shortly to confirm your order.
              </p>
            </div>
          )}

          {actualPaymentMethod === 'credit_card' && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-md">
              <p className="text-green-700 dark:text-green-300">
                Your payment has been successfully processed. We will ship your order as soon as possible.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-b border-cinematic-200 dark:border-cinematic-700 py-6 mb-6">
          <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-cinematic-600 dark:text-cinematic-400 mb-1">Order Number</p>
              <p className="font-medium text-cinematic-900 dark:text-white">{order.order_number}</p>
            </div>
            <div>
              <p className="text-sm text-cinematic-600 dark:text-cinematic-400 mb-1">Date</p>
              <p className="font-medium text-cinematic-900 dark:text-white">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-cinematic-600 dark:text-cinematic-400 mb-1">Total</p>
              <p className="font-medium text-cinematic-900 dark:text-white">${order.total}</p>
            </div>
            <div>
              <p className="text-sm text-cinematic-600 dark:text-cinematic-400 mb-1">Payment Method</p>
              <p className="font-medium text-cinematic-900 dark:text-white">
                {order.payment_method === 'credit_card' ? 'Credit Card' :
                 order.payment_method === 'paypal' ? 'PayPal' : 'Cash on Delivery'}
              </p>
            </div>
            <div>
              <p className="text-sm text-cinematic-600 dark:text-cinematic-400 mb-1">Payment Status</p>
              <p className={`font-medium ${order.payment_status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {order.payment_status === 'completed' ? 'Paid' :
                 order.payment_method === 'cash_on_delivery' ? 'Pay on Delivery' : 'Pending'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4">Shipping Information</h2>
          <div className="text-cinematic-600 dark:text-cinematic-400">
            <p>{order.first_name} {order.last_name}</p>
            <p>{order.address}</p>
            <p>{order.city}, {order.state} {order.postal_code}</p>
            <p>{order.country}</p>
            <p className="mt-2">Email: {order.email}</p>
            {order.phone && <p>Phone: {order.phone}</p>}

            {/* Show location information if available */}
            {(order.latitude && order.longitude) && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                  Precise Location Available
                </p>
                {order.location_details && (
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    {order.location_details}
                  </p>
                )}
                <div className="mt-2">
                  <a
                    href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    View on Google Maps
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:space-x-4">
          <Link
            href={route('home')}
            className="w-full sm:w-auto bg-pink-600 dark:bg-pink-700 text-white py-3 px-6 rounded-md hover:bg-pink-700 dark:hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 text-center font-medium mb-4 sm:mb-0 transition-colors duration-300"
          >
            Continue Shopping
          </Link>
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto bg-white dark:bg-cinematic-800 border border-cinematic-300 dark:border-cinematic-600 text-cinematic-700 dark:text-cinematic-300 py-3 px-6 rounded-md hover:bg-cinematic-50 dark:hover:bg-cinematic-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 text-center font-medium transition-colors duration-300"
          >
            Print Receipt
          </button>
        </div>
      </motion.div>
    </div>
  </CinematicLayout>
  );
};

export default OrderSuccess;
