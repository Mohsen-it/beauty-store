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
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden ${className}`}
            animate={{ height }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {/* Filter Header - Always visible */}
            <div
                className="p-4 flex justify-between items-center cursor-pointer md:cursor-default"
                onClick={toggleFilter}
            >
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {title}
                </h3>
                <motion.button
                    className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-label={isOpen ? t('common.collapse') : t('common.expand')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.button>
            </div>

            {/* Filter Content - Visible based on state */}
            <AnimatePresence>
                <motion.div
                    ref={contentRef}
                    className="px-4 pb-4"
                    initial={{ opacity: initiallyOpen ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
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
        <div className={`mb-4 ${className}`}>
            <div
                className="flex justify-between items-center mb-2 cursor-pointer"
                onClick={toggleSection}
            >
                <h4 className="font-medium text-gray-700 dark:text-gray-300">{title}</h4>
                <motion.button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-label={isOpen ? t('common.collapse') : t('common.expand')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.button>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

FilterSection.displayName = 'FilterSection';
