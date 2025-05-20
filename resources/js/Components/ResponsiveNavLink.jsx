import React from 'react';
import { Link } from '@inertiajs/react';

const ResponsiveNavLink = ({ active = false, className = '', children, ...props }) => {
    return (
        <Link
            {...props}
            className={`block w-full pl-2 sm:pl-3 pr-3 sm:pr-4 py-2 sm:py-2.5 border-l-4 rounded-r-lg ${
                active
                    ? 'border-pink-500 text-pink-700 bg-pink-50/80 focus:text-pink-800 focus:bg-pink-100 focus:border-pink-700 dark:border-pink-500 dark:text-pink-300 dark:bg-gray-800/80 dark:focus:text-pink-200 dark:focus:bg-gray-700 dark:focus:border-pink-400'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/80 dark:hover:border-gray-600 dark:focus:text-white dark:focus:bg-gray-800 dark:focus:border-gray-600'
            } text-xs sm:text-sm md:text-base font-medium focus:outline-none transition duration-200 ease-in-out ${className}`}
        >
            <div className="flex items-center">
                {children}
            </div>
        </Link>
    );
};

export default ResponsiveNavLink;
