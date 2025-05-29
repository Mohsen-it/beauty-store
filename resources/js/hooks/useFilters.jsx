import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-hot-toast';

// Create the context
const FiltersContext = createContext();

// Custom hook to use the filters context
export const useFilters = () => {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
};

// Filters Provider Component
export const FiltersProvider = ({ children, initialFilters = {}, categories = [], brands = [], tags = [] }) => {
  // Initialize state from URL parameters or props
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    brands: initialFilters.brands || [],
    tags: initialFilters.tags || [],
    priceRange: {
      min: initialFilters.min_price || '',
      max: initialFilters.max_price || ''
    },
    rating: initialFilters.rating || '',
    sort: initialFilters.sort || 'created_at',
    order: initialFilters.order || 'desc'
  });

  // Track if filters are being applied (for loading states)
  const [isApplying, setIsApplying] = useState(false);

  // Debounce timer
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Check if any filters are active (for reset button)
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.category ||
      filters.brands.length > 0 ||
      filters.tags.length > 0 ||
      filters.priceRange.min ||
      filters.priceRange.max ||
      filters.rating ||
      filters.sort !== 'created_at' ||
      filters.order !== 'desc'
    );
  }, [filters]);

  // Build query parameters for the request
  const buildQueryParams = useCallback((filterState = filters) => {
    const params = {};

    if (filterState.category) {
      params.category = filterState.category;
    }

    if (filterState.brands.length > 0) {
      params.brands = filterState.brands.join(',');
    }

    if (filterState.tags.length > 0) {
      params.tags = filterState.tags.join(',');
    }

    if (filterState.priceRange.min && !isNaN(filterState.priceRange.min)) {
      params.min_price = parseFloat(filterState.priceRange.min);
    }

    if (filterState.priceRange.max && !isNaN(filterState.priceRange.max)) {
      params.max_price = parseFloat(filterState.priceRange.max);
    }

    if (filterState.rating) {
      params.rating = filterState.rating;
    }

    params.sort = filterState.sort;
    params.order = filterState.order;

    return params;
  }, [filters]);

  // Apply filters with debouncing
  const applyFilters = useCallback((newFilters = filters, immediate = false) => {
    // Validate price range
    if (newFilters.priceRange.min && newFilters.priceRange.max) {
      const min = parseFloat(newFilters.priceRange.min);
      const max = parseFloat(newFilters.priceRange.max);
      if (min > max) {
        toast.error('Minimum price must be less than maximum price');
        return;
      }
    }

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const applyNow = () => {
      setIsApplying(true);
      const params = buildQueryParams(newFilters);

      router.visit(route('products.index'), {
        data: params,
        preserveState: true,
        preserveScroll: true,
        only: ['products', 'filters'],
        onFinish: () => setIsApplying(false)
      });
    };

    if (immediate) {
      applyNow();
    } else {
      // Debounce for 350ms
      const timer = setTimeout(applyNow, 350);
      setDebounceTimer(timer);
    }
  }, [filters, debounceTimer, buildQueryParams]);

  // Update category filter
  const updateCategory = useCallback((categoryId) => {
    const newFilters = { ...filters, category: categoryId };
    setFilters(newFilters);
    applyFilters(newFilters, true); // Apply immediately for category changes
  }, [filters, applyFilters]);

  // Update brands filter (multi-select)
  const updateBrands = useCallback((brandId) => {
    const newBrands = filters.brands.includes(brandId)
      ? filters.brands.filter(id => id !== brandId)
      : [...filters.brands, brandId];

    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  // Update tags filter (multi-select)
  const updateTags = useCallback((tagId) => {
    const newTags = filters.tags.includes(tagId)
      ? filters.tags.filter(id => id !== tagId)
      : [...filters.tags, tagId];

    const newFilters = { ...filters, tags: newTags };
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  // Update price range
  const updatePriceRange = useCallback((priceRange) => {
    const newFilters = { ...filters, priceRange };
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  // Update rating filter
  const updateRating = useCallback((rating) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [filters, applyFilters]);

  // Update sort options
  const updateSort = useCallback((sort, order) => {
    const newFilters = { ...filters, sort, order };
    setFilters(newFilters);
    applyFilters(newFilters, true); // Apply immediately for sort changes
  }, [filters, applyFilters]);

  // Reset all filters
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      category: '',
      brands: [],
      tags: [],
      priceRange: { min: '', max: '' },
      rating: '',
      sort: 'created_at',
      order: 'desc'
    };

    setFilters(defaultFilters);

    router.visit(route('products.index'), {
      preserveState: true,
      preserveScroll: true,
      only: ['products', 'filters']
    });
  }, []);

  // Prefetch functionality for hover/touch
  const prefetchFilters = useCallback((filterParams) => {
    const params = buildQueryParams(filterParams);
    router.prefetch(route('products.index'), {
      data: params,
      only: ['products']
    });
  }, [buildQueryParams]);

  // Context value
  const value = {
    filters,
    setFilters,
    isApplying,
    hasActiveFilters,
    categories,
    brands,
    tags,
    updateCategory,
    updateBrands,
    updateTags,
    updatePriceRange,
    updateRating,
    updateSort,
    resetFilters,
    applyFilters,
    prefetchFilters
  };

  return (
    <FiltersContext.Provider value={value}>
      {children}
    </FiltersContext.Provider>
  );
};

export default FiltersProvider;
