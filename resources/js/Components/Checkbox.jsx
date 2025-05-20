import React from 'react';

export default function Checkbox({ className = '', ...props }) {
    return (
        <div className="relative inline-block">
            <input
                {...props}
                type="checkbox"
                className={
                    'w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 ' +
                    'text-pink-600 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500 ' +
                    'dark:focus:ring-pink-400 dark:bg-gray-800 transition-colors duration-300 ' +
                    className
                }
            />
            <div className="absolute inset-0 rounded-md pointer-events-none bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-focus-within:from-pink-400/10 group-focus-within:to-purple-500/10 transition-colors duration-300"></div>
        </div>
    );
}
