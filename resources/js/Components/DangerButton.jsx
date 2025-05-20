import React from 'react';

export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-medium text-white text-sm tracking-wide hover:bg-red-700 focus:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-300 shadow-soft
                dark:bg-red-700 dark:hover:bg-red-600 dark:focus:bg-red-600 dark:active:bg-red-700 dark:focus:ring-red-400 dark:ring-offset-gray-900
                ${disabled && 'opacity-50 cursor-not-allowed'} ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
