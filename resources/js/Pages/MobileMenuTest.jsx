import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileMenuTest = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testResults, setTestResults] = useState({
    backdropClick: null,
    clickOutside: null,
    escapeKey: null,
    closeButton: null
  });

  // Ref for the menu panel to detect clicks outside
  const menuPanelRef = useRef(null);

  const toggleMenu = () => {
    console.log('Toggle menu clicked, current state:', mobileMenuOpen);
    // Check if menu is currently closing to prevent immediate reopening
    if (document.body.getAttribute('data-menu-closing') === 'true') {
      console.log('Menu is closing, ignoring toggle');
      return;
    }
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMenu = useCallback((testType = 'manual') => {
    console.log('Close menu called via:', testType);

    // Add a small flag to prevent immediate reopening
    document.body.setAttribute('data-menu-closing', 'true');
    setTimeout(() => {
      document.body.removeAttribute('data-menu-closing');
    }, 300);

    setMobileMenuOpen(false);

    // Update test results
    if (testType !== 'manual') {
      setTestResults(prev => ({
        ...prev,
        [testType]: 'PASSED'
      }));
    }
  }, []);

  // Handle click outside menu panel to close menu (same logic as the fixed component)
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleClickOutside = (event) => {
      // Ensure we have a valid target
      if (!event.target) return;

      // First check if this is a close button click - handle it immediately
      const isCloseButton = event.target.closest('[data-menu-close="true"]') ||
                           event.target.closest('[aria-label*="Close menu"]');
      if (isCloseButton) {
        closeMenu('closeButton');
        return;
      }

      // Check if the click is outside the menu panel
      if (menuPanelRef.current && !menuPanelRef.current.contains(event.target)) {
        // Additional check for mobile: ensure the target is not the menu toggle button
        // Look for the specific toggle button (hamburger menu button)
        const menuToggleButton = document.querySelector('[aria-label*="Open menu"], [aria-label*="Close menu"]:not([data-menu-close="true"])');
        if (menuToggleButton && menuToggleButton.contains(event.target)) {
          return; // Don't close if clicking the menu toggle button
        }

        closeMenu('clickOutside');
      }
    };

    const handleTouchOutside = (event) => {
      // Ensure we have a valid target
      if (!event.target) return;

      // First check if this is a close button touch - handle it immediately
      const isCloseButton = event.target.closest('[data-menu-close="true"]') ||
                           event.target.closest('[aria-label*="Close menu"]');
      if (isCloseButton) {
        closeMenu('closeButton');
        return;
      }

      // For touch events, we need to be more careful about event handling
      // Check if the touch is outside the menu panel
      if (menuPanelRef.current && !menuPanelRef.current.contains(event.target)) {
        // Additional check for mobile: ensure the target is not the menu toggle button
        // Look for the specific toggle button (hamburger menu button)
        const menuToggleButton = document.querySelector('[aria-label*="Open menu"], [aria-label*="Close menu"]:not([data-menu-close="true"])');
        if (menuToggleButton && menuToggleButton.contains(event.target)) {
          return; // Don't close if touching the menu toggle button
        }

        closeMenu('clickOutside');
      }
    };

    // Add event listener with a slight delay to prevent immediate closing
    // Increased delay for mobile devices to ensure proper event handling
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, { passive: true });
      document.addEventListener('touchstart', handleTouchOutside, { passive: true });
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleTouchOutside);
    };
  }, [mobileMenuOpen, closeMenu]);

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMenu('escapeKey');
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [mobileMenuOpen, closeMenu]);

  console.log('MobileMenuTest render - mobileMenuOpen:', mobileMenuOpen);

  return (
    <>
      <Head title="Mobile Menu Test" />

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl">
                  Cosmetics Store Test
                </span>
              </div>

              {/* Mobile menu button */}
              <div className="lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="p-3 bg-pink-500 text-white rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-pink-600 transition-colors"
                  aria-expanded={mobileMenuOpen}
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-[9997]">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9998] bg-black/60"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    event.stopPropagation();
                    closeMenu('backdropClick');
                  }
                }}
                onTouchStart={(event) => {
                  if (event.target === event.currentTarget) {
                    event.stopPropagation();
                    closeMenu('backdropClick');
                  }
                }}
                aria-hidden="true"
              />

              {/* Menu Panel */}
              <motion.div
                ref={menuPanelRef}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{
                  type: 'tween',
                  duration: 0.3,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="fixed inset-y-0 left-0 z-[9999] w-[85%] max-w-sm bg-white shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation menu"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="h-full flex flex-col">
                  {/* Menu header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl">
                      Test Menu
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeMenu('closeButton');
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Close menu"
                      data-menu-close="true"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Menu content */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <nav className="space-y-2">
                      <div className="text-xs uppercase text-gray-500 mb-3 font-medium tracking-wider">
                        القائمة الرئيسية
                      </div>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        الرئيسية
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        المنتجات
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        الفئات
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        من نحن
                      </a>
                      <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                        اتصل بنا
                      </a>
                    </nav>

                    {/* Auth section */}
                    <div className="border-t border-gray-200 pt-4 mt-6">
                      <div className="text-xs uppercase text-gray-500 mb-3 font-medium tracking-wider">
                        الحساب
                      </div>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                          تسجيل الدخول
                        </a>
                        <a href="#" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 min-h-[44px]">
                          إنشاء حساب
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mobile Menu Test Page</h1>
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Debug Information:</h2>
            <div className="space-y-2">
              <p>Menu State: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{mobileMenuOpen ? 'OPEN' : 'CLOSED'}</span></p>
              <p>Screen Width: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{typeof window !== 'undefined' ? window.innerWidth : 'N/A'}px</span></p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-4">Click-Outside Test Results:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p>Backdrop Click:
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-mono ${
                    testResults.backdropClick === 'PASSED' ? 'bg-green-100 text-green-800' :
                    testResults.backdropClick === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {testResults.backdropClick || 'NOT TESTED'}
                  </span>
                </p>
                <p>Click Outside:
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-mono ${
                    testResults.clickOutside === 'PASSED' ? 'bg-green-100 text-green-800' :
                    testResults.clickOutside === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {testResults.clickOutside || 'NOT TESTED'}
                  </span>
                </p>
              </div>
              <div className="space-y-2">
                <p>Escape Key:
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-mono ${
                    testResults.escapeKey === 'PASSED' ? 'bg-green-100 text-green-800' :
                    testResults.escapeKey === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {testResults.escapeKey || 'NOT TESTED'}
                  </span>
                </p>
                <p>Close Button:
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-mono ${
                    testResults.closeButton === 'PASSED' ? 'bg-green-100 text-green-800' :
                    testResults.closeButton === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {testResults.closeButton || 'NOT TESTED'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setTestResults({ backdropClick: null, clickOutside: null, escapeKey: null, closeButton: null })}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
            >
              Reset Test Results
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click the hamburger menu button to open the menu</li>
              <li>Test backdrop click: Click on the dark area outside the menu panel</li>
              <li>Test click outside: Click anywhere outside the menu panel (not just backdrop)</li>
              <li>Test escape key: Press the Escape key while menu is open</li>
              <li>Test close button: Click the X button in the menu header</li>
              <li>Check that all tests show "PASSED" status above</li>
            </ol>

            <div className="flex gap-4">
              <button
                onClick={toggleMenu}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(true);
                  setTimeout(() => {
                    // Simulate click outside after menu opens
                    const outsideElement = document.querySelector('main');
                    if (outsideElement) {
                      outsideElement.click();
                    }
                  }, 200);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
              >
                Auto Test Click Outside
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MobileMenuTest;
