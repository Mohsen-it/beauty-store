import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { t } from '@/utils/translate';
import CinematicLayout from '@/Layouts/CinematicLayout';
import LazyImage from '@/Components/LazyImage';
import ProductCard from '@/Components/ProductCard';
import { getCsrfHeaders } from '@/utils/csrf';
import { FiltersProvider } from '@/hooks/useFilters.jsx';
import ProductFilters from '@/Shared/Filters';
import '../../../css/category-circles.css';
import '../../../css/hide-scrollbar.css';
import '../../../css/mobile-products.css';

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

const ProductsIndex = memo(({ products, categories, filters }) => {
  // State to track which product is being added to cart (for animation)
  const [addingToCart, setAddingToCart] = useState(null);

  // Memoize expensive calculations
  const memoizedProducts = useMemo(() => products, [products]);
  const memoizedCategories = useMemo(() => categories, [categories]);

  // Sort options for the top bar
  const [sortOption, setSortOption] = useState({
    sort: filters.sort || 'created_at',
    order: filters.order || 'desc'
  });

  // Handle sort changes
  const handleSortChange = useCallback((sort, order) => {
    setSortOption({ sort, order });

    const params = {
      ...filters,
      sort,
      order
    };

    router.visit(route('products.index'), {
      data: params,
      preserveState: true,
      preserveScroll: true,
      only: ['products', 'filters']
    });
  }, [filters]);

  const handleAddToCart = useCallback(async (productId) => {
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
  }, []);

  // Memoized animation variants for better performance
  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.05 // Reduced for better performance
        }
      }
    },
    item: {
      hidden: { opacity: 0, y: 10 }, // Reduced movement for better performance
      show: {
        opacity: 1,
        y: 0,
        transition: {
          type: "tween",
          duration: 0.2 // Shorter duration for better performance
        }
      }
    }
  }), []);

  // Listen for filter changes - can be used later if needed
  useEffect(() => {
    // Logic can be added here if you need to track filter changes
  }, [sortOption, filters]);

  // Get category icon based on category name
  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Skincare': '🧴',
      'Makeup': '💄',
      'Fragrance': '🌸',
      'Hair Care': '💇',
      'Body Care': '🧴',
      'Tools': '🔧',
      'Accessories': '✨',
      'default': '🏷️'
    };

    // Find matching category or use default
    const matchedKey = Object.keys(iconMap).find(key =>
      categoryName.toLowerCase().includes(key.toLowerCase())
    );

    return iconMap[matchedKey] || iconMap.default;
  };

  return (
    <FiltersProvider initialFilters={filters} categories={memoizedCategories}>
      <CinematicLayout>
        <Head title={`${t('products.title')} - ${t('app.title')}`} />

        {/* Enhanced Mobile-First Container */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
          {/* Enhanced Mobile-First Hero Section */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 mb-3 sm:mb-4 md:mb-6"
            >
              {t('products.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Discover our premium collection of beauty products crafted for your unique style
            </motion.p>

            {/* Decorative Elements */}
            <div className="flex justify-center items-center space-x-4 mt-6">
              <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
              <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            </div>
          </div>

          {/* Responsive Layout: Desktop Sidebar + Mobile FAB */}
          <div className="flex gap-3 md:gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden md:block w-80 flex-shrink-0">
              <ProductFilters />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Results Count - Mobile Optimized */}
              <div className="mb-3 sm:mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {products.total} {products.total === 1 ? t('products.product_found') : t('products.products_found')}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('products.page')} {products.current_page} {t('products.of')} {products.last_page}
                </div>
              </div>

              {/* Enhanced Sort Options Bar */}
              <div className="mb-6 md:mb-8 bg-gradient-to-r from-white via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl p-4 md:p-6 shadow-xl border-2 border-pink-100 dark:border-gray-700">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                  <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-6">
                    <span className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                      </svg>
                      {t('products.sort_by')}:
                    </span>

                    {/* Enhanced Sort Buttons */}
                    <div className="grid grid-cols-2 gap-3 md:flex md:space-x-3">
                      {[
                        { sort: 'created_at', order: 'desc', label: '✨ Newest', mobileLabel: '✨ New', icon: '✨' },
                        { sort: 'price', order: 'asc', label: '💰 Price ↑', mobileLabel: '💰 ↑', icon: '💰' },
                        { sort: 'price', order: 'desc', label: '💰 Price ↓', mobileLabel: '💰 ↓', icon: '💰' },
                        { sort: 'name', order: 'asc', label: '🔤 A-Z', mobileLabel: '🔤 A-Z', icon: '🔤' }
                      ].map((option, index) => {
                        const isSelected = sortOption.sort === option.sort && sortOption.order === option.order;
                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSortChange(option.sort, option.order)}
                            className={`px-4 py-3 md:py-3 text-sm md:text-base font-bold rounded-xl transition-all duration-300 min-h-[52px] md:min-h-[48px] focus:ring-2 focus:ring-pink-500 shadow-lg ${
                              isSelected
                                ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white shadow-2xl transform scale-105 border-2 border-pink-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-gray-600 dark:hover:to-gray-600'
                            }`}
                          >
                            <span className="md:hidden">{option.mobileLabel}</span>
                            <span className="hidden md:inline">{option.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Enhanced Results Counter */}
                  <div className="flex items-center justify-center md:justify-end space-x-2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl shadow-lg">
                      <span className="text-sm md:text-base font-bold">
                        {products.total} {t('products.products_found')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Product Grid - Mobile Optimized */}
              {products.data.length > 0 ? (
                <div className="product-grid-container">
                  <motion.div
                    variants={animationVariants.container}
                    initial="hidden"
                    animate="show"
                    className="products-grid-unified"
                  >
                    {memoizedProducts.data.map((product, index) => (
                      <motion.div
                        key={product.id}
                        variants={animationVariants.item}
                        className="product-card-wrapper"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={handleAddToCart}
                          addingToCart={addingToCart}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center border border-gray-200 dark:border-gray-700">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t('products.no_products_found')}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t('products.try_adjusting_filters')}</p>
                <Link
                  href={route('products.index')}
                  className="inline-flex items-center justify-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 py-3 px-6 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                  preserveScroll
                  preserveState
                  only={['products', 'filters']}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {t('products.clear_all_filters')}
                </Link>
              </div>
            </div>
          )}

          {/* Pagination */}
          {products.data.length > 0 && (
            <div className="mt-6 lg:mt-8 xl:mt-10">
              <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
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
                        className={`px-3 lg:px-4 xl:px-5 py-2 lg:py-2.5 xl:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base ${
                          link.active
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
                            : link.url
                              ? 'bg-white dark:bg-cinematic-800 text-cinematic-700 dark:text-cinematic-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 border border-cinematic-200 dark:border-cinematic-700 hover:border-pink-300 dark:hover:border-pink-700'
                              : 'bg-cinematic-100 dark:bg-cinematic-900 text-cinematic-400 dark:text-cinematic-600 cursor-not-allowed border border-cinematic-200 dark:border-cinematic-800'
                        } ${isMobileHidden ? 'hidden sm:block' : ''} min-w-[40px] lg:min-w-[48px] xl:min-w-[56px] text-center focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 transition-all duration-300 font-medium`}
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

            {/* Mobile Filters FAB */}
            <div className="md:hidden">
              <ProductFilters />
            </div>
          </div>
        </div>
      </CinematicLayout>
    </FiltersProvider>
  );
});

export default ProductsIndex;
