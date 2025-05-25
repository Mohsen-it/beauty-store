import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { t } from '@/utils/translate';
import CinematicLayout from '@/Layouts/CinematicLayout';
import { getCsrfHeaders } from '@/utils/csrf';
import '../../../css/category-circles.css';
import '../../../css/hide-scrollbar.css';

// Function to get category icons
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();

  if (name.includes('skincare') || name.includes('skin')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    );
  } else if (name.includes('makeup') || name.includes('cosmetic')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    );
  } else if (name.includes('hair') || name.includes('haircare')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.5 2.672a1 1 0 10-1 0v1.656a1 1 0 001 0zM5.618 4.504a1 1 0 10-.866.5l1.598.346a1 1 0 00.866-.5zM12.75 7.5h1.376c.966 0 1.75.784 1.75 1.75v1.5m-9.5 0h9.5m-9.5 0a1.5 1.5 0 00-1.5 1.5v1.5m11-3v1.5m0 0a1.5 1.5 0 011.5 1.5v1.5m-13 0h13m-13 0a1.5 1.5 0 00-1.5 1.5v1.5m15-3v1.5m0 0a1.5 1.5 0 011.5 1.5v1.5m-16.5 0h16.5" />
      </svg>
    );
  } else if (name.includes('fragrance') || name.includes('perfume')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    );
  } else if (name.includes('bath') || name.includes('body')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
      </svg>
    );
  } else if (name.includes('tools') || name.includes('accessories')) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    );
  } else {
    // Default icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    );
  }
};

const ProductsIndex = ({ products, categories, filters }) => {
  const [priceRange, setPriceRange] = useState({
    min: filters.min_price || '',
    max: filters.max_price || ''
  });

  const [sortOption, setSortOption] = useState({
    sort: filters.sort || 'created_at',
    order: filters.order || 'desc'
  });

  // State to track if filters are expanded on mobile
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  // State to track if we're on a large screen
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // State to track which product is being added to cart (for animation)
  const [addingToCart, setAddingToCart] = useState(null);

  const handleFilterSubmit = (e) => {
    e.preventDefault();

    const params = {};

    if (filters.category) {
      params.category = filters.category;
    }

    // Check for valid price range values
    if (priceRange.min && !isNaN(priceRange.min)) {
      params.min_price = parseFloat(priceRange.min);
    }

    if (priceRange.max && !isNaN(priceRange.max)) {
      params.max_price = parseFloat(priceRange.max);
    }

    // Validate price range
    if (params.min_price && params.max_price && params.min_price > params.max_price) {
      toast.error('Minimum price must be less than maximum price');
      return;
    }

    params.sort = sortOption.sort;
    params.order = sortOption.order;

    router.visit(route('products.index'), {
      data: params,
      preserveState: true,
      preserveScroll: true,
      only: ['products', 'filters']
    });
  };

  const handleAddToCart = async (productId) => {
    // Set the product as being added to cart (for animation)
    setAddingToCart(productId);

    try {
      // Use the utility function to get CSRF headers
      const headers = getCsrfHeaders();

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

      // Check if the response is a redirect to login page (unauthenticated)
      if (response.redirected && response.url.includes('/login')) {
        // Redirect to login page
        window.location.href = response.url;
        return;
      }

      // Check for 401 Unauthorized status
      if (response.status === 401) {
        // Redirect to login page
        window.location.href = route('login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        // Display success message
        toast.success(data.message || 'Product added to cart successfully');

        // Update cart count immediately
        if (data.count) {
          // Update cart count using custom event
          window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: parseInt(data.count) }
          }));
        }
      } else {
        // If the message indicates authentication is required, redirect to login
        if (data.message === 'Unauthenticated.' || data.message?.toLowerCase().includes('login')) {
          window.location.href = route('login');
          return;
        }
        toast.error(data.message || 'Failed to add product to cart');
      }

      // Remove adding state after a short delay
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);

    } catch (error) {
      console.error('Cart error:', error);
      toast.error('Failed to add product to cart');
      // Remove adding state in case of error
      setAddingToCart(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Check for screen size on client side
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Listen for filter changes - can be used later if needed
  useEffect(() => {
    // Logic can be added here if you need to track filter changes
  }, [priceRange, sortOption, filters]);

  return (
    <CinematicLayout>
      <Head title={`${t('products.title')} - ${t('app.title')}`} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-cinematic-900 dark:text-white mb-3 sm:mb-4 md:mb-6"
        >
          {t('products.title')}
        </motion.h1>

        {/* Horizontal Category Carousel - Mobile Only */}
        {categories.length > 0 && (
          <div className="lg:hidden mb-4 sm:mb-6 relative">
            <div className="overflow-x-auto pb-2 hide-scrollbar">
              <div className="flex space-x-2 px-0.5 snap-x snap-mandatory">
                <div
                  key="all"
                  className={`snap-start shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-lg ${
                    !filters.category
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 dark:shadow-pink-700/30'
                      : 'bg-white dark:bg-cinematic-800 text-cinematic-700 dark:text-cinematic-300 border border-cinematic-200 dark:border-cinematic-700'
                  }`}
                  onClick={() => {
                    router.visit(route('products.index'), {
                      data: {
                        sort: sortOption.sort,
                        order: sortOption.order,
                        min_price: priceRange.min,
                        max_price: priceRange.max
                      },
                      preserveState: true,
                      preserveScroll: true,
                      only: ['products', 'filters']
                    });
                  }}
                >
                  <span className="text-xs font-medium whitespace-nowrap">{t('common.all')}</span>
                </div>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`snap-start shrink-0 flex flex-col items-center justify-center px-3 py-2 rounded-lg ${
                      parseInt(filters.category) === category.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/20 dark:shadow-pink-700/30'
                        : 'bg-white dark:bg-cinematic-800 text-cinematic-700 dark:text-cinematic-300 border border-cinematic-200 dark:border-cinematic-700'
                    }`}
                    onClick={() => {
                      router.visit(route('products.index'), {
                        data: {
                          category: category.id,
                          sort: sortOption.sort,
                          order: sortOption.order,
                          min_price: priceRange.min,
                          max_price: priceRange.max
                        },
                        preserveState: true,
                        preserveScroll: true,
                        only: ['products', 'filters']
                      });
                    }}
                  >
                    <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Scroll indicators */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-full bg-gradient-to-r from-white dark:from-cinematic-900 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-full bg-gradient-to-l from-white dark:from-cinematic-900 to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Mobile filter toggle button - Fixed at bottom on mobile */}
        <div className="fixed bottom-4 right-4 z-30 lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={`flex items-center justify-center p-3 rounded-full shadow-xl ${
              filtersExpanded
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                : 'bg-white dark:bg-cinematic-800 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
            } transition-all duration-300 transform hover:scale-[1.05] active:scale-[0.95]`}
          >
            <span className="sr-only">{filtersExpanded ? t('common.hide_filters') : t('common.show_filters')}</span>
            {filtersExpanded ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            )}
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-4 xl:gap-8">
          {/* Sidebar with filters - Slide in from left on mobile */}
          <div className={`fixed inset-0 z-40 lg:relative lg:z-0 transform transition-transform duration-300 ease-in-out ${filtersExpanded ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            {/* Overlay for mobile */}
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300 ${filtersExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={() => setFiltersExpanded(false)}
            ></div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full w-[85%] max-w-xs sm:max-w-sm lg:w-full lg:max-w-none overflow-y-auto bg-white dark:bg-cinematic-800 p-4 sm:p-5 md:p-6 lg:rounded-xl shadow-lg dark:shadow-soft lg:mb-6 border-r lg:border-2 border-pink-100 dark:border-pink-900/30"
            >
              {/* Header with close button for mobile */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <h2 className="text-base font-bold text-gray-800 dark:text-white bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{t('products.filters')}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setFiltersExpanded(false)}
                  className="lg:hidden flex items-center justify-center p-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40 transition-all duration-200"
                >
                  <span className="sr-only">{t('common.close')}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleFilterSubmit}>
                {/* Categories - Always visible */}
                <div className="mb-6 sm:mb-7">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2.5 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t('products.categories')}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((category) => {
                      const isSelected = parseInt(filters.category) === category.id;
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            router.visit(route('products.index'), {
                              data: { category: category.id },
                              preserveState: true,
                              preserveScroll: true,
                              only: ['products', 'filters']
                            });
                          }}
                          className={`flex items-center p-1.5 rounded-md transition-all duration-200 ${
                            isSelected
                              ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700'
                              : 'bg-white dark:bg-cinematic-800/50 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                          }`}
                        >
                          <div className={`w-4 h-4 flex items-center justify-center rounded-full mr-1 ${
                            isSelected
                              ? 'bg-pink-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }`}>
                            {getCategoryIcon(category.name)}
                          </div>
                          <span className={`text-[10px] font-medium ${
                            isSelected
                              ? 'text-pink-700 dark:text-pink-400'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {category.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile preview of applied filters when collapsed */}
                <div className={`lg:hidden ${filtersExpanded ? 'hidden' : 'block'} mb-3 sm:mb-4`}>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {(filters.min_price || filters.max_price) && (
                      <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                        {t('products.price_range')}: {filters.min_price ? `$${filters.min_price}` : '$0'} - {filters.max_price ? `$${filters.max_price}` : t('common.any')}
                      </div>
                    )}
                    {(sortOption.sort !== 'created_at' || sortOption.order !== 'desc') && (
                      <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {t('products.sort')}: {sortOption.sort === 'price'
                          ? `${t('products.price')} ${sortOption.order === 'asc' ? '↑' : '↓'}`
                          : sortOption.sort === 'name'
                            ? `${t('products.name')} ${sortOption.order === 'asc' ? 'A-Z' : 'Z-A'}`
                            : `${t('products.date')} ${sortOption.order === 'asc' ? t('products.oldest') : t('products.newest')}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expandable content - hidden on mobile when collapsed */}
                <AnimatePresence>
                  {(filtersExpanded || isLargeScreen) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      {/* Price Range */}
                      <div className="mb-6 sm:mb-7">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2.5 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('products.price_range')}
                        </h3>

                        <div className="bg-white dark:bg-cinematic-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <div className="bg-white dark:bg-cinematic-800 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1.5 w-[45%] flex items-center">
                              <span className="text-pink-600 dark:text-pink-400 font-medium mr-1 text-sm">$</span>
                              <input
                                type="number"
                                id="min-price"
                                placeholder="Min"
                                min="0"
                                step="1"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                className="w-full py-0.5 border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs"
                              />
                            </div>

                            <div className="w-3 h-0.5 bg-gray-300 dark:bg-gray-600 rounded"></div>

                            <div className="bg-white dark:bg-cinematic-800 rounded-md border border-gray-200 dark:border-gray-700 px-2 py-1.5 w-[45%] flex items-center">
                              <span className="text-pink-600 dark:text-pink-400 font-medium mr-1 text-sm">$</span>
                              <input
                                type="number"
                                id="max-price"
                                placeholder="Max"
                                min="0"
                                step="1"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                className="w-full py-0.5 border-0 focus:ring-0 focus:outline-none bg-transparent text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-xs"
                              />
                            </div>
                          </div>

                          {/* Price range labels */}
                          <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 px-1">
                            <span>$0</span>
                            <span>$50</span>
                            <span>$100</span>
                            <span>$200+</span>
                          </div>

                          {/* Price range visual indicator */}
                          <div className="relative mt-1 mb-2">
                            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="absolute top-0 left-0 right-0 h-1">
                              <div
                                className="absolute h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"
                                style={{
                                  left: `${Math.min(100, (priceRange.min ? parseInt(priceRange.min) / 2 : 0))}%`,
                                  right: `${100 - Math.min(100, (priceRange.max ? parseInt(priceRange.max) / 2 : 100))}%`
                                }}
                              ></div>
                              {priceRange.min && (
                                <div
                                  className="absolute w-2.5 h-2.5 bg-white dark:bg-gray-200 border border-pink-500 rounded-full -mt-0.5 transform -translate-x-1/2"
                                  style={{ left: `${Math.min(100, parseInt(priceRange.min) / 2)}%` }}
                                ></div>
                              )}
                              {priceRange.max && (
                                <div
                                  className="absolute w-2.5 h-2.5 bg-white dark:bg-gray-200 border border-purple-600 rounded-full -mt-0.5 transform -translate-x-1/2"
                                  style={{ left: `${Math.min(100, parseInt(priceRange.max) / 2)}%` }}
                                ></div>
                              )}
                            </div>
                          </div>

                          {/* Quick price buttons */}
                          <div className="grid grid-cols-2 gap-1 mt-2">
                            <button
                              type="button"
                              onClick={() => setPriceRange({ min: '0', max: '25' })}
                              className={`px-1 py-0.5 text-[10px] ${
                                priceRange.min === '0' && priceRange.max === '25'
                                  ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400'
                                  : 'bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              } rounded hover:border-pink-300 dark:hover:border-pink-800 transition-colors`}
                            >
                              Under $25
                            </button>
                            <button
                              type="button"
                              onClick={() => setPriceRange({ min: '25', max: '50' })}
                              className={`px-1 py-0.5 text-[10px] ${
                                priceRange.min === '25' && priceRange.max === '50'
                                  ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400'
                                  : 'bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              } rounded hover:border-pink-300 dark:hover:border-pink-800 transition-colors`}
                            >
                              $25 - $50
                            </button>
                            <button
                              type="button"
                              onClick={() => setPriceRange({ min: '50', max: '100' })}
                              className={`px-1 py-0.5 text-[10px] ${
                                priceRange.min === '50' && priceRange.max === '100'
                                  ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400'
                                  : 'bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              } rounded hover:border-pink-300 dark:hover:border-pink-800 transition-colors`}
                            >
                              $50 - $100
                            </button>
                            <button
                              type="button"
                              onClick={() => setPriceRange({ min: '100', max: '' })}
                              className={`px-1 py-0.5 text-[10px] ${
                                priceRange.min === '100' && priceRange.max === ''
                                  ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700 text-pink-700 dark:text-pink-400'
                                  : 'bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                              } rounded hover:border-pink-300 dark:hover:border-pink-800 transition-colors`}
                            >
                              $100+
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div className="mb-6 sm:mb-7">
                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2.5 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                          </svg>
                          {t('products.sort_by')}
                        </h3>

                        <div className="flex flex-wrap gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSortOption({ sort: 'created_at', order: 'desc' })}
                            className={`flex items-center p-1.5 rounded-md transition-all duration-200 ${
                              sortOption.sort === 'created_at' && sortOption.order === 'desc'
                                ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700'
                                : 'bg-white dark:bg-cinematic-800/50 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                            }`}
                          >
                            <div className={`w-4 h-4 flex items-center justify-center rounded-full mr-1 ${
                              sortOption.sort === 'created_at' && sortOption.order === 'desc'
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className={`text-[10px] font-medium ${
                              sortOption.sort === 'created_at' && sortOption.order === 'desc'
                                ? 'text-pink-700 dark:text-pink-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {t('products.newest')}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSortOption({ sort: 'price', order: 'asc' })}
                            className={`flex items-center p-1.5 rounded-md transition-all duration-200 ${
                              sortOption.sort === 'price' && sortOption.order === 'asc'
                                ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700'
                                : 'bg-white dark:bg-cinematic-800/50 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                            }`}
                          >
                            <div className={`w-4 h-4 flex items-center justify-center rounded-full mr-1 ${
                              sortOption.sort === 'price' && sortOption.order === 'asc'
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                              </svg>
                            </div>
                            <span className={`text-[10px] font-medium ${
                              sortOption.sort === 'price' && sortOption.order === 'asc'
                                ? 'text-pink-700 dark:text-pink-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {t('products.price_low_to_high')}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSortOption({ sort: 'price', order: 'desc' })}
                            className={`flex items-center p-1.5 rounded-md transition-all duration-200 ${
                              sortOption.sort === 'price' && sortOption.order === 'desc'
                                ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700'
                                : 'bg-white dark:bg-cinematic-800/50 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                            }`}
                          >
                            <div className={`w-4 h-4 flex items-center justify-center rounded-full mr-1 ${
                              sortOption.sort === 'price' && sortOption.order === 'desc'
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" transform="rotate(180 12 12)" />
                              </svg>
                            </div>
                            <span className={`text-[10px] font-medium ${
                              sortOption.sort === 'price' && sortOption.order === 'desc'
                                ? 'text-pink-700 dark:text-pink-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {t('products.price_high_to_low')}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSortOption({ sort: 'name', order: 'asc' })}
                            className={`flex items-center p-1.5 rounded-md transition-all duration-200 ${
                              sortOption.sort === 'name' && sortOption.order === 'asc'
                                ? 'bg-pink-100 dark:bg-pink-900/30 border border-pink-300 dark:border-pink-700'
                                : 'bg-white dark:bg-cinematic-800/50 border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-800'
                            }`}
                          >
                            <div className={`w-4 h-4 flex items-center justify-center rounded-full mr-1 ${
                              sortOption.sort === 'name' && sortOption.order === 'asc'
                                ? 'bg-pink-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                              </svg>
                            </div>
                            <span className={`text-[10px] font-medium ${
                              sortOption.sort === 'name' && sortOption.order === 'asc'
                                ? 'text-pink-700 dark:text-pink-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {t('products.name_a_to_z')}
                            </span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 mt-2">
                        <button
                          type="submit"
                          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-1.5 px-3 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-offset-1 dark:focus:ring-offset-cinematic-800 transition-all duration-200 text-xs flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                          </svg>
                          {t('products.apply_filters')}
                        </button>

                        {/* Only show Clear Filters button if any filter is applied */}
                        {(filters.category || filters.min_price || filters.max_price ||
                          sortOption.sort !== 'created_at' || sortOption.order !== 'desc') && (
                            <button
                              type="button"
                              onClick={() => {
                                router.visit(route('products.index'), {
                                  preserveState: true,
                                  preserveScroll: true,
                                  only: ['products', 'filters']
                                });
                                // Reset local state
                                setPriceRange({ min: '', max: '' });
                                setSortOption({ sort: 'created_at', order: 'desc' });
                              }}
                              className="w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-cinematic-800 border border-gray-200 dark:border-gray-700 py-1.5 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-offset-1 dark:focus:ring-offset-cinematic-800 transition-all duration-200 font-medium text-xs flex items-center justify-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {t('products.clear_filters')}
                            </button>
                          )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

            </motion.div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {products.data.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="  grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6
    gap-3 p-2 sm:gap-4 sm:p-4"
              >
                {products.data.map((product) => (
                  <motion.div key={product.id} variants={item}>
                    <Link href={route('products.show', product.slug)} className="block h-full" aria-label={`View ${product.name} details`}>
                      <div className="group bg-white dark:bg-cinematic-800 rounded-md overflow-hidden shadow-sm dark:shadow-soft hover:shadow-md dark:hover:shadow-soft-lg transition-shadow duration-300 border border-cinematic-200 dark:border-cinematic-700 h-full flex flex-col">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100 dark:bg-gray-800 relative" style={{ maxHeight: '120px' }}>
                            {product.images.length > 0 ? (
                              <img
                                src={
                                  product.images[0].image_url
                                    ? product.images[0].image_url
                                    : product.images[0].url
                                      ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                                      : `/assets/default-product.png`
                                }
                                alt={product.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                decoding="async"
                                fetchpriority="low"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/assets/default-product.png";
                                }}
                              />
                            ) : (
                              <img
                                src="/assets/default-product.png"
                                alt={product.name}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                decoding="async"
                                fetchpriority="low"
                              />
                            )}

                            {/* Sale badge */}
                            {product.sale_price && (
                              <div className="category-circle">
                                <div className="category-circle-overlay"></div>
                                <div className="category-circle-content">
                                  <div className="category-circle-discount">
                                    {Math.round((1 - product.sale_price / product.price) * 100)}%
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                        <div className="p-1 xs:p-1.5 sm:p-2 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-0">
                            <h3 className="text-[8px] xs:text-[9px] sm:text-[10px] text-cinematic-500 dark:text-cinematic-400 truncate max-w-[70%]">{product.category.name}</h3>

                            {/* Compact rating */}
                            <div className="flex items-center">
                              <svg
                                className="w-2 h-2 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="ml-0.5 text-[7px] xs:text-[8px] text-gray-500 dark:text-gray-400">
                                {product.rating || 4.0}
                              </span>
                            </div>
                          </div>

                          <p className="mt-0 text-[9px] xs:text-[10px] sm:text-xs font-medium text-cinematic-900 dark:text-white line-clamp-1 min-h-[1rem] xs:min-h-[1.25rem]">{product.name}</p>

                          <div className="mt-auto pt-0.5 xs:pt-1 flex items-center justify-between">
                            <div>
                              {product.sale_price ? (
                                <div className="flex items-center">
                                  <span className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-pink-600 dark:text-pink-400">${product.sale_price}</span>
                                  <span className="ml-0.5 text-[7px] xs:text-[8px] text-cinematic-500 dark:text-cinematic-400 line-through">${product.price}</span>
                                </div>
                              ) : (
                                <span className="text-[9px] xs:text-[10px] sm:text-xs font-bold text-pink-600 dark:text-pink-400">${product.price}</span>
                              )}
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddToCart(product.id);
                              }}
                              disabled={addingToCart === product.id}
                              className={`p-1 rounded-full ${
                                addingToCart === product.id
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30'
                                  : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40'
                              } transition-all duration-300 relative overflow-hidden focus:outline-none focus:ring-1 focus:ring-pink-500 focus:ring-offset-1 dark:focus:ring-offset-cinematic-800`}
                              aria-label={t('cart.add_to_cart')}
                              style={{ minWidth: '24px', minHeight: '24px', width: '24px', height: '24px', touchAction: 'manipulation' }}
                            >
                              {addingToCart === product.id ? (
                                <>
                                  {/* Spinner animation */}
                                  <svg className="animate-spin h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>

                                  {/* Success animation overlay that appears after a delay */}
                                  <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </motion.div>
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                  </svg>
                                  <span className="absolute inset-0 bg-white dark:bg-white opacity-0 active:opacity-20 rounded-full transition-opacity duration-200"></span>
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="bg-white dark:bg-cinematic-800 p-4 sm:p-6 md:p-8 rounded-lg shadow-md dark:shadow-soft text-center border border-cinematic-200 dark:border-cinematic-700">
                <h3 className="text-base sm:text-lg font-medium text-cinematic-900 dark:text-white mb-1 sm:mb-2">{t('products.no_products_found')}</h3>
                <p className="text-sm text-cinematic-600 dark:text-cinematic-400 mb-3 sm:mb-4">{t('products.try_adjusting_filters')}</p>
                <Link
                  href={route('products.index')}
                  className="inline-block bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 transition-colors duration-300 text-xs sm:text-sm"
                  preserveScroll
                  preserveState
                  only={['products', 'filters']}
                >
                  {t('products.clear_all_filters')}
                </Link>
              </div>
            )}

            {/* Pagination */}
            {products.data.length > 0 && (
              <div className="mt-4 sm:mt-6 md:mt-8">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {products.links.map((link, index) => {
                    // For mobile, simplify pagination by only showing prev, current page, and next
                    const isMobileHidden =
                      (index !== 0 && // not "Previous"
                       index !== products.links.length - 1 && // not "Next"
                       !link.active && // not current page
                       !link.label.includes("...") && // not ellipsis
                       products.links.length > 5); // only when we have many pages

                    // Simplify labels for mobile
                    let mobileLabel = link.label;
                    if (link.label === "&laquo; Previous") {
                      mobileLabel = "<";
                    } else if (link.label === "Next &raquo;") {
                      mobileLabel = ">";
                    }

                    return (
                      <Link
                        key={index}
                        href={link.url}
                        className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm ${
                          link.active
                            ? 'bg-primary-600 dark:bg-primary-700 text-white shadow-md'
                            : link.url
                              ? 'bg-white dark:bg-cinematic-800 text-cinematic-700 dark:text-cinematic-300 hover:bg-primary-100 dark:hover:bg-primary-900 border border-cinematic-200 dark:border-cinematic-700'
                              : 'bg-cinematic-100 dark:bg-cinematic-900 text-cinematic-400 dark:text-cinematic-600 cursor-not-allowed border border-cinematic-200 dark:border-cinematic-800'
                        } ${isMobileHidden ? 'hidden sm:block' : ''} min-w-[32px] sm:min-w-[40px] text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800`}
                        aria-label={
                          link.label === "&laquo; Previous"
                            ? "Previous page"
                            : link.label === "Next &raquo;"
                              ? "Next page"
                              : `Page ${link.label}`
                        }
                      >
                        {/* Use simplified labels on mobile */}
                        <span className="sm:hidden" dangerouslySetInnerHTML={{ __html: mobileLabel }}></span>
                        <span className="hidden sm:inline" dangerouslySetInnerHTML={{ __html: link.label }}></span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CinematicLayout>
  );
};

export default ProductsIndex;
