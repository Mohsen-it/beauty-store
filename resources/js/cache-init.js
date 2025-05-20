// Add this to the head of your app.blade.php or similar file
// This file initializes client-side caching utilities

// Import cache utilities
import { dataCache, apiClient, stateManager } from './utils/cache';

// Make cache utilities available globally
window.dataCache = dataCache;
window.apiClient = apiClient;
window.stateManager = stateManager;

// Initialize cache for common data
document.addEventListener('DOMContentLoaded', async () => {
  // Prefetch and cache common data
  try {
    // Cache categories for 1 hour (they rarely change)
    if (!dataCache.get('categories')) {
      const categories = await apiClient.get('/api/categories', 60 * 60 * 1000);
      console.log('Categories cached successfully');
    }

    // Cache featured products for 30 minutes
    if (!dataCache.get('featuredProducts')) {
      const featured = await apiClient.get('/api/products/featured', 30 * 60 * 1000);
      console.log('Featured products cached successfully');
    }
  } catch (error) {
    console.error('Error initializing cache:', error);
  }
});

// Add event listener for page navigation to save scroll position
window.addEventListener('beforeunload', () => {
  // Save current scroll position
  stateManager.saveState('scrollPosition', window.scrollY);

  // Save other important state information
  const currentPath = window.location.pathname;
  stateManager.saveState('lastPath', currentPath);
});

// Restore scroll position when navigating back
window.addEventListener('DOMContentLoaded', () => {
  // Check if we're navigating back
  const lastPath = stateManager.loadState('lastPath');
  const currentPath = window.location.pathname;

  if (lastPath === currentPath) {
    // Restore scroll position
    const scrollPosition = stateManager.loadState('scrollPosition', 0);
    setTimeout(() => {
      window.scrollTo(0, scrollPosition);
    }, 100);
  }
});

// Add cache control headers for static assets
const addCacheControlHeaders = () => {
  // This is just for reference - actual headers should be set on the server
  // For Laravel, you can add these in .htaccess or in a middleware
  /*
  Cache-Control: public, max-age=31536000, immutable (for versioned assets)
  Cache-Control: public, max-age=86400 (for other static assets)
  Cache-Control: no-cache, must-revalidate (for HTML and dynamic content)
  */
};
