import React from 'react';

export default function InputLabel({ value, className = '', children, ...props }) {
    return (
        <label
            {...props}
            className={`block font-medium text-sm mb-2 text-gray-700 dark:text-gray-300
                        transition-colors duration-300 ${className}`}
        >
            {value ? value : children}
        </label>
    );
}
