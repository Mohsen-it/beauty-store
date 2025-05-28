import React from 'react';
import { Link } from '@inertiajs/react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { t } from '@/utils/translate';

const MobileMenuSimple = ({
  isOpen,
  onClose,
  auth,
  isAdmin,
  handleLogout,
  rtl
}) => {
  // Handle body scroll lock when mobile menu is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[998] bg-black/60 dark:bg-black/80"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={`fixed inset-y-0 ${rtl ? 'right-0' : 'left-0'} z-[999] w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
        style={{ 
          minHeight: '100vh',
          maxHeight: '100vh'
        }}
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
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu"
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
              <ResponsiveNavLink
                href={route('home')}
                active={route().current('home')}
                onClick={onClose}
              >
                {t('navigation.home')}
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route('products.index')}
                active={route().current('products.index')}
                onClick={onClose}
              >
                {t('navigation.products')}
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route('categories.skincare')}
                active={route().current('categories.skincare')}
                onClick={onClose}
              >
                {t('navigation.skincare')}
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route('categories.makeup')}
                active={route().current('categories.makeup')}
                onClick={onClose}
              >
                {t('navigation.makeup')}
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route('categories.haircare')}
                active={route().current('categories.haircare')}
                onClick={onClose}
              >
                {t('navigation.haircare')}
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route('categories.fragrance')}
                active={route().current('categories.fragrance')}
                onClick={onClose}
              >
                {t('navigation.fragrance')}
              </ResponsiveNavLink>
            </nav>

            {/* Auth section */}
            {auth.user ? (
              <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider">
                  {t('auth.account')}
                </div>
                <div className="space-y-2">
                  <ResponsiveNavLink
                    href={route('profile.edit')}
                    active={route().current('profile.edit')}
                    onClick={onClose}
                  >
                    {t('navigation.profile')}
                  </ResponsiveNavLink>
                  <ResponsiveNavLink
                    href={route('orders.index')}
                    active={route().current('orders.index')}
                    onClick={onClose}
                  >
                    {t('navigation.orders')}
                  </ResponsiveNavLink>
                  <ResponsiveNavLink
                    href={route('favorites.index')}
                    active={route().current('favorites.index')}
                    onClick={onClose}
                  >
                    {t('navigation.favorites')}
                  </ResponsiveNavLink>
                  <ResponsiveNavLink
                    href={route('cart.index')}
                    active={route().current('cart.index')}
                    onClick={onClose}
                  >
                    {t('navigation.cart')}
                  </ResponsiveNavLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    className="w-full text-left pl-3 sm:pl-4 pr-4 sm:pr-5 py-3 sm:py-4 border-l-4 border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50/90 hover:border-gray-300 focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/90 dark:hover:border-gray-600 dark:focus:text-white dark:focus:bg-gray-800 dark:focus:border-gray-600 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition duration-200 ease-in-out rounded-r-xl min-h-[44px] flex items-center"
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
                  <ResponsiveNavLink
                    href={route('login')}
                    active={route().current('login')}
                    onClick={onClose}
                  >
                    {t('auth.login')}
                  </ResponsiveNavLink>
                  <ResponsiveNavLink
                    href={route('register')}
                    active={route().current('register')}
                    onClick={onClose}
                  >
                    {t('auth.register')}
                  </ResponsiveNavLink>
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
};

export default MobileMenuSimple;
