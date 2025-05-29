import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFilters } from '@/hooks/useFilters.jsx';
import { t } from '@/utils/translate';

// Star Rating Component
const StarRating = memo(({ rating, onRatingChange }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex space-x-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => {
            // Prefetch on hover (desktop)
            if (window.innerWidth >= 768) {
              // Add prefetch logic here if needed
            }
          }}
          className={`p-1 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-primary ${
            rating >= star
              ? 'text-yellow-400 hover:text-yellow-500'
              : 'text-gray-300 dark:text-gray-600 hover:text-yellow-300'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
});

// Price Range Slider Component (Simple implementation without react-range for now)
const PriceRangeSlider = memo(({ priceRange, onPriceChange }) => {
  const [localRange, setLocalRange] = useState(priceRange);

  useEffect(() => {
    setLocalRange(priceRange);
  }, [priceRange]);

  const handleMinChange = (e) => {
    const newRange = { ...localRange, min: e.target.value };
    setLocalRange(newRange);
    onPriceChange(newRange);
  };

  const handleMaxChange = (e) => {
    const newRange = { ...localRange, max: e.target.value };
    setLocalRange(newRange);
    onPriceChange(newRange);
  };

  const quickRanges = [
    { min: '0', max: '25', label: '<$25' },
    { min: '25', max: '50', label: '$25-50' },
    { min: '50', max: '100', label: '$50-100' },
    { min: '100', max: '', label: '$100+' }
  ];

  return (
    <div className="space-y-3">
      {/* Price Input Fields */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 font-bold text-sm">$</div>
          <input
            type="number"
            placeholder="Min"
            min="0"
            step="1"
            value={localRange.min}
            onChange={handleMinChange}
            className="w-full pl-8 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-primary text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium transition-all duration-200 min-h-[44px]"
          />
        </div>
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 font-bold text-sm">$</div>
          <input
            type="number"
            placeholder="Max"
            min="0"
            step="1"
            value={localRange.max}
            onChange={handleMaxChange}
            className="w-full pl-8 pr-3 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:border-green-500 dark:focus:border-green-400 focus:ring-2 focus:ring-primary text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm font-medium transition-all duration-200 min-h-[44px]"
          />
        </div>
      </div>

      {/* Quick Price Preset Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {quickRanges.map((range, index) => (
          <motion.button
            key={index}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onPriceChange({ min: range.min, max: range.max })}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all duration-200 min-h-[44px] focus:ring-2 focus:ring-primary ${
              localRange.min === range.min && localRange.max === range.max
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md'
            }`}
          >
            {range.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
});

// Mobile Filter Drawer
const MobileFilterDrawer = memo(({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 overflow-y-auto shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="filter-drawer-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 id="filter-drawer-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('products.filters')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-pink-500"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

// Main ProductFilters Component
const ProductFilters = memo(() => {
  const {
    filters,
    categories,
    brands = [],
    tags = [],
    updateCategory,
    updateBrands,
    updateTags,
    updatePriceRange,
    updateRating,
    resetFilters,
    hasActiveFilters,
    isApplying
  } = useFilters();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Check URL hash for mobile drawer state
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#filters') {
      setIsMobileDrawerOpen(true);
    }
  }, []);

  // Update URL hash when drawer opens/closes
  const handleMobileDrawerToggle = useCallback(() => {
    const newState = !isMobileDrawerOpen;
    setIsMobileDrawerOpen(newState);

    if (newState) {
      window.history.pushState(null, '', '#filters');
    } else {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  }, [isMobileDrawerOpen]);

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();

    if (name.includes('skincare') || name.includes('skin')) {
      return (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    }

    if (name.includes('makeup') || name.includes('cosmetic')) {
      return (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      );
    }

    // Default icon
    return (
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    );
  };

  return (
    <>
      {/* Desktop Filters - Sticky Left Column */}
      <div className="hidden md:block">
        <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('products.filters')}
              </h3>
              {hasActiveFilters && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium focus:ring-2 focus:ring-pink-500 rounded px-2 py-1"
                >
                  {t('products.clear_filters')}
                </motion.button>
              )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('products.categories')}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => updateCategory('')}
                      className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('common.all')}
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={parseInt(filters.category) === category.id}
                        onChange={() => updateCategory(category.id)}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                      />
                      <div className="flex items-center space-x-2">
                        <div className="text-pink-600 dark:text-pink-400">
                          {getCategoryIcon(category.name)}
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {category.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brands (if available) */}
            {brands.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('products.brands')}
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.brands.includes(brand.id)}
                        onChange={() => updateBrands(brand.id)}
                        className="w-4 h-4 text-pink-600 focus:ring-pink-500 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {brand.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tags (if available) */}
            {tags.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('products.tags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.button
                      key={tag.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateTags(tag.id)}
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-200 focus:ring-2 focus:ring-pink-500 ${
                        filters.tags.includes(tag.id)
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('products.price_range')}
              </h3>
              <PriceRangeSlider
                priceRange={filters.priceRange}
                onPriceChange={updatePriceRange}
              />
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('products.rating')}
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={!filters.rating}
                    onChange={() => updateRating('')}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {t('common.all')}
                  </span>
                </label>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={parseInt(filters.rating) === rating}
                      onChange={() => updateRating(rating)}
                      className="w-4 h-4 text-pink-600 focus:ring-pink-500"
                    />
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm text-gray-700 dark:text-gray-300 ml-2">
                        {rating}+ {t('products.stars')}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile FAB */}
      <div className="md:hidden">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMobileDrawerToggle}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl min-h-[56px] min-w-[56px] flex items-center justify-center focus:ring-2 focus:ring-pink-500 hover:shadow-3xl transition-all duration-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </motion.button>

        {/* Mobile Drawer */}
        <MobileFilterDrawer isOpen={isMobileDrawerOpen} onClose={handleMobileDrawerToggle}>
          <div className="space-y-4">
            {/* Header with Reset */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    resetFilters();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium focus:ring-2 focus:ring-pink-500 rounded px-2 py-1"
                >
                  {t('products.clear_filters')}
                </motion.button>
              </div>
            )}

            {/* Same filter content as desktop but in mobile layout */}
            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('products.categories')}
                </h3>
                <div className="grid gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateCategory('')}
                    className={`flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[44px] focus:ring-2 focus:ring-pink-500 ${
                      !filters.category
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="text-sm font-medium">{t('common.all')}</span>
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateCategory(category.id)}
                      className={`flex items-center justify-start px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[44px] focus:ring-2 focus:ring-pink-500 ${
                        parseInt(filters.category) === category.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={parseInt(filters.category) === category.id ? 'text-white' : 'text-pink-600 dark:text-pink-400'}>
                          {getCategoryIcon(category.name)}
                        </div>
                        <span className="text-sm font-medium truncate">{category.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('products.price_range')}
              </h3>
              <PriceRangeSlider
                priceRange={filters.priceRange}
                onPriceChange={updatePriceRange}
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('products.rating')}
              </h3>
              <div className="grid gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateRating('')}
                  className={`flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[44px] focus:ring-2 focus:ring-pink-500 ${
                    !filters.rating
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium">{t('common.all')}</span>
                </motion.button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateRating(rating)}
                    className={`flex items-center justify-start px-3 py-2.5 rounded-lg transition-all duration-200 min-h-[44px] focus:ring-2 focus:ring-pink-500 ${
                      parseInt(filters.rating) === rating
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rating
                              ? (parseInt(filters.rating) === rating ? 'text-yellow-200' : 'text-yellow-400')
                              : (parseInt(filters.rating) === rating ? 'text-white/50' : 'text-gray-300 dark:text-gray-600')
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-xs font-medium ml-1.5">
                        {rating}+ {t('products.stars')}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </MobileFilterDrawer>
      </div>
    </>
  );
});

export default ProductFilters;
