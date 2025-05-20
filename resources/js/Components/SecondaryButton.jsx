import React from 'react';

export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center justify-center px-4 py-2 bg-white border border-pink-600 rounded-md font-medium text-pink-600 text-sm tracking-wide hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors duration-300 shadow-soft
                dark:bg-gray-800 dark:text-pink-400 dark:border-pink-700 dark:hover:bg-gray-700 dark:focus:ring-pink-400 dark:ring-offset-gray-900
                ${disabled && 'opacity-50 cursor-not-allowed'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
