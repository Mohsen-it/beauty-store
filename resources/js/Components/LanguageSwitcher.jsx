import React, { useState, useEffect, useRef } from 'react';
import { router, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { getCurrentLanguage } from '@/utils/translate';

const LanguageSwitcher = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLanguage = getCurrentLanguage();

  // Define available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  // Find the current language object
  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  // Handle language change
  const changeLanguage = (languageCode) => {
    // Close the dropdown
    setIsOpen(false);

    // Only make the request if the language is different
    if (languageCode !== currentLanguage) {
      // Make a POST request to change the language
      router.post(route('language.change'), {
        language: languageCode
      }, {
        preserveScroll: true,
        onSuccess: () => {
          // Reload the page to apply the new language
          window.location.reload();
        }
      });
    }
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden md:inline-block">{currentLang.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  language.code === currentLanguage
                    ? 'bg-gray-100 dark:bg-gray-700 text-pink-600 dark:text-pink-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                role="menuitem"
              >
                <div className="flex items-center">
                  <span className="text-lg mr-2">{language.flag}</span>
                  <span>{language.name}</span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
