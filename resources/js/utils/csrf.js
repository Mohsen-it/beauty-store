/**
 * Utility functions for handling CSRF tokens
 */

/**
 * Safely get the CSRF token from the meta tag
 * This function includes fallback mechanisms and error handling
 * 
 * @returns {string|null} The CSRF token or null if not found
 */
export const getCsrfToken = () => {
  try {
    // Try to get the token from the meta tag
    const metaTag = document.head.querySelector('meta[name="csrf-token"]');
    
    if (metaTag && metaTag.content) {
      return metaTag.content;
    }
    
    // Fallback: try to find it in the body if not in head
    const bodyMetaTag = document.body.querySelector('meta[name="csrf-token"]');
    
    if (bodyMetaTag && bodyMetaTag.content) {
      return bodyMetaTag.content;
    }
    
    // If we still don't have it, check if Laravel stored it in a global variable
    if (window.Laravel && window.Laravel.csrfToken) {
      return window.Laravel.csrfToken;
    }
    
    console.error('CSRF token not found. This might cause issues with form submissions and AJAX requests.');
    return null;
  } catch (error) {
    console.error('Error retrieving CSRF token:', error);
    return null;
  }
};

/**
 * Get headers for fetch API requests including CSRF token
 * 
 * @param {boolean} isJson Whether the request is JSON (default: true)
 * @returns {Object} Headers object with CSRF token
 */
export const getCsrfHeaders = (isJson = true) => {
  const headers = {};
  const token = getCsrfToken();
  
  if (token) {
    headers['X-CSRF-TOKEN'] = token;
  }
  
  if (isJson) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }
  
  headers['X-Requested-With'] = 'XMLHttpRequest';
  
  return headers;
};
