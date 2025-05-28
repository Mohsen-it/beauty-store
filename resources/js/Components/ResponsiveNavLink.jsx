import React from 'react';
import { Link } from '@inertiajs/react';

const ResponsiveNavLink = ({ active = false, className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={`w-full pl-3 sm:pl-4 pr-4 sm:pr-5 py-3 sm:py-4 border-l-4 rounded-r-xl min-h-[44px] flex items-center ${
                active
                    ? 'border-pink-500 text-pink-700 bg-pink-50/90 focus:text-pink-800 focus:bg-pink-100 focus:border-pink-700 dark:border-pink-500 dark:text-pink-300 dark:bg-gray-800/90 dark:focus:text-pink-200 dark:focus:bg-gray-700 dark:focus:border-pink-400'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/90 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/90 dark:hover:border-gray-600 dark:focus:text-white dark:focus:bg-gray-800 dark:focus:border-gray-600'
            } text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-200 ease-in-out ${className}`}
        >
            <span className="flex items-center w-full">
                {children}
            </span>
        </Link>
    );
};

export default ResponsiveNavLink;
