import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { t } from '@/utils/translate';

/**
 * Mobile filter component that expands when clicked
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Filter content
 * @param {string} props.title - Filter title
 * @param {boolean} props.initiallyOpen - Whether the filter is initially open
 * @param {string} props.className - Additional classes to apply to the component
 * @returns {JSX.Element} - Mobile filter component
 */
const MobileFilter = memo(({
    children,
    title = t('products.filters'),
    initiallyOpen = false,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [height, setHeight] = useState(initiallyOpen ? 'auto' : '60px');
    const contentRef = React.useRef(null);

    // Handle window resize to adjust filter height - memoized with useCallback
    const handleResize = useCallback(() => {
        if (window.innerWidth >= 768) {
            setHeight('auto');
        } else if (isOpen) {
            setHeight('auto');
        } else {
            setHeight('60px');
        }
    }, [isOpen]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    // Toggle filter open/closed - memoized with useCallback
    const toggleFilter = useCallback(() => {
        if (window.innerWidth < 768) {
            setIsOpen(!isOpen);
            setHeight(!isOpen ? 'auto' : '60px');
        }
    }, [isOpen]);

    return (
        <motion.div
            className={`bg-gradient-to-br from-white via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-700 rounded-2xl shadow-xl border-2 border-pink-100 dark:border-gray-600 overflow-hidden ${className}`}
            animate={{ height }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            whileHover={{ scale: 1.02 }}
        >
            {/* Enhanced Filter Header */}
            <div
                className="p-5 flex justify-between items-center cursor-pointer md:cursor-default bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white"
                onClick={toggleFilter}
            >
                <h3 className="font-bold text-lg flex items-center">
                    <motion.div
                        animate={{ rotate: isOpen ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                        className="mr-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </motion.div>
                    {title}
                </h3>
                <motion.button
                    className="md:hidden text-white hover:text-pink-200 bg-white/20 rounded-full p-2 backdrop-blur-sm"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={isOpen ? t('common.collapse') : t('common.expand')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.button>
            </div>

            {/* Enhanced Filter Content */}
            <AnimatePresence>
                <motion.div
                    ref={contentRef}
                    className="px-6 pb-6 bg-white dark:bg-gray-800"
                    initial={{ opacity: initiallyOpen ? 1 : 0, y: initiallyOpen ? 0 : -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    <div className="space-y-4">
                        {children}
                    </div>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
});

MobileFilter.displayName = 'MobileFilter';

export default MobileFilter;

/**
 * Filter section component for grouping related filters
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Filter content
 * @param {string} props.title - Section title
 * @param {boolean} props.initiallyOpen - Whether the section is initially open
 * @param {string} props.className - Additional classes to apply to the component
 * @returns {JSX.Element} - Filter section component
 */
export const FilterSection = memo(({
    children,
    title,
    initiallyOpen = true,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);

    // Memoize toggle function
    const toggleSection = useCallback(() => {
        setIsOpen(!isOpen);
    }, [isOpen]);

    return (
        <div className={`mb-6 ${className}`}>
            <motion.div
                className="flex justify-between items-center mb-3 cursor-pointer bg-gradient-to-r from-pink-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 p-3 rounded-xl"
                onClick={toggleSection}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <h4 className="font-bold text-gray-800 dark:text-gray-200 flex items-center">
                    <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full mr-2"></div>
                    {title}
                </h4>
                <motion.button
                    className="text-pink-600 hover:text-purple-600 dark:text-pink-400 dark:hover:text-purple-400 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.1 }}
                    aria-label={isOpen ? t('common.collapse') : t('common.expand')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.button>
            </motion.div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: 'auto', opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-pink-100 dark:border-gray-600"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

FilterSection.displayName = 'FilterSection';
