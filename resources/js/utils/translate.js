import { usePage } from '@inertiajs/react';

// Create a function to safely get translation data without using hooks directly
function getTranslationData() {
  try {
    // This is safe to call outside of components when window._shared exists
    if (window._shared && window._shared.localeData) {
      return window._shared.localeData;
    }

    // Fallback to using usePage() if we're in a component context
    if (typeof usePage === 'function') {
      try {
        const page = usePage();
        if (page && page.props && page.props.localeData) {
          return page.props.localeData;
        }
      } catch (e) {
        // usePage() was called in an invalid context, ignore and use fallback
      }
    }

    // Default fallback
    return { data: {}, languageCode: 'en' };
  } catch (error) {
    console.error('Error getting translation data:', error);
    return { data: {}, languageCode: 'en' };
  }
}

/**
 * Get a translation from the localization data
 *
 * @param {string} key - Dot notation key for the translation (e.g., 'navigation.home')
 * @param {object} replacements - Optional replacements for variables in the translation
 * @returns {string} - The translated string or the key if translation not found
 */
export function t(key, replacements = {}) {
  try {
    // Get the localization data safely
    const localeData = getTranslationData();

    if (!localeData || !localeData.data) {
      console.warn('Translation data not available');
      return key;
    }

    // Split the key by dots to navigate the nested object
    const parts = key.split('.');
    let translation = localeData.data;

    // Navigate through the nested object
    for (const part of parts) {
      if (translation[part] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      translation = translation[part];
    }

    // If the translation is not a string, return the key
    if (typeof translation !== 'string') {
      console.warn(`Translation for key ${key} is not a string`);
      return key;
    }

    // Replace variables in the translation
    if (Object.keys(replacements).length > 0) {
      return Object.entries(replacements).reduce(
        (str, [key, value]) => str.replace(new RegExp(`:${key}`, 'g'), value),
        translation
      );
    }

    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return key;
  }
}

/**
 * Get the current language code
 *
 * @returns {string} - The current language code (e.g., 'en', 'ar')
 */
export function getCurrentLanguage() {
  const localeData = getTranslationData();
  return localeData?.languageCode || 'en';
}

/**
 * Check if the current language is RTL
 *
 * @returns {boolean} - True if the current language is RTL
 */
export function isRtl() {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(getCurrentLanguage());
}

// Create a hook version of the translation function for use in components
export function useTranslation() {
  // This is safe to use in components
  const { localeData } = usePage().props;

  return {
    t: (key, replacements = {}) => t(key, replacements),
    getCurrentLanguage: () => localeData?.languageCode || 'en',
    isRtl: () => {
      const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
      return rtlLanguages.includes(localeData?.languageCode || 'en');
    }
  };
}

export default { t, getCurrentLanguage, isRtl, useTranslation };
