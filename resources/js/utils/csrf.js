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

    // Try to get the token from the XSRF-TOKEN cookie
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('XSRF-TOKEN=')) {
        // The cookie value is URL encoded and encrypted, so we need to decode it
        // but we'll let Laravel handle the decryption on the server side
        return cookie.substring('XSRF-TOKEN='.length);
      }
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
    // Use X-XSRF-TOKEN header if the token is from the cookie
    if (token.includes('%')) {
      headers['X-XSRF-TOKEN'] = token;
    } else {
      headers['X-CSRF-TOKEN'] = token;
    }
  }

  if (isJson) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }

  headers['X-Requested-With'] = 'XMLHttpRequest';

  return headers;
};

/**
 * Refresh the CSRF token by making a request to the CSRF cookie endpoint
 * This is useful when the token might be stale, like after logging in
 *
 * @returns {Promise<void>} A promise that resolves when the token is refreshed
 */
export const refreshCsrfToken = async () => {
  try {
    // Make a request to the CSRF cookie endpoint
    const response = await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'same-origin', // Important for cookies
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!response.ok) {
      console.error('Failed to refresh CSRF token:', response.statusText);
    }
  } catch (error) {
    console.error('Error refreshing CSRF token:', error);
  }
};
