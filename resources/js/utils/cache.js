// Client-side caching utilities
// No service worker is used in this application

// Data caching utility
const dataCache = {
  // Cache storage
  _cache: new Map(),

  // Cache expiration times (in milliseconds)
  _expiration: new Map(),

  // Default expiration time (5 minutes)
  defaultExpiration: 5 * 60 * 1000,

  // Set item in cache with optional expiration time
  set(key, value, expiration = this.defaultExpiration) {
    this._cache.set(key, value);
    this._expiration.set(key, Date.now() + expiration);

    // Store in localStorage for persistence between page loads
    try {
      localStorage.setItem(`data_cache_${key}`, JSON.stringify({
        value,
        expiration: Date.now() + expiration
      }));
    } catch (e) {
      console.warn('Failed to store in localStorage:', e);
    }

    return value;
  },

  // Get item from cache
  get(key) {
    // Check if item exists and is not expired
    if (this._cache.has(key) && this._expiration.get(key) > Date.now()) {
      return this._cache.get(key);
    }

    // Try to get from localStorage
    try {
      const stored = localStorage.getItem(`data_cache_${key}`);
      if (stored) {
        const { value, expiration } = JSON.parse(stored);

        // Check if not expired
        if (expiration > Date.now()) {
          // Restore to memory cache
          this._cache.set(key, value);
          this._expiration.set(key, expiration);
          return value;
        } else {
          // Remove expired item
          localStorage.removeItem(`data_cache_${key}`);
        }
      }
    } catch (e) {
      console.warn('Failed to retrieve from localStorage:', e);
    }

    return null;
  },

  // Remove item from cache
  remove(key) {
    this._cache.delete(key);
    this._expiration.delete(key);
    try {
      localStorage.removeItem(`data_cache_${key}`);
    } catch (e) {
      console.warn('Failed to remove from localStorage:', e);
    }
  },

  // Clear all cache
  clear() {
    this._cache.clear();
    this._expiration.clear();

    // Clear all data cache items from localStorage
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('data_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Failed to clear localStorage:', e);
    }
  }
};

// API client with caching
const apiClient = {
  // Base fetch with caching
  async fetch(url, options = {}, cacheTime = dataCache.defaultExpiration) {
    const cacheKey = `${url}_${JSON.stringify(options)}`;

    // Try to get from cache first
    const cachedData = dataCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // If not in cache, fetch from network
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      // Cache the response
      dataCache.set(cacheKey, data, cacheTime);

      return data;
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  },

  // GET request with caching
  get(url, cacheTime) {
    return this.fetch(url, { method: 'GET' }, cacheTime);
  },

  // POST request (not cached)
  async post(url, data) {
    return this.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }, 0); // No caching for POST
  },

  // PUT request (not cached)
  async put(url, data) {
    return this.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    }, 0); // No caching for PUT
  },

  // DELETE request (not cached)
  async delete(url) {
    return this.fetch(url, {
      method: 'DELETE'
    }, 0); // No caching for DELETE
  }
};

// State persistence between page navigations
const stateManager = {
  // Save state to sessionStorage
  saveState(key, state) {
    try {
      sessionStorage.setItem(`state_${key}`, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state:', e);
    }
  },

  // Load state from sessionStorage
  loadState(key, defaultState = null) {
    try {
      const stored = sessionStorage.getItem(`state_${key}`);
      return stored ? JSON.parse(stored) : defaultState;
    } catch (e) {
      console.warn('Failed to load state:', e);
      return defaultState;
    }
  },

  // Clear state
  clearState(key) {
    try {
      sessionStorage.removeItem(`state_${key}`);
    } catch (e) {
      console.warn('Failed to clear state:', e);
    }
  }
};

// Export utilities
export { dataCache, apiClient, stateManager };
