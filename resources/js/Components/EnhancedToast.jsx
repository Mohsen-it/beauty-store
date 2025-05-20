import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast as hotToast } from 'react-hot-toast';
import { t } from '@/utils/translate';

/**
 * Enhanced toast notification component with animations and better styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Toast message
 * @param {string} props.type - Toast type (success, error, warning, info)
 * @param {boolean} props.visible - Whether the toast is visible
 * @param {Function} props.onClose - Function to call when the toast is closed
 * @returns {JSX.Element} - Toast notification component
 */
export function EnhancedToast({ message, type = 'info', visible = true, onClose }) {
    // Icons for different toast types
    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        warning: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    // Background colors for different toast types
    const backgrounds = {
        success: 'bg-green-50 dark:bg-green-900/20 border-green-500/20 dark:border-green-500/30',
        error: 'bg-red-50 dark:bg-red-900/20 border-red-500/20 dark:border-red-500/30',
        warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500/20 dark:border-yellow-500/30',
        info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-500/20 dark:border-blue-500/30',
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-center p-4 mb-4 rounded-lg border ${backgrounds[type]} backdrop-blur-sm`}
                    role="alert"
                >
                    <div className="flex-shrink-0">{icons[type]}</div>
                    <div className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">{message}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg p-1.5 inline-flex h-8 w-8 focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Helper functions to show different types of toasts
 */
export const toast = {
    success: (message) => hotToast.success(message, {
        style: {
            background: '#10B981',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '16px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#10B981',
        },
    }),
    error: (message) => hotToast.error(message, {
        style: {
            background: '#EF4444',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '16px',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#EF4444',
        },
    }),
    warning: (message) => hotToast(message, {
        icon: '⚠️',
        style: {
            background: '#F59E0B',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '16px',
        },
    }),
    info: (message) => hotToast(message, {
        icon: 'ℹ️',
        style: {
            background: '#3B82F6',
            color: '#fff',
            borderRadius: '0.75rem',
            padding: '16px',
        },
    }),
};

export default toast;
