import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { dataCache, apiClient, stateManager } from '@/utils/cache';
import { usePageTransition } from '@/utils/usePageTransition';
import { useOptimizedAnimations } from '@/utils/useOptimizedAnimations';

// Create a custom hook for data persistence
export function useDataPersistence(key, initialData = null) {
  const [data, setData] = React.useState(() => {
    // Try to get from cache first
    const cachedData = dataCache.get(key);
    if (cachedData) {
      return cachedData;
    }
    
    // Try to get from state manager
    const savedState = stateManager.loadState(key);
    if (savedState) {
      return savedState;
    }
    
    return initialData;
  });
  
  // Update cache and state when data changes
  useEffect(() => {
    if (data !== null) {
      dataCache.set(key, data);
      stateManager.saveState(key, data);
    }
  }, [key, data]);
  
  return [data, setData];
}

// Create a higher-order component for data persistence
export function withDataPersistence(Component, dataKeys = []) {
  return function WrappedComponent(props) {
    // Initialize animation optimizations
    usePageTransition();
    const animations = useOptimizedAnimations();
    
    // Load persisted data for each key
    const persistedData = {};
    dataKeys.forEach(key => {
      const [data, setData] = useDataPersistence(key);
      persistedData[key] = {
        data,
        setData
      };
    });
    
    // Pass persisted data and animation utilities to the component
    return (
      <Component 
        {...props} 
        persistedData={persistedData}
        animations={animations}
      />
    );
  };
}
