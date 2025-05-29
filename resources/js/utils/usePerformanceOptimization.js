import { useState, useEffect, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Custom hook for performance optimization based on device capabilities
 * and user preferences
 */
export function usePerformanceOptimization() {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isLowEndDevice: false,
    connectionSpeed: 'fast',
    screenSize: 'desktop'
  });

  const prefersReducedMotion = useReducedMotion();

  // Detect device capabilities
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      
      // Detect low-end devices based on hardware concurrency and memory
      const isLowEndDevice = (
        navigator.hardwareConcurrency <= 2 ||
        (navigator.deviceMemory && navigator.deviceMemory <= 2)
      );

      // Detect connection speed
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionSpeed = connection ? 
        (connection.effectiveType === '4g' ? 'fast' : 
         connection.effectiveType === '3g' ? 'medium' : 'slow') : 'fast';

      // Detect screen size
      const screenSize = window.innerWidth < 768 ? 'mobile' : 
                        window.innerWidth < 1024 ? 'tablet' : 'desktop';

      setDeviceInfo({
        isMobile,
        isLowEndDevice,
        connectionSpeed,
        screenSize
      });
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // Memoize performance settings based on device capabilities
  const performanceSettings = useMemo(() => {
    const shouldReduceAnimations = prefersReducedMotion || 
                                  deviceInfo.isLowEndDevice || 
                                  deviceInfo.connectionSpeed === 'slow';

    return {
      // Animation settings
      animations: {
        enabled: !shouldReduceAnimations,
        duration: shouldReduceAnimations ? 0.1 : (deviceInfo.isMobile ? 0.2 : 0.3),
        stagger: shouldReduceAnimations ? 0 : (deviceInfo.isMobile ? 0.02 : 0.05),
        easing: shouldReduceAnimations ? 'linear' : 'easeOut'
      },
      
      // Image loading settings
      images: {
        lazy: true,
        quality: deviceInfo.connectionSpeed === 'slow' ? 'low' : 
                deviceInfo.connectionSpeed === 'medium' ? 'medium' : 'high',
        preload: deviceInfo.connectionSpeed === 'fast' && !deviceInfo.isLowEndDevice
      },
      
      // Rendering optimizations
      rendering: {
        useVirtualization: deviceInfo.isLowEndDevice,
        batchUpdates: deviceInfo.isLowEndDevice,
        reduceReflows: deviceInfo.isMobile || deviceInfo.isLowEndDevice
      },
      
      // Touch optimizations
      touch: {
        enabled: deviceInfo.isMobile,
        fastClick: deviceInfo.isMobile,
        preventZoom: deviceInfo.isMobile
      }
    };
  }, [deviceInfo, prefersReducedMotion]);

  // Memoize optimized animation variants
  const animationVariants = useMemo(() => {
    const settings = performanceSettings.animations;
    
    return {
      container: {
        hidden: { opacity: settings.enabled ? 0 : 0.9 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: settings.stagger,
            delayChildren: settings.stagger > 0 ? 0.05 : 0,
            duration: settings.duration
          }
        }
      },
      
      item: {
        hidden: { 
          opacity: 0, 
          y: settings.enabled ? 10 : 0 
        },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            type: "tween",
            duration: settings.duration,
            ease: settings.easing
          }
        }
      },
      
      modal: {
        hidden: { 
          opacity: 0,
          scale: settings.enabled ? 0.95 : 1
        },
        show: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: settings.duration,
            ease: settings.easing
          }
        },
        exit: {
          opacity: 0,
          scale: settings.enabled ? 0.95 : 1,
          transition: {
            duration: settings.duration * 0.8,
            ease: "easeIn"
          }
        }
      }
    };
  }, [performanceSettings]);

  // Performance monitoring utilities
  const performanceUtils = useMemo(() => ({
    // Debounce function for performance-critical operations
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    // Throttle function for scroll/resize events
    throttle: (func, limit) => {
      let inThrottle;
      return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    
    // Request animation frame wrapper
    raf: (callback) => {
      if (performanceSettings.animations.enabled) {
        return requestAnimationFrame(callback);
      } else {
        return setTimeout(callback, 16); // Fallback for reduced motion
      }
    },
    
    // Cancel animation frame wrapper
    cancelRaf: (id) => {
      if (typeof id === 'number' && id > 0) {
        if (performanceSettings.animations.enabled) {
          cancelAnimationFrame(id);
        } else {
          clearTimeout(id);
        }
      }
    }
  }), [performanceSettings]);

  return {
    deviceInfo,
    performanceSettings,
    animationVariants,
    performanceUtils,
    prefersReducedMotion
  };
}

/**
 * Hook for optimized image loading based on device capabilities
 */
export function useOptimizedImageLoading() {
  const { performanceSettings } = usePerformanceOptimization();
  
  const getOptimizedImageProps = useMemo(() => (src, alt, options = {}) => {
    const { quality, preload } = performanceSettings.images;
    
    return {
      src,
      alt,
      loading: preload ? 'eager' : 'lazy',
      decoding: 'async',
      style: {
        imageRendering: quality === 'low' ? 'pixelated' : 'auto',
        ...options.style
      },
      ...options
    };
  }, [performanceSettings.images]);
  
  return { getOptimizedImageProps };
}

/**
 * Hook for optimized scroll handling
 */
export function useOptimizedScroll(callback, dependencies = []) {
  const { performanceUtils } = usePerformanceOptimization();
  
  useEffect(() => {
    const optimizedCallback = performanceUtils.throttle(callback, 16); // 60fps
    
    window.addEventListener('scroll', optimizedCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', optimizedCallback);
    };
  }, [callback, performanceUtils, ...dependencies]);
}
