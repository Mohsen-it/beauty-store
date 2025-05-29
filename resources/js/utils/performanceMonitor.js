/**
 * Performance monitoring utilities for the beauty store application
 * Provides comprehensive performance tracking and optimization insights
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isEnabled = process.env.NODE_ENV === 'development' || 
                    localStorage.getItem('performance-monitoring') === 'true';
    
    if (this.isEnabled) {
      this.initializeObservers();
    }
  }

  /**
   * Initialize performance observers
   */
  initializeObservers() {
    // Performance Observer for navigation timing
    if ('PerformanceObserver' in window) {
      try {
        const navObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.recordMetric('navigation', {
              type: entry.entryType,
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });
        navObserver.observe({ entryTypes: ['navigation'] });
        this.observers.set('navigation', navObserver);

        // Performance Observer for resource timing
        const resourceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.initiatorType === 'img' || entry.initiatorType === 'script') {
              this.recordMetric('resource', {
                type: entry.initiatorType,
                name: entry.name,
                duration: entry.duration,
                transferSize: entry.transferSize
              });
            }
          }
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);

        // Performance Observer for layout shifts
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              this.recordMetric('cls', {
                value: entry.value,
                startTime: entry.startTime,
                sources: entry.sources
              });
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);

        // Performance Observer for largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric('lcp', {
            value: lastEntry.startTime,
            element: lastEntry.element?.tagName,
            url: lastEntry.url
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);

      } catch (error) {
        console.warn('Performance monitoring setup failed:', error);
      }
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(category, data) {
    if (!this.isEnabled) return;

    const timestamp = performance.now();
    const metric = {
      ...data,
      timestamp,
      category
    };

    if (!this.metrics.has(category)) {
      this.metrics.set(category, []);
    }
    
    this.metrics.get(category).push(metric);
    
    // Keep only last 100 entries per category to prevent memory leaks
    const categoryMetrics = this.metrics.get(category);
    if (categoryMetrics.length > 100) {
      categoryMetrics.splice(0, categoryMetrics.length - 100);
    }
  }

  /**
   * Measure component render time
   */
  measureComponentRender(componentName, renderFunction) {
    if (!this.isEnabled) return renderFunction();

    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    this.recordMetric('component-render', {
      component: componentName,
      duration: endTime - startTime
    });

    return result;
  }

  /**
   * Measure animation performance
   */
  measureAnimation(animationName, animationFunction) {
    if (!this.isEnabled) return animationFunction();

    const startTime = performance.now();
    let frameCount = 0;
    let lastFrameTime = startTime;

    const measureFrame = () => {
      const currentTime = performance.now();
      const frameDuration = currentTime - lastFrameTime;
      frameCount++;
      lastFrameTime = currentTime;

      if (frameDuration > 16.67) { // More than 60fps threshold
        this.recordMetric('animation-frame-drop', {
          animation: animationName,
          frameDuration,
          frameNumber: frameCount
        });
      }
    };

    // Override requestAnimationFrame for this animation
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (callback) => {
      return originalRAF(() => {
        measureFrame();
        callback();
      });
    };

    const result = animationFunction();
    
    // Restore original requestAnimationFrame
    window.requestAnimationFrame = originalRAF;

    const totalDuration = performance.now() - startTime;
    this.recordMetric('animation-complete', {
      animation: animationName,
      duration: totalDuration,
      frameCount,
      averageFPS: frameCount / (totalDuration / 1000)
    });

    return result;
  }

  /**
   * Get performance report
   */
  getPerformanceReport() {
    if (!this.isEnabled) return null;

    const report = {
      timestamp: new Date().toISOString(),
      metrics: {},
      summary: {}
    };

    // Process metrics by category
    for (const [category, metrics] of this.metrics.entries()) {
      report.metrics[category] = metrics;
      
      // Calculate summary statistics
      if (metrics.length > 0) {
        const durations = metrics.map(m => m.duration).filter(d => d !== undefined);
        if (durations.length > 0) {
          report.summary[category] = {
            count: metrics.length,
            averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
            maxDuration: Math.max(...durations),
            minDuration: Math.min(...durations)
          };
        }
      }
    }

    // Calculate Core Web Vitals
    const lcpMetrics = this.metrics.get('lcp') || [];
    const clsMetrics = this.metrics.get('cls') || [];
    
    if (lcpMetrics.length > 0) {
      const latestLCP = lcpMetrics[lcpMetrics.length - 1];
      report.summary.coreWebVitals = {
        lcp: latestLCP.value,
        lcpGrade: latestLCP.value < 2500 ? 'good' : latestLCP.value < 4000 ? 'needs-improvement' : 'poor'
      };
    }

    if (clsMetrics.length > 0) {
      const totalCLS = clsMetrics.reduce((sum, metric) => sum + metric.value, 0);
      report.summary.coreWebVitals = {
        ...report.summary.coreWebVitals,
        cls: totalCLS,
        clsGrade: totalCLS < 0.1 ? 'good' : totalCLS < 0.25 ? 'needs-improvement' : 'poor'
      };
    }

    return report;
  }

  /**
   * Log performance report to console
   */
  logPerformanceReport() {
    if (!this.isEnabled) return;

    const report = this.getPerformanceReport();
    if (report) {
      console.group('🚀 Performance Report');
      console.table(report.summary);
      
      if (report.summary.coreWebVitals) {
        console.group('📊 Core Web Vitals');
        console.table(report.summary.coreWebVitals);
        console.groupEnd();
      }
      
      console.groupEnd();
    }
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
   * Disable performance monitoring
   */
  disable() {
    this.isEnabled = false;
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
  }

  /**
   * Enable performance monitoring
   */
  enable() {
    this.isEnabled = true;
    this.initializeObservers();
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export utilities
export default performanceMonitor;

export const measureComponentRender = (componentName, renderFunction) => 
  performanceMonitor.measureComponentRender(componentName, renderFunction);

export const measureAnimation = (animationName, animationFunction) => 
  performanceMonitor.measureAnimation(animationName, animationFunction);

export const getPerformanceReport = () => 
  performanceMonitor.getPerformanceReport();

export const logPerformanceReport = () => 
  performanceMonitor.logPerformanceReport();

// Auto-log performance report every 30 seconds in development
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    performanceMonitor.logPerformanceReport();
  }, 30000);
}
