import React from 'react';

export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p {...props} className={`text-sm text-red-600 dark:text-red-400 transition-colors duration-300 ${className}`}>
            {message}
        </p>
    ) : null;
}
