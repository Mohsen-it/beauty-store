import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import DarkModeToggle from '@/Components/DarkModeToggle';

const GuestLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-cinematic-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <header className="bg-white dark:bg-cinematic-800 shadow-sm dark:shadow-soft border-b border-gray-200 dark:border-cinematic-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-pink-600 dark:text-pink-400 font-bold text-xl"
                >
                  Cosmetics Store
                </motion.div>
              </Link>
              <nav className="hidden md:ml-10 md:flex items-center space-x-8">


                <Link
                  href={route('home')}
                  className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href={route('products.index')}
                  className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Products
                </Link>
              </nav>
            </div>
            <div className="flex items-center">


              <DarkModeToggle />
              <Link
                href={route('cart.index')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </Link>
              <div className="ml-4 flex items-center md:ml-6">
                <div className="flex space-x-4 hidden md:flex">

                  <Link
                    href={route('login')}
                    className="text-gray-600 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href={route('register')}
                    className="bg-pink-500 text-white hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              </div>

              <div className="flex items-center md:hidden ml-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-cinematic-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500 dark:focus:ring-pink-600"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>

              </div>
            </div>
          </div>
        </div>

        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white dark:bg-cinematic-800 border-t border-gray-200 dark:border-cinematic-700`}>
          <div className="pt-2 pb-3 space-y-1 px-2">
            <ResponsiveNavLink
              href={route('home')}
              active={route().current('home')}
            >
              {t('navigation.home')}
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('products.index')}
              active={route().current('products.index')}
            >
              {t('navigation.products')}
            </ResponsiveNavLink>

          </div>

          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-cinematic-700 px-2">
            <div className="space-y-1">
              <ResponsiveNavLink
                href={route('login')}
                active={route().current('login')}
              >
                {t('navigation.login')}
              </ResponsiveNavLink>
              <ResponsiveNavLink
                href={route('register')}
                active={route().current('register')}
              >
                {t('navigation.register')}
              </ResponsiveNavLink>

              {/* Language Switcher for mobile */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Language</span>
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-white dark:bg-cinematic-800 p-8 rounded-lg shadow-lg dark:shadow-soft border border-gray-200 dark:border-cinematic-700"
        >
          <div className="mb-6 text-center">
            <Link href="/" className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-pink-600 dark:text-pink-400 font-bold text-2xl"
              >
                {t('app.name')}
              </motion.div>
            </Link>
          </div>
          {children}
        </motion.div>
      </main>

      <footer className="bg-white dark:bg-cinematic-800 mt-12 py-8 border-t border-gray-200 dark:border-cinematic-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('common.about_us')}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('common.about_description')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('common.quick_links')}</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                    {t('navigation.home')}
                  </Link>
                </li>
                <li>
                  <Link href={route('products.index')} className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                    {t('navigation.products')}
                  </Link>
                </li>
                <li>
                  <Link href={route('cart.index')} className="text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400">
                    {t('navigation.cart')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('common.contact')}</h3>
              <p className="text-gray-600 dark:text-gray-400">Email: info@cosmeticsstore.com</p>
              <p className="text-gray-600 dark:text-gray-400">Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-cinematic-700">
            <p className="text-center text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} Cosmetics Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLayout;
