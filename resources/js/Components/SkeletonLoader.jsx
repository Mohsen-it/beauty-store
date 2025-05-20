import React from 'react';

/**
 * Skeleton loader component for displaying loading states
 * 
 * @param {string} className - Additional classes to apply to the skeleton
 * @param {string} type - Type of skeleton (text, circle, rectangle, card, product)
 * @param {number} width - Width of the skeleton (for text type)
 * @param {number} height - Height of the skeleton (for rectangle type)
 * @param {boolean} animate - Whether to animate the skeleton
 * @returns {JSX.Element} - Skeleton loader component
 */
export default function SkeletonLoader({ 
    className = '', 
    type = 'text', 
    width = 100, 
    height = 20,
    animate = true,
    ...props 
}) {
    const baseClasses = `bg-gray-200 dark:bg-gray-700 ${animate ? 'skeleton' : ''}`;
    
    // Different skeleton types
    const skeletonTypes = {
        text: `h-${height / 4} rounded-md ${width < 100 ? `w-${width}%` : 'w-full'}`,
        circle: 'rounded-full',
        rectangle: `rounded-md h-${height / 4}`,
        card: 'rounded-xl h-full w-full',
        product: 'rounded-xl h-full w-full',
    };

    // For product cards, return a more complex skeleton
    if (type === 'product') {
        return (
            <div className={`${baseClasses} ${className} overflow-hidden`} {...props}>
                <div className="aspect-w-1 aspect-h-1 w-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-1/4"></div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded-md w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded-md w-2/4"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-md w-1/3 mt-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div 
            className={`${baseClasses} ${skeletonTypes[type] || skeletonTypes.text} ${className}`}
            style={type === 'circle' ? { width: `${height}px`, height: `${height}px` } : {}}
            {...props}
        ></div>
    );
}

/**
 * Skeleton loader for product grid
 * 
 * @param {number} count - Number of skeleton items to display
 * @param {string} className - Additional classes to apply to the container
 * @returns {JSX.Element} - Product grid skeleton
 */
export function ProductGridSkeleton({ count = 4, className = '' }) {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
            {Array(count).fill(0).map((_, index) => (
                <SkeletonLoader key={index} type="product" className="h-[350px]" />
            ))}
        </div>
    );
}

/**
 * Skeleton loader for text content
 * 
 * @param {number} lines - Number of lines to display
 * @param {string} className - Additional classes to apply to the container
 * @returns {JSX.Element} - Text content skeleton
 */
export function TextContentSkeleton({ lines = 3, className = '' }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array(lines).fill(0).map((_, index) => (
                <SkeletonLoader 
                    key={index} 
                    type="text" 
                    width={index === lines - 1 ? 80 : 100} 
                    height={index === 0 ? 24 : 16} 
                />
            ))}
        </div>
    );
}
