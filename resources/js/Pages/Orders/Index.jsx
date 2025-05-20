import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { usePage } from '@inertiajs/react';

export default function OrderIndex({ auth, orders }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'PPP', { locale: enUS });
    };
    const currency = usePage().props.currencySymbol;

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Pending';
            case 'processing':
                return 'Processing';
            case 'shipped':
                return 'Shipped';
            case 'delivered':
                return 'Delivered';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    return (
        <CinematicLayout
            user={auth.user}
            header={
                <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-semibold text-xl text-cinematic-900 dark:text-white leading-tight"
                >
                    My Orders
                </motion.h2>
            }
        >
            <Head title="My Orders" />

            <div className="py-8 sm:py-10 md:py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white dark:bg-cinematic-800 overflow-hidden shadow-md dark:shadow-soft rounded-lg border border-cinematic-200 dark:border-cinematic-700"
                    >
                        <div className="p-4 sm:p-6 text-cinematic-900 dark:text-white">
                            {orders && orders.length > 0 ? (
                                <div className="overflow-x-auto -mx-4 sm:-mx-6">
                                    <table className="min-w-full divide-y divide-cinematic-200 dark:divide-cinematic-700">
                                        <thead className="bg-pink-50 dark:bg-cinematic-900">
                                            <tr>
                                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                    Order Number
                                                </th>
                                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider hidden sm:table-cell">
                                                    Date
                                                </th>
                                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-pink-700 dark:text-pink-400 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-cinematic-800 divide-y divide-cinematic-200 dark:divide-cinematic-700">
                                            {orders.map((order) => (
                                                <motion.tr
                                                    key={order.id}
                                                    className="hover:bg-pink-50 dark:hover:bg-cinematic-700/50 transition-colors duration-150"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium text-cinematic-900 dark:text-white">
                                                        <div>
                                                            {order.order_number}
                                                        </div>
                                                        <div className="text-xs text-cinematic-500 dark:text-cinematic-400 mt-1 sm:hidden">
                                                            {formatDate(order.created_at)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-cinematic-600 dark:text-cinematic-300 hidden sm:table-cell">
                                                        {formatDate(order.created_at)}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-cinematic-600 dark:text-cinematic-300">
                                                        {order.total} {currency}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm font-medium">
                                                        <Link
                                                            href={route('orders.show', order.id)}
                                                            className="text-pink-600 hover:text-pink-900 dark:text-pink-400 dark:hover:text-pink-300 transition-colors duration-150 inline-flex items-center"
                                                        >
                                                            <span>View</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center py-10 sm:py-12 px-4"
                                >
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <svg
                                            className="mx-auto h-16 w-16 text-cinematic-400 dark:text-cinematic-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                            />
                                        </svg>
                                    </motion.div>
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-4 text-base sm:text-lg font-medium text-cinematic-900 dark:text-white"
                                    >
                                        No Orders
                                    </motion.h3>
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="mt-2 text-sm text-cinematic-600 dark:text-cinematic-400 max-w-md mx-auto"
                                    >
                                        You haven't placed any orders yet. Browse our products and make your first purchase.
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="mt-6 sm:mt-8"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            href={route('products.index')}
                                            className="inline-flex items-center px-5 py-3 border border-transparent shadow-md dark:shadow-soft text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-500 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-cinematic-800 transition-all duration-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Browse Products
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </CinematicLayout>
    );
}
