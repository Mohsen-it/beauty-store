import { useEffect } from 'react';
import { fadeTransition, slideTransition } from './transitions';

// Custom hook for optimized animations with caching
export function useOptimizedAnimations() {
  useEffect(() => {
    // Create a cache for animation states
    if (!window.animationCache) {
      window.animationCache = new Map();
    }
    
    // Function to cache animation state
    const cacheAnimationState = (key, state) => {
      window.animationCache.set(key, state);
    };
    
    // Function to get cached animation state
    const getCachedAnimationState = (key) => {
      return window.animationCache.get(key);
    };
    
    // Add event listeners for page navigation
    const handleBeforeNavigate = () => {
      // Cache current scroll position and visible elements
      cacheAnimationState('scrollPosition', window.scrollY);
      
      // Cache positions of important elements
      document.querySelectorAll('[data-animation-cache]').forEach(el => {
        const id = el.dataset.animationCache;
        const rect = el.getBoundingClientRect();
        cacheAnimationState(`element-${id}`, {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        });
      });
    };
    
    // Add event listeners
    document.addEventListener('inertia:before', handleBeforeNavigate);
    
    // Clean up
    return () => {
      document.removeEventListener('inertia:before', handleBeforeNavigate);
    };
  }, []);
  
  // Return animation utilities
  return {
    fadeTransition,
    slideTransition,
    getCachedPosition: (id) => {
      if (window.animationCache) {
        return window.animationCache.get(`element-${id}`);
      }
      return null;
    }
  };
}
