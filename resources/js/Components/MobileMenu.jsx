import React, { memo, useCallback, useMemo, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { t } from '@/utils/translate';
import { usePerformanceOptimization } from '@/utils/usePerformanceOptimization';

const MobileMenu = memo(({
  isOpen,
  onClose,
  auth,
  isAdmin,
  handleLogout,
  rtl,
  menuSwipeHandlers
}) => {
  // Performance optimization hooks
  const { animationVariants, performanceSettings } = usePerformanceOptimization();
  const prefersReducedMotion = useReducedMotion();

  // Ref for the menu panel to detect clicks outside
  const menuPanelRef = useRef(null);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Memoize close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle click outside menu panel to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Check if the click is outside the menu panel
      if (menuPanelRef.current && !menuPanelRef.current.contains(event.target)) {
        handleClose();
      }
    };

    // Add event listener with a slight delay to prevent immediate closing
    // when the menu is just opened by a button click
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }, 150);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, handleClose]);

  // Backdrop click handler - ensures clicking outside the menu closes it
  const handleBackdropClick = useCallback((event) => {
    // Only close if clicking directly on the backdrop, not on child elements
    if (event.target === event.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  // Handle menu panel click to prevent closing
  const handleMenuClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // Memoize logout handler
  const handleLogoutClick = useCallback(() => {
    handleLogout();
    handleClose();
  }, [handleLogout, handleClose]);

  // Memoize optimized animation variants
  const optimizedAnimations = useMemo(() => ({
    backdrop: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: {
        duration: prefersReducedMotion ? 0.1 : (performanceSettings.animations.duration * 0.8)
      }
    },
    panel: {
      initial: { x: rtl ? '100%' : '-100%' },
      animate: { x: 0 },
      exit: { x: rtl ? '100%' : '-100%' },
      transition: {
        type: 'tween',
        duration: prefersReducedMotion ? 0.1 : performanceSettings.animations.duration,
        ease: performanceSettings.animations.easing
      }
    }
  }), [rtl, prefersReducedMotion, performanceSettings]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-[998]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[998] bg-black/60 dark:bg-black/80"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Menu panel with animation */}
          <motion.div
            ref={menuPanelRef}
            {...optimizedAnimations.panel}
            className={`fixed top-0 bottom-0 ${rtl ? 'right-0' : 'left-0'} z-[999] w-[75%] sm:w-[70%] max-w-sm h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-2xl border-r border-gray-200/50 dark:border-gray-700/50 performance-modal mobile-layout`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            {...menuSwipeHandlers}
            onClick={handleMenuClick}
          >
          <div className="h-full flex flex-col">
            {/* Menu header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 min-h-[80px] shadow-sm">
              <Link href="/" className="flex items-center group" onClick={handleClose}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18V9h6v9h-6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg sm:text-xl tracking-tight">
                    {t('app.name')}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleClose}
                className="p-2 rounded-xl text-gray-500 hover:text-pink-600 hover:bg-white/80 dark:hover:bg-gray-600/50 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-sm hover:shadow-md"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <nav className="space-y-2 mb-8">
                <div className="flex items-center space-x-2 text-xs uppercase text-gray-500 dark:text-gray-400 mb-4 font-medium tracking-wider px-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{t('navigation.main_menu')}</span>
                </div>

                <div className="bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-xl p-3 space-y-1">
                  <Link
                    href={route('home')}
                    onClick={handleClose}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group min-h-[44px] ${
                      route().current('home')
                        ? 'bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800/40 dark:to-purple-800/40 text-pink-800 dark:text-pink-200 shadow-sm'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20'
                    }`}
                  >
                    <svg className="w-5 h-5 text-pink-500 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="font-medium">{t('navigation.home')}</span>
                  </Link>

                  <Link
                    href={route('products.index')}
                    onClick={handleClose}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group min-h-[44px] ${
                      route().current('products.index')
                        ? 'bg-gradient-to-r from-pink-200 to-purple-200 dark:from-pink-800/40 dark:to-purple-800/40 text-purple-800 dark:text-purple-200 shadow-sm'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20'
                    }`}
                  >
                    <svg className="w-5 h-5 text-purple-500 group-hover:text-purple-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 18V9h6v9h-6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{t('navigation.products')}</span>
                  </Link>
                </div>

                {/* Categories Section */}
                <div className="mt-6">
                  <div className="flex items-center space-x-2 text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider px-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    <span>{t('navigation.categories')}</span>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50/50 to-pink-50/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-xl p-3 space-y-1">
                    <Link
                      href={route('categories.skincare')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('categories.skincare')
                          ? 'bg-gradient-to-r from-green-200 to-teal-200 dark:from-green-800/40 dark:to-teal-800/40 text-green-800 dark:text-green-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-teal-100 dark:hover:from-green-900/20 dark:hover:to-teal-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15.586 13H14a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.skincare')}</span>
                    </Link>

                    <Link
                      href={route('categories.makeup')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('categories.makeup')
                          ? 'bg-gradient-to-r from-pink-200 to-rose-200 dark:from-pink-800/40 dark:to-rose-800/40 text-pink-800 dark:text-pink-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/20 dark:hover:to-rose-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-pink-500 group-hover:text-pink-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.makeup')}</span>
                    </Link>

                    <Link
                      href={route('categories.haircare')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('categories.haircare')
                          ? 'bg-gradient-to-r from-amber-200 to-orange-200 dark:from-amber-800/40 dark:to-orange-800/40 text-amber-800 dark:text-amber-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-amber-500 group-hover:text-amber-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.haircare')}</span>
                    </Link>

                    <Link
                      href={route('categories.fragrance')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('categories.fragrance')
                          ? 'bg-gradient-to-r from-violet-200 to-purple-200 dark:from-violet-800/40 dark:to-purple-800/40 text-violet-800 dark:text-violet-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-violet-500 group-hover:text-violet-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.fragrance')}</span>
                    </Link>
                  </div>
                </div>
              </nav>

              {/* Auth section */}
              {auth.user ? (
                <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-6 mt-6">
                  <div className="flex items-center space-x-2 text-xs uppercase text-gray-500 dark:text-gray-400 mb-4 font-medium tracking-wider px-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span>{t('auth.account')}</span>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-xl p-3 space-y-1">
                    <Link
                      href={route('profile.edit')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('profile.edit')
                          ? 'bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-800/40 dark:to-indigo-800/40 text-blue-800 dark:text-blue-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.profile')}</span>
                    </Link>

                    <Link
                      href={route('orders.index')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('orders.index')
                          ? 'bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800/40 dark:to-teal-800/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-emerald-500 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.orders')}</span>
                    </Link>

                    <Link
                      href={route('favorites.index')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('favorites.index')
                          ? 'bg-gradient-to-r from-red-200 to-pink-200 dark:from-red-800/40 dark:to-pink-800/40 text-red-800 dark:text-red-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/20 dark:hover:to-pink-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.favorites')}</span>
                    </Link>

                    <Link
                      href={route('cart.index')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('cart.index')
                          ? 'bg-gradient-to-r from-orange-200 to-amber-200 dark:from-orange-800/40 dark:to-amber-800/40 text-orange-800 dark:text-orange-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/20 dark:hover:to-amber-900/20'
                      }`}
                    >
                      <svg className="w-4 h-4 text-orange-500 group-hover:text-orange-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-sm font-medium">{t('navigation.cart')}</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        handleClose();
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-700/50 dark:hover:to-slate-700/50 transition-all duration-200 group min-h-[44px]"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium">{t('auth.logout')}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200/60 dark:border-gray-700/60 pt-6 mt-6">
                  <div className="flex items-center space-x-2 text-xs uppercase text-gray-500 dark:text-gray-400 mb-4 font-medium tracking-wider px-3">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                    </svg>
                    <span>{t('auth.account')}</span>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-xl p-3 space-y-1">
                    <Link
                      href={route('login')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('login')
                          ? 'bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-800/40 dark:to-blue-800/40 text-cyan-800 dark:text-cyan-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 dark:hover:from-cyan-900/20 dark:hover:to-blue-900/20'
                      }`}
                    >
                      <svg className="w-5 h-5 text-cyan-500 group-hover:text-cyan-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{t('auth.login')}</span>
                    </Link>

                    <Link
                      href={route('register')}
                      onClick={handleClose}
                      className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group min-h-[44px] ${
                        route().current('register')
                          ? 'bg-gradient-to-r from-emerald-200 to-green-200 dark:from-emerald-800/40 dark:to-green-800/40 text-emerald-800 dark:text-emerald-200 shadow-sm'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/20 dark:hover:to-green-900/20'
                      }`}
                    >
                      <svg className="w-5 h-5 text-emerald-500 group-hover:text-emerald-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      <span className="font-medium">{t('auth.register')}</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className="pt-6 mt-6 border-t border-gray-200/60 dark:border-gray-700/60">
                <div className="flex items-center space-x-2 text-xs uppercase text-gray-500 dark:text-gray-400 mb-4 font-medium tracking-wider px-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span>{t('common.settings')}</span>
                </div>

                <div className="bg-gradient-to-br from-slate-50/50 to-gray-50/50 dark:from-gray-800/30 dark:to-gray-700/30 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/30 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('common.dark_mode')}
                      </span>
                    </div>
                    <DarkModeToggle />
                  </div>

                  <div className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-white/60 dark:hover:bg-gray-600/30 transition-colors duration-200">
                    <div className="flex items-center space-x-3">
                      <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('common.language')}
                      </span>
                    </div>
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

MobileMenu.displayName = 'MobileMenu';

export default MobileMenu;
