// Performance monitoring script
// This script will monitor and log performance metrics for the application

/**
 * This utility helps monitor the performance of the application
 * and logs metrics that can be used to verify improvements.
 */

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  // Create a performance observer to monitor navigation timing
  const navigationObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    // entries.forEach((entry) => {
    //   // Log navigation timing metrics
    //   console.log('Navigation Performance:', {
    //     page: window.location.pathname,
    //     type: entry.entryType,
    //     startTime: entry.startTime,
    //     duration: entry.duration,
    //     domInteractive: entry.domInteractive,
    //     domComplete: entry.domComplete,
    //     loadEventEnd: entry.loadEventEnd,
    //   });
      
    //   // Store metrics in localStorage for comparison
    //   storePerformanceMetric('navigation', {
    //     page: window.location.pathname,
    //     timestamp: Date.now(),
    //     duration: entry.duration,
    //     domInteractive: entry.domInteractive,
    //     domComplete: entry.domComplete,
    //   });
    // });
  });

  // Create a performance observer to monitor resource timing
  const resourceObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    
    // Group resources by type
    const resources = entries.reduce((acc, entry) => {
      const type = getResourceType(entry.name);
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize,
      });
      return acc;
    }, {});
    
    // Log resource timing metrics
    // console.log('Resource Performance:', resources);
    
    // Store metrics in localStorage for comparison
    storePerformanceMetric('resources', {
      page: window.location.pathname,
      timestamp: Date.now(),
      resourceCounts: Object.keys(resources).reduce((acc, type) => {
        acc[type] = resources[type].length;
        return acc;
      }, {}),
      totalSize: Object.values(resources).flat().reduce((total, resource) => total + (resource.size || 0), 0),
      totalDuration: Object.values(resources).flat().reduce((total, resource) => total + resource.duration, 0),
    });
  });

  // Create a performance observer to monitor paint timing
  const paintObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      // Log paint timing metrics
      // console.log('Paint Performance:', {
      //   page: window.location.pathname,
      //   type: entry.name,
      //   startTime: entry.startTime,
      // });
      
      // Store metrics in localStorage for comparison
      storePerformanceMetric('paint', {
        page: window.location.pathname,
        timestamp: Date.now(),
        type: entry.name,
        startTime: entry.startTime,
      });
    });
  });

  // Start observing different performance entry types
  try {
    navigationObserver.observe({ type: 'navigation', buffered: true });
    resourceObserver.observe({ type: 'resource', buffered: true });
    paintObserver.observe({ type: 'paint', buffered: true });
    
    // console.log('Performance monitoring initialized');
  } catch (error) {
    // console.error('Error initializing performance monitoring:', error);
  }
  
  // Monitor page transitions
  document.addEventListener('inertia:start', () => {
    window.transitionStartTime = performance.now();
  });
  
  document.addEventListener('inertia:finish', () => {
    if (window.transitionStartTime) {
      const duration = performance.now() - window.transitionStartTime;
      
      // Log page transition timing
      // console.log('Page Transition Performance:'
      //   , {
      //   from: window.previousPath || 'unknown',
      //   to: window.location.pathname,
      //   duration,
      // });
      
      // Store metrics in localStorage for comparison
      storePerformanceMetric('transition', {
        from: window.previousPath || 'unknown',
        to: window.location.pathname,
        timestamp: Date.now(),
        duration,
      });
      
      window.previousPath = window.location.pathname;
    }
  });
  
  // Return cleanup function
  return () => {
    navigationObserver.disconnect();
    resourceObserver.disconnect();
    paintObserver.disconnect();
  };
}

// Helper function to determine resource type from URL
function getResourceType(url) {
  if (url.match(/\.(css)/i)) return 'css';
  if (url.match(/\.(js)/i)) return 'javascript';
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)/i)) return 'image';
  if (url.match(/\.(woff|woff2|ttf|otf)/i)) return 'font';
  if (url.match(/\.(json)/i)) return 'json';
  if (url.match(/api\//i)) return 'api';
  return 'other';
}

// Store performance metrics in localStorage
function storePerformanceMetric(type, data) {
  try {
    // Get existing metrics
    const metricsKey = `performance_metrics_${type}`;
    const existingMetrics = JSON.parse(localStorage.getItem(metricsKey) || '[]');
    
    // Add new metric
    existingMetrics.push(data);
    
    // Keep only the last 50 metrics to avoid localStorage limits
    const trimmedMetrics = existingMetrics.slice(-50);
    
    // Save back to localStorage
    localStorage.setItem(metricsKey, JSON.stringify(trimmedMetrics));
  } catch (error) {
    // console.error('Error storing performance metric:', error);
  }
}

// Get performance metrics from localStorage
export function getPerformanceMetrics(type) {
  try {
    const metricsKey = `performance_metrics_${type}`;
    return JSON.parse(localStorage.getItem(metricsKey) || '[]');
  } catch (error) {
    // console.error('Error getting performance metrics:', error);
    return [];
  }
}

// Generate performance report
export function generatePerformanceReport() {
  const navigationMetrics = getPerformanceMetrics('navigation');
  const resourceMetrics = getPerformanceMetrics('resources');
  const paintMetrics = getPerformanceMetrics('paint');
  const transitionMetrics = getPerformanceMetrics('transition');
  
  // Calculate average navigation time
  const avgNavigationTime = navigationMetrics.length > 0
    ? navigationMetrics.reduce((sum, metric) => sum + metric.duration, 0) / navigationMetrics.length
    : 0;
  
  // Calculate average transition time
  const avgTransitionTime = transitionMetrics.length > 0
    ? transitionMetrics.reduce((sum, metric) => sum + metric.duration, 0) / transitionMetrics.length
    : 0;
  
  // Calculate average first paint time
  const firstPaintMetrics = paintMetrics.filter(metric => metric.type === 'first-paint');
  const avgFirstPaintTime = firstPaintMetrics.length > 0
    ? firstPaintMetrics.reduce((sum, metric) => sum + metric.startTime, 0) / firstPaintMetrics.length
    : 0;
  
  // Calculate average content paint time
  const contentPaintMetrics = paintMetrics.filter(metric => metric.type === 'first-contentful-paint');
  const avgContentPaintTime = contentPaintMetrics.length > 0
    ? contentPaintMetrics.reduce((sum, metric) => sum + metric.startTime, 0) / contentPaintMetrics.length
    : 0;
  
  // Generate report
  return {
    timestamp: Date.now(),
    metrics: {
      navigation: {
        average: avgNavigationTime,
        samples: navigationMetrics.length,
      },
      transition: {
        average: avgTransitionTime,
        samples: transitionMetrics.length,
      },
      paint: {
        firstPaint: avgFirstPaintTime,
        contentfulPaint: avgContentPaintTime,
        samples: firstPaintMetrics.length,
      },
      resources: {
        samples: resourceMetrics.length,
      },
    },
    rawData: {
      navigation: navigationMetrics,
      resources: resourceMetrics,
      paint: paintMetrics,
      transition: transitionMetrics,
    },
  };
}

// Clear all performance metrics
export function clearPerformanceMetrics() {
  try {
    localStorage.removeItem('performance_metrics_navigation');
    localStorage.removeItem('performance_metrics_resources');
    localStorage.removeItem('performance_metrics_paint');
    localStorage.removeItem('performance_metrics_transition');
    // console.log('Performance metrics cleared');
  } catch (error) {
    // console.error('Error clearing performance metrics:', error);
  }
}
