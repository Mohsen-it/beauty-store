import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { t } from '@/utils/translate';
import CinematicLayout from '@/Layouts/CinematicLayout';

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
      // Use Fetch API instead of Inertia
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

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
          className="text-xl sm:text-2xl md:text-3xl font-bold text-cinematic-900 dark:text-white mb-4 sm:mb-6 md:mb-8"
        >
          {t('products.title')}
        </motion.h1>

        {/* Mobile filter toggle button - Fixed at bottom on mobile */}
        <div className="fixed bottom-4 right-4 z-30 lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
            className={`flex items-center justify-center p-3 rounded-full shadow-lg ${
              filtersExpanded
                ? 'bg-pink-600 text-white'
                : 'bg-white dark:bg-cinematic-800 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800'
            }`}
          >
            <span className="sr-only">{filtersExpanded ? t('common.hide_filters') : t('common.show_filters')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {filtersExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              )}
            </svg>
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
              className="h-full w-[85%] max-w-xs sm:max-w-sm lg:w-full lg:max-w-none overflow-y-auto bg-white dark:bg-cinematic-800 p-3 sm:p-4 md:p-6 lg:rounded-xl shadow-lg dark:shadow-soft lg:mb-6 border-r lg:border-2 border-pink-100 dark:border-pink-900/30"
            >
              {/* Header with close button for mobile */}
              <div className="flex justify-between items-center mb-3 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{t('products.filters')}</h2>
                <button
                  type="button"
                  onClick={() => setFiltersExpanded(false)}
                  className="lg:hidden flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
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
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {t('products.categories')}
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center group">
                        <div className="relative">
                          <input
                            id={`category-${category.id}`}
                            name="category"
                            type="radio"
                            checked={parseInt(filters.category) === category.id}
                            onChange={() => {
                              router.visit(route('products.index'), {
                                data: { category: category.id },
                                preserveState: true,
                                preserveScroll: true,
                                only: ['products', 'filters']
                              });
                            }}
                            className="h-5 w-5 text-pink-600 focus:ring-pink-500 focus:ring-offset-2 dark:bg-cinematic-700 dark:checked:bg-pink-600 dark:focus:ring-pink-400 border-2 border-gray-300 dark:border-gray-600 rounded-full transition-colors duration-200"
                          />
                          {parseInt(filters.category) === category.id && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <span className="h-2.5 w-2.5 bg-pink-600 dark:bg-pink-400 rounded-full"></span>
                            </span>
                          )}
                        </div>
                        <label
                          htmlFor={`category-${category.id}`}
                          className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 cursor-pointer transition-colors duration-200"
                        >
                          {category.name}
                        </label>
                      </div>
                    ))}
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
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('products.price_range')}
                        </h3>
                        <div className="flex flex-col space-y-2 sm:space-y-3">
                          <div>
                            <label htmlFor="min-price" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">{t('products.minimum_price')}:</label>
                            <div className="relative flex items-center border-2 border-pink-300 dark:border-pink-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group focus-within:border-pink-500 focus-within:shadow-pink-500/20 dark:focus-within:shadow-pink-700/30">
                              <div className="px-2 sm:px-3 py-2 sm:py-3 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 font-medium text-base sm:text-lg group-focus-within:bg-pink-100 dark:group-focus-within:bg-pink-800/30 transition-colors duration-300">$</div>
                              <input
                                type="number"
                                id="min-price"
                                placeholder="Min"
                                min="0"
                                step="1"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                className="w-full py-2 sm:py-3 px-2 sm:px-3 border-0 focus:ring-0 focus:outline-none bg-white dark:bg-cinematic-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base transition-all duration-300"
                                style={{ minWidth: '100px' }}
                              />
                            </div>
                          </div>

                          <div>
                            <label htmlFor="max-price" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">{t('products.maximum_price')}:</label>
                            <div className="relative flex items-center border-2 border-pink-300 dark:border-pink-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group focus-within:border-pink-500 focus-within:shadow-pink-500/20 dark:focus-within:shadow-pink-700/30">
                              <div className="px-2 sm:px-3 py-2 sm:py-3 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 font-medium text-base sm:text-lg group-focus-within:bg-pink-100 dark:group-focus-within:bg-pink-800/30 transition-colors duration-300">$</div>
                              <input
                                type="number"
                                id="max-price"
                                placeholder="Max"
                                min="0"
                                step="1"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                className="w-full py-2 sm:py-3 px-2 sm:px-3 border-0 focus:ring-0 focus:outline-none bg-white dark:bg-cinematic-800 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base transition-all duration-300"
                                style={{ minWidth: '100px' }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Sort Options */}
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                          </svg>
                          {t('products.sort_by')}
                        </h3>
                        <div className="relative">
                          <select
                            value={`${sortOption.sort}-${sortOption.order}`}
                            onChange={(e) => {
                              const [sort, order] = e.target.value.split('-');
                              setSortOption({ sort, order });
                            }}
                            className="block w-full rounded-lg border-2 border-pink-300 dark:border-pink-700 shadow-sm focus:border-pink-500 focus:ring-2 focus:ring-pink-500 dark:bg-cinematic-800 text-gray-700 dark:text-white py-2 sm:py-3 px-3 sm:px-4 pr-10 appearance-none font-medium text-sm sm:text-base"
                          >
                            <option value="created_at-desc">{t('products.newest')}</option>
                            <option value="created_at-asc">{t('products.oldest')}</option>
                            <option value="price-asc">{t('products.price_low_to_high')}</option>
                            <option value="price-desc">{t('products.price_high_to_low')}</option>
                            <option value="name-asc">{t('products.name_a_to_z')}</option>
                            <option value="name-desc">{t('products.name_z_to_a')}</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-pink-600 dark:text-pink-400">
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                        >
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
                              className="w-full text-gray-700 dark:text-gray-300 bg-white dark:bg-cinematic-800 border-2 border-pink-300 dark:border-pink-700 py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] font-medium text-sm sm:text-base"
                            >
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
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
              >
                {products.data.map((product) => (
                  <motion.div key={product.id} variants={item}>
                    <Link href={route('products.show', product.slug)} className="block">
                      <div className="group bg-white dark:bg-cinematic-800 rounded-lg overflow-hidden shadow-md dark:shadow-soft hover:shadow-xl dark:hover:shadow-soft-lg transition-shadow duration-300 border border-cinematic-200 dark:border-cinematic-700">
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                            {product.images.length > 0 ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <img
                                src="/assets/default-product.png"
                                alt={product.name}
                                className="h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                              />
                            )}
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="text-xs sm:text-sm text-cinematic-500 dark:text-cinematic-400">{product.category.name}</h3>
                          <p className="mt-1 text-base sm:text-lg font-medium text-cinematic-900 dark:text-white">{product.name}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div>
                              {product.sale_price ? (
                                <div className="flex items-center">
                                  <span className="text-base sm:text-lg text-primary-600 dark:text-primary-400">${product.sale_price}</span>
                                  <span className="ml-2 text-xs sm:text-sm text-cinematic-500 dark:text-cinematic-400 line-through">${product.price}</span>
                                </div>
                              ) : (
                                <span className="text-base sm:text-lg font-bold text-primary-600 dark:text-primary-600">${product.price}</span>
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
                              className={`p-2 rounded-full ${
                                addingToCart === product.id
                                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30'
                                  : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40'
                              } transition-all duration-300 relative overflow-hidden`}
                            >
                              {addingToCart === product.id ? (
                                <>
                                  {/* Spinner animation */}
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </motion.div>
                                </>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
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
              <div className="mt-6 sm:mt-8">
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {products.links.map((link, index) => (
                    <Link
                      key={index}
                      href={link.url}
                      className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm ${link.active
                        ? 'bg-primary-600 dark:bg-primary-700 text-white'
                        : link.url
                          ? 'bg-white dark:bg-cinematic-800 text-cinematic-700 dark:text-cinematic-300 hover:bg-primary-100 dark:hover:bg-primary-900 border border-cinematic-200 dark:border-cinematic-700'
                          : 'bg-cinematic-100 dark:bg-cinematic-900 text-cinematic-400 dark:text-cinematic-600 cursor-not-allowed border border-cinematic-200 dark:border-cinematic-800'
                        }`}
                      dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                  ))}
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
