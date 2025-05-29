// Import critical CSS files immediately
import '../css/app.css';
import '../css/responsive.css';
import '../css/mobile-first.css';
import '../css/enhanced-products.css';

// Load page-specific CSS based on current route
const loadPageSpecificStyles = () => {
  const currentPath = window.location.pathname;

  // Load styles immediately for current page
  if (currentPath.includes('/products') || currentPath === '/') {
    import('../css/category-circles.css');
    import('../css/mobile-products.css');
    import('../css/enhanced-filters.css');
  }

  // Load other styles with slight delay
  setTimeout(() => {
    import('../css/transitions.css');
    import('../css/animations.css');
    import('../css/product-page.css');
    import('../css/rtl.css');
  }, 100);
};

// Load page-specific styles immediately
if (typeof window !== 'undefined') {
  // Load immediately on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPageSpecificStyles);
  } else {
    loadPageSpecificStyles();
  }
}

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { initPerformanceMonitoring } from './utils/performanceMonitoring';
import React, { Suspense, useEffect, useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

const appName = import.meta.env.VITE_APP_NAME || 'Cosmetics Store';

// Loading UI during page transitions
const LoadingUI = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3">
      <svg className="animate-spin h-5 w-5 text-pink-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="text-gray-800 dark:text-white">Loading...</span>
    </div>
  </div>
);

// Update notification component has been removed

// Main app setup function
const setupApp = ({ el, App, props }) => {
  const root = createRoot(el);

  // Store localization data in window._shared for access outside of React components
  if (props.initialPage && props.initialPage.props && props.initialPage.props.localeData) {
    window._shared = window._shared || {};
    window._shared.localeData = props.initialPage.props.localeData;
  }

  function MainApp() {
    // Performance optimization: Memoize locale data to prevent unnecessary re-renders
    const localeData = useMemo(() => {
      return props.initialPage?.props?.localeData;
    }, [props.initialPage?.props?.localeData]);

    useEffect(() => {
      // Update shared data when props change
      if (localeData) {
        window._shared = window._shared || {};
        window._shared.localeData = localeData;
      }

      // Register service worker for offline capabilities
      if ('serviceWorker' in navigator && !import.meta.env.DEV) {
        // Only register in production to avoid interfering with HMR in development
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/serviceWorker.js')
            .then(registration => {
              console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
              console.error('Service Worker registration failed:', error);
            });
        });
      } else if ('serviceWorker' in navigator && import.meta.env.DEV) {
        // In development, unregister any existing service workers to prevent caching issues
        navigator.serviceWorker.getRegistrations().then(registrations => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      }
    }, [props.initialPage]);

    // Language is now handled by the CinematicLayout component

    return (
      <Suspense fallback={<LoadingUI />}>
        <App {...props} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }} />

      </Suspense>
    );
  }

  root.render(<MainApp />);

  if (import.meta.env.DEV) {
    initPerformanceMonitoring();
  }

  const authUser = props.initialPage.props.auth ? props.initialPage.props.auth.user : null;
  const isAuthenticated = !!authUser;
  const isAdmin = isAuthenticated && authUser.is_admin;
  prefetchCriticalChunks(isAuthenticated, isAdmin);
};

// Preload chunks for critical paths (assuming this function is defined elsewhere or here)
const prefetchCriticalChunks = (isAuthenticated, isAdmin) => {
  const routesToPrefetch = [];
  if (!isAdmin) {
    routesToPrefetch.push('products.index');
  }
  if (isAuthenticated && !isAdmin) {
    routesToPrefetch.push('cart.index');
    routesToPrefetch.push('checkout');
  }
  if (routesToPrefetch.length > 0 && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      routesToPrefetch.forEach(routeName => {
        try {
          const href = route(routeName);
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = href;
          link.as = 'document';
          document.head.appendChild(link);
        } catch (e) {
          console.warn(`Failed to generate or prefetch route: ${routeName}`, e);
        }
      });
    });
  }
};

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: false });
    return resolvePageComponent(`./Pages/${name}.jsx`, pages);
  },
  setup: setupApp, // Use the modified setup function
  progress: {
    color: '#E11D48',
    showSpinner: true,
    delay: 250,
  },
  cache: (page) => {
    if (page.component.startsWith('Admin/') ||
        page.component.includes('Cart') ||
        page.component.includes('Checkout')) {
      return false;
    }
    return { maxAge: 5 * 60 * 1000 };
  },
});

