import React from 'react';
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import { t } from '@/utils/translate';

const MobileMenu = ({ 
  isOpen, 
  onClose, 
  auth, 
  isAdmin, 
  handleLogout, 
  rtl, 
  menuSwipeHandlers 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile menu backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed inset-0 z-40 lg:hidden bg-gray-800/50 dark:bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Mobile menu panel */}
          <motion.div
            initial={{ x: rtl ? '100%' : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? '100%' : '-100%' }}
            transition={{
              type: 'tween',
              duration: 0.25,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={`fixed inset-y-0 ${rtl ? 'right-0' : 'left-0'} z-50 lg:hidden w-[90%] max-w-sm`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            {...menuSwipeHandlers}
          >
            <div className="relative h-full w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl overflow-y-auto custom-scrollbar border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
              {/* Menu header */}
              <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
                <Link href="/" className="flex items-center" onClick={onClose}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl tracking-tight">
                    {t('app.name')}
                  </span>
                </Link>

                <button
                  onClick={onClose}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* Navigation Links */}
                <nav className="space-y-2 mb-6 sm:mb-8">
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
                </nav>

                {/* User Account Section */}
                {auth.user ? (
                  <div className="mb-6 sm:mb-8">
                    <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider">
                      {t('auth.my_account')}
                    </div>

                    {/* User Info Card */}
                    <div className="flex items-center p-3 sm:p-4 mb-4 bg-gradient-to-r from-gray-100/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 border border-white/20 dark:border-black/10">
                        {auth.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-800 dark:text-white">{auth.user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{auth.user.email}</div>
                      </div>
                    </div>

                    {/* User Menu Links */}
                    {isAdmin && (
                      <ResponsiveNavLink
                        href={route('admin.dashboard')}
                        active={route().current('admin.dashboard')}
                        onClick={onClose}
                      >
                        {t('navigation.dashboard')}
                      </ResponsiveNavLink>
                    )}

                    <ResponsiveNavLink
                      href={route('profile.edit')}
                      active={route().current('profile.edit')}
                      onClick={onClose}
                    >
                      {t('navigation.profile')}
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                      href={route('cart.index')}
                      active={route().current('cart.index')}
                      onClick={onClose}
                    >
                      {t('navigation.cart')}
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                      href={route('favorites.index')}
                      active={route().current('favorites.index')}
                      onClick={onClose}
                    >
                      {t('navigation.wishlist')}
                    </ResponsiveNavLink>

                    <ResponsiveNavLink
                      href={route('orders.index')}
                      active={route().current('orders.index')}
                      onClick={onClose}
                    >
                      {t('navigation.orders')}
                    </ResponsiveNavLink>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        handleLogout(e);
                      }}
                      className="w-full flex items-center px-3 sm:px-4 py-3 sm:py-4 mt-2 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-all duration-300 min-h-[44px]"
                    >
                      {t('navigation.logout')}
                    </button>
                  </div>
                ) : (
                  <div className="mb-6 sm:mb-8">
                    <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-3 font-medium tracking-wider">
                      {t('auth.account')}
                    </div>
                    <ResponsiveNavLink
                      href={route('login')}
                      active={route().current('login')}
                      onClick={onClose}
                    >
                      {t('navigation.login')}
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      href={route('register')}
                      active={route().current('register')}
                      onClick={onClose}
                    >
                      {t('navigation.register')}
                    </ResponsiveNavLink>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
