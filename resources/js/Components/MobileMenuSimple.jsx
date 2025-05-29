import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from '@inertiajs/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { t } from '@/utils/translate';

const MobileMenuSimple = memo(({
  isOpen,
  onClose,
  auth,
  isAdmin,
  handleLogout,
  rtl
}) => {
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
    // Add a small flag to prevent immediate reopening
    document.body.setAttribute('data-menu-closing', 'true');
    setTimeout(() => {
      document.body.removeAttribute('data-menu-closing');
    }, 300);

    onClose();
  }, [onClose]);

  // Handle click outside menu panel to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      // Ensure we have a valid target
      if (!event.target) return;

      // First check if this is a close button click - handle it immediately
      const isCloseButton = event.target.closest('[data-menu-close="true"]') ||
                           event.target.closest('[aria-label*="Close menu"]');
      if (isCloseButton) {
        handleClose();
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

        handleClose();
      }
    };

    const handleTouchOutside = (event) => {
      // Ensure we have a valid target
      if (!event.target) return;

      // First check if this is a close button touch - handle it immediately
      const isCloseButton = event.target.closest('[data-menu-close="true"]') ||
                           event.target.closest('[aria-label*="Close menu"]');
      if (isCloseButton) {
        handleClose();
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

        handleClose();
      }
    };

    // Add event listener with a slight delay to prevent immediate closing
    // when the menu is just opened by a button click
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
  }, [isOpen, handleClose]);

  // Backdrop click handler - ensures clicking outside the menu closes it
  const handleBackdropClick = useCallback((event) => {
    // Only close if clicking directly on the backdrop, not on child elements
    if (event.target === event.currentTarget) {
      // Prevent event bubbling to avoid conflicts
      event.stopPropagation();
      handleClose();
    }
  }, [handleClose]);

  // Touch handler for backdrop to ensure mobile compatibility
  const handleBackdropTouch = useCallback((event) => {
    // Only close if touching directly on the backdrop, not on child elements
    if (event.target === event.currentTarget) {
      // Prevent event bubbling to avoid conflicts
      event.stopPropagation();
      handleClose();
    }
  }, [handleClose]);

  // Memoize logout handler
  const handleLogoutClick = useCallback(() => {
    handleLogout();
    onClose();
  }, [handleLogout, onClose]);

  // Memoize navigation items to prevent unnecessary re-renders
  const mainNavigationItems = useMemo(() => [
    {
      href: route('home'),
      active: route().current('home'),
      label: t('navigation.home'),
      key: 'home'
    },
    {
      href: route('products.index'),
      active: route().current('products.index'),
      label: t('navigation.products'),
      key: 'products'
    },
    {
      href: route('categories.skincare'),
      active: route().current('categories.skincare'),
      label: t('navigation.skincare'),
      key: 'skincare'
    },
    {
      href: route('categories.makeup'),
      active: route().current('categories.makeup'),
      label: t('navigation.makeup'),
      key: 'makeup'
    },
    {
      href: route('categories.haircare'),
      active: route().current('categories.haircare'),
      label: t('navigation.haircare'),
      key: 'haircare'
    },
    {
      href: route('categories.fragrance'),
      active: route().current('categories.fragrance'),
      label: t('navigation.fragrance'),
      key: 'fragrance'
    }
  ], []);

  // Memoize user navigation items
  const userNavigationItems = useMemo(() => {
    if (!auth.user) return [];

    return [
      {
        href: route('profile.edit'),
        active: route().current('profile.edit'),
        label: t('navigation.profile'),
        key: 'profile'
      },
      {
        href: route('orders.index'),
        active: route().current('orders.index'),
        label: t('navigation.orders'),
        key: 'orders'
      },
      {
        href: route('favorites.index'),
        active: route().current('favorites.index'),
        label: t('navigation.favorites'),
        key: 'favorites'
      },
      {
        href: route('cart.index'),
        active: route().current('cart.index'),
        label: t('navigation.cart'),
        key: 'cart'
      }
    ];
  }, [auth.user]);

  // Memoize guest navigation items
  const guestNavigationItems = useMemo(() => {
    if (auth.user) return [];

    return [
      {
        href: route('login'),
        active: route().current('login'),
        label: t('auth.login'),
        key: 'login'
      },
      {
        href: route('register'),
        active: route().current('register'),
        label: t('auth.register'),
        key: 'register'
      }
    ];
  }, [auth.user]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[998]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998] bg-black/60 dark:bg-black/80"
        onClick={handleBackdropClick}
        onTouchStart={handleBackdropTouch}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        ref={menuPanelRef}
        className={`fixed inset-y-0 ${rtl ? 'right-0' : 'left-0'} z-[999] w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{
          minHeight: '100vh',
          maxHeight: '100vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col">
          {/* Menu header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <Link href="/" className="flex items-center" onClick={onClose}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl tracking-tight">
                {t('app.name')}
              </span>
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
              data-menu-close="true"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu content */}
          <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-900">
            <nav className="space-y-2 mb-6">
              <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider">
                {t('navigation.main_menu')}
              </div>
              {mainNavigationItems.map((item) => (
                <ResponsiveNavLink
                  key={item.key}
                  href={item.href}
                  active={item.active}
                  onClick={handleClose}
                  className="nav-item"
                >
                  {item.label}
                </ResponsiveNavLink>
              ))}
            </nav>

            {/* Auth section */}
            {auth.user ? (
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider">
                  {t('auth.account')}
                </div>
                <div className="space-y-2">
                  {userNavigationItems.map((item) => (
                    <ResponsiveNavLink
                      key={item.key}
                      href={item.href}
                      active={item.active}
                      onClick={handleClose}
                      className="nav-item"
                    >
                      {item.label}
                    </ResponsiveNavLink>
                  ))}
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left pl-3 sm:pl-4 pr-4 sm:pr-5 py-3 sm:py-4 border-l-4 border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/90 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/90 dark:hover:border-gray-600 dark:focus:text-white dark:focus:bg-gray-800 dark:focus:border-gray-600 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-200 ease-in-out rounded-r-xl min-h-[44px] flex items-center btn-optimized"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider">
                  {t('auth.account')}
                </div>
                <div className="space-y-2">
                  {guestNavigationItems.map((item) => (
                    <ResponsiveNavLink
                      key={item.key}
                      href={item.href}
                      active={item.active}
                      onClick={handleClose}
                      className="nav-item"
                    >
                      {item.label}
                    </ResponsiveNavLink>
                  ))}
                </div>
              </div>
            )}

            {/* Settings */}
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.dark_mode')}
                </span>
                <DarkModeToggle />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('common.language')}
                </span>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

MobileMenuSimple.displayName = 'MobileMenuSimple';

export default MobileMenuSimple;
