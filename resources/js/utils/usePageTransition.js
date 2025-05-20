// Create a custom hook for optimized page transitions
import { useEffect } from 'react';
import { animationConfig } from './transitions';

export function usePageTransition() {
  useEffect(() => {
    // Apply performance optimizations when component mounts
    document.documentElement.classList.add('page-transition');
    
    // Cache DOM elements that will be animated
    const elementsToCache = document.querySelectorAll('.animate-on-page-change');
    const cachedElements = Array.from(elementsToCache).map(el => ({
      element: el,
      rect: el.getBoundingClientRect()
    }));
    
    // Apply hardware acceleration to improve animation performance
    cachedElements.forEach(({ element }) => {
      element.style.transform = 'translateZ(0)';
      element.style.willChange = 'transform, opacity';
    });
    
    // Clean up when component unmounts
    return () => {
      document.documentElement.classList.remove('page-transition');
      cachedElements.forEach(({ element }) => {
        element.style.willChange = 'auto';
      });
    };
  }, []);
  
  // Return animation config to be used in components
  return animationConfig;
}
