import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import DarkModeToggle from '@/Components/DarkModeToggle';

const AuthenticatedLayout = ({ children }) => {
  const { auth } = usePage().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Check if user is admin
  const isAdmin = auth.user && auth.user.is_admin;

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route('logout'));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="text-pink-600 font-bold text-xl"
                >
                  Cosmetics Store
                </motion.div>
              </Link>
              <nav className="hidden md:ml-10 md:flex space-x-8">
              {/* <DarkModeToggle /> */}

                <Link
                  href={route('home')}
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href={route('products.index')}
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href={route('favorites.index')}
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Wishlist
                </Link>
                <Link
                  href={route('orders.index')}
                  className="text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Orders
                </Link>
              </nav>
            </div>
            <div className="flex items-center">


              <Link
                href={route('cart.index')}
                className="p-2 text-gray-600 hover:text-pink-500 relative"
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
              <Link
                href={route('favorites.index')}
                className="p-2 ml-2 text-gray-600 hover:text-pink-500 relative md:inline-block hidden"
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  {/* Desktop Profile Dropdown */}
                  <div className="hidden md:block">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center text-gray-600 hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
                    >
                      <span className="mr-1">{auth.user.name}</span>
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* Dropdown Menu for Desktop */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                        {isAdmin ? (
                          <Link
                            href={route('admin.dashboard')}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </Link>
                        ) : null}
                        <Link
                          href={route('profile.edit')}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden ml-4">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
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

        {/* Mobile menu, show/hide based on menu state */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-2 pb-3 space-y-1">
            <ResponsiveNavLink
              href={route('home')}
              active={route().current('home')}
            >
              Home
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('products.index')}
              active={route().current('products.index')}
            >
              Products
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('favorites.index')}
              active={route().current('favorites.index')}
            >
              Wishlist
            </ResponsiveNavLink>
            <ResponsiveNavLink
              href={route('orders.index')}
              active={route().current('orders.index')}
            >
              Orders
            </ResponsiveNavLink>
          </div>

          {/* Mobile authentication links */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-pink-200 flex items-center justify-center">
                  <span className="text-pink-600 font-medium">
                    {auth.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
                <div className="text-sm font-medium text-gray-500">{auth.user.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {isAdmin ? (
                <ResponsiveNavLink
                  href={route('admin.dashboard')}
                  active={route().current('admin.dashboard')}
                >
                  Dashboard
                </ResponsiveNavLink>
              ) : null}
              <ResponsiveNavLink
                href={route('profile.edit')}
                active={route().current('profile.edit')}
              >
                Profile
              </ResponsiveNavLink>
              <button
                onClick={handleLogout}
                className="block w-full pl-3 pr-4 py-2 border-l-4 border-transparent text-left text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition duration-150 ease-in-out"
              >
                Log Out
              </button>


            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us</h3>
              <p className="text-gray-600">
                We offer high-quality cosmetics products for all your beauty needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-pink-500">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href={route('products.index')} className="text-gray-600 hover:text-pink-500">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href={route('cart.index')} className="text-gray-600 hover:text-pink-500">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link href={route('favorites.index')} className="text-gray-600 hover:text-pink-500">
                    My Favorites
                  </Link>
                </li>
                <li>
                  <Link href={route('orders.index')} className="text-gray-600 hover:text-pink-500">
                    My Orders
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
              <p className="text-gray-600">Email: info@cosmeticsstore.com</p>
              <p className="text-gray-600">Phone: +1 234 567 890</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500">
              &copy; {new Date().getFullYear()} Cosmetics Store. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticatedLayout;
