import React, { useState, useEffect, useRef, useCallback, memo, Suspense } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import DarkModeToggle from '@/Components/DarkModeToggle';
import LanguageSwitcher from '@/Components/LanguageSwitcher';
import Footer from '@/Components/Footer';
import { useSwipeable } from 'react-swipeable';
import debounce from 'lodash/debounce';
import { t, getCurrentLanguage, isRtl } from '@/utils/translate';

// Memoized Navigation Link component for better performance
const NavLink = memo(({ href, current, children, className }) => (
  <Link
    href={href}
    className={`px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
      current
        ? 'text-white dark:text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30'
        : 'text-gray-700 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-400 border border-transparent hover:border-pink-300/30 dark:hover:border-pink-700/30'
    } ${className || ''}`}
    aria-current={current ? 'page' : undefined}
  >
    <span className="relative z-10">{children}</span>
    <span className="absolute inset-0 w-full h-full bg-white/10 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    {current ? (
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 bg-white"
        layoutId="navIndicator"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    ) : (
      <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300 origin-right group-hover:origin-left"></span>
    )}
  </Link>
));

// Memoized Icon Button component
const IconButton = memo(({ icon, label, onClick, badge, href, className = '' }) => {
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`p-2.5 sm:p-3 md:p-3.5 relative transition-all duration-300 rounded-full bg-gradient-to-br from-gray-100/80 to-white/90 dark:from-gray-800/80 dark:to-gray-900/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 focus:outline-none group ${className}`}
      aria-label={label}
      role={onClick ? 'button' : undefined}
      tabIndex={0}
    >
      <span className="sr-only">{label}</span>
      <div className="text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
        {icon}
      </div>

      {/* Modern animated badge counter */}
      {badge > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15
          }}
          className="absolute -top-1.5 sm:-top-2 md:-top-2.5 -right-1 pointer-events-none"
        >
          <div className="relative">
            {/* Glowing background effect */}
            <div className="absolute inset-0 rounded-full bg-pink-500/20 dark:bg-pink-600/30 blur-md"></div>

            {/* Badge container with gradient */}
            <div className="relative flex items-center justify-center h-5 sm:h-5 md:h-6 min-w-5 sm:min-w-5 md:min-w-6 px-1.5 sm:px-1.5 md:px-2 bg-gradient-to-br from-pink-500 to-purple-600 text-white text-[10px] sm:text-[10px] md:text-xs font-bold rounded-full shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 border border-white/20 dark:border-black/10 backdrop-blur-sm">
              {/* Badge counter with animation */}
              <motion.span
                key={badge}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center"
              >
                {badge > 99 ? '99+' : badge}
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}

      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-hover:from-pink-400/10 group-hover:to-purple-500/10 transition-colors duration-300"></span>
    </motion.div>
  );

  // Enhanced touch target for mobile - increased size
  const touchTargetStyles = "relative after:content-[''] after:absolute after:top-[-12px] after:right-[-12px] after:bottom-[-12px] after:left-[-12px]";

  return href ? (
    <Link href={href} className={touchTargetStyles} aria-label={label}>
      {content}
    </Link>
  ) : (
    <button onClick={onClick} className={touchTargetStyles} aria-label={label}>
      {content}
    </button>
  );
});

const CinematicLayout = ({ children }) => {
  const { auth } = usePage().props;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  // Get current language and RTL status
  const currentLanguage = getCurrentLanguage();
  const rtl = isRtl();

  // Scroll animation effects
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1]);
  const headerBlur = useTransform(scrollY, [0, 100], [5, 8]);
  const headerY = useTransform(scrollY, [0, 100], [0, -8]);
  const logoScale = useTransform(scrollY, [0, 100], [1.1, 1]);

  // Check if user is admin
  const isAdmin = auth.user && auth.user.is_admin;

  // Handle logout with Inertia router
  const handleLogout = (e) => {
    e.preventDefault();
    router.post(route('logout'));
  };

  // Fetch cart items count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        // Check if the route exists before trying to fetch
        if (route().has('cart.count')) {
          const response = await fetch(route('cart.count'), {
            headers: {
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
          });

          if (response.ok) {
            const data = await response.json();
            setCartItemCount(data.count);
          }
        } else {
          // If route doesn't exist, set cart count to 0 to avoid errors
          setCartItemCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
        // Set cart count to 0 in case of error to avoid showing NaN or undefined
        setCartItemCount(0);
      }
    };

    fetchCartCount();

    // Listen for cart update events
    const handleCartUpdate = (e) => {
      if (e.detail && typeof e.detail.count !== 'undefined') {
        setCartItemCount(e.detail.count);
      } else {
        fetchCartCount();
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.get(route('products.index', { search: searchQuery.trim() }));
      setSearchOpen(false);
      setSearchQuery('');
    }
  }, [searchQuery]);

  // Handle search input with debounce
  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Handle scroll effect for header with debounce for performance
  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrolled(window.scrollY > 10);
    }, 10);

    window.addEventListener('scroll', handleScroll);
    return () => {
      handleScroll.cancel();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside - with improved cleanup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }

      // Only check mobile menu if it's open to improve performance
      if (mobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }

      if (searchOpen && searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    // Add passive option for better performance on touch devices
    document.addEventListener('mousedown', handleClickOutside, { passive: true });

    // Ensure proper cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { passive: true });
    };
  }, [mobileMenuOpen, searchOpen, profileDropdownOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      setSearchOpen(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Update HTML direction based on language
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';

    // Add RTL class to body if needed
    if (rtl) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }

    return () => {
      document.body.classList.remove('rtl');
    };
  }, [currentLanguage, rtl]);

  // Prevent body scroll when mobile menu is open - improved implementation
  useEffect(() => {
    // Save the current scroll position and body style
    const scrollY = window.scrollY;
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    if (mobileMenuOpen) {
      // Lock the body at current scroll position
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restore original styles
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;

      // Restore scroll position
      if (document.body.style.top) {
        window.scrollTo(0, parseInt(document.body.style.top || '0') * -1);
      }
    }

    // Cleanup function to ensure body styles are reset
    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;

      // Restore scroll position on unmount if needed
      if (document.body.style.top) {
        window.scrollTo(0, parseInt(document.body.style.top || '0') * -1);
      }
    };
  }, [mobileMenuOpen]);

  // Setup swipe handlers for mobile menu - only for closing
  const menuSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    },
    onSwipedRight: () => {
      if (mobileMenuOpen && rtl) {
        setMobileMenuOpen(false);
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 50, // Require more deliberate swipe
    swipeDuration: 250,
  });

  return (
    <div className={`flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300 ${rtl ? 'rtl' : 'ltr'}`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 dark:opacity-20">
          <div className="absolute top-[10%] right-[5%] w-[25rem] h-[25rem] rounded-full bg-gradient-to-r from-pink-300/20 to-purple-400/20 dark:from-pink-700/20 dark:to-purple-800/20 blur-3xl"></div>
          <div className="absolute top-[40%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-blue-300/20 to-cyan-400/20 dark:from-blue-700/20 dark:to-cyan-800/20 blur-3xl"></div>
          <div className="absolute bottom-[15%] right-[15%] w-[20rem] h-[20rem] rounded-full bg-gradient-to-r from-purple-300/20 to-indigo-400/20 dark:from-purple-700/20 dark:to-indigo-800/20 blur-3xl"></div>
        </div>
      </div>

      {/* Header */}
      <motion.header
        style={{
          opacity: headerOpacity,
          y: headerY,
          backdropFilter: `blur(${headerBlur}px)`
        }}
        className="fixed w-full z-50 transition-all duration-300 bg-white/70 dark:bg-gray-900/70 shadow-lg"
      >
        <div className="container max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 md:h-20">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <motion.div
                  style={{ scale: logoScale }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 17,
                    duration: prefersReducedMotion ? 0 : undefined
                  }}
                  className="relative"
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg sm:text-xl md:text-2xl tracking-tight">
                    <span className="hidden sm:inline">{t('app.name')}</span>
                    <span className="sm:hidden">CS</span>
                  </span>
                  <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-pink-500/20 to-purple-600/20 blur-lg opacity-50 group-hover:opacity-100 transition-opacity"></span>
                </motion.div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:ml-4 lg:ml-8 md:flex space-x-1">
                <NavLink href={route('home')} current={route().current('home')}>
                  {t('navigation.home')}
                </NavLink>
                <NavLink href={route('products.index')} current={route().current('products.index')}>
                  {t('navigation.products')}
                </NavLink>
                <NavLink href={route('categories.skincare')} current={route().current('categories.skincare')}>
                  Skincare
                </NavLink>
                <NavLink href={route('categories.makeup')} current={route().current('categories.makeup')}>
                  Makeup
                </NavLink>
                {auth.user && (
                  <>
                    <NavLink href={route('orders.index')} current={route().current('orders.index')}>
                     {t('navigation.orders')}
                    </NavLink>
                  </>
                )}
              </nav>
            </div>

            {/* Right side icons and buttons */}
            <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2">

              {/* Language Switcher - Hide on smallest screens */}
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>

              {/* Dark Mode Toggle */}
              <DarkModeToggle className="focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 rounded-full" />

              {/* Cart Link with Badge */}
              <IconButton
                href={auth.user ? route('cart.index') : route('login')}
                label="View cart"
                badge={cartItemCount || 0}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
                }
              />

              {/* Favorites Link (Desktop only) */}
              {auth.user && (
                <IconButton
                  href={route('favorites.index')}
                  label="View favorites"
                  className="hidden md:inline-flex"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:h-6 sm:w-6"
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
                  }
                />
              )}

              {/* User Profile or Auth Links */}
              <div className="relative">
                {auth.user ? (
                  <div className="relative" ref={profileDropdownRef}>
                    {/* Desktop Profile Dropdown */}
                    <div className="hidden md:block">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                        className="flex items-center space-x-1.5 sm:space-x-2 px-1.5 sm:px-2 md:px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-br from-gray-100/80 to-white/90 dark:from-gray-800/80 dark:to-gray-900/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 focus:outline-none group transition-all duration-300"
                      >
                        <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 border border-white/20 dark:border-black/10">
                          {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline-block max-w-[100px] truncate text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300 font-medium text-xs sm:text-sm md:text-base">{auth.user.name}</span>
                        <svg
                          className="h-4 w-4 text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300"
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
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-hover:from-pink-400/10 group-hover:to-purple-500/10 transition-colors duration-300"></span>
                      </motion.button>

                      {/* Dropdown Menu for Desktop */}
                      <AnimatePresence>
                        {profileDropdownOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute right-0 mt-2 w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl py-4 z-10 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                          >
                            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 border border-white/20 dark:border-black/10">
                                  {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-white">{auth.user.name}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.user.email}</p>
                                </div>
                              </div>
                            </div>

                            <div className="py-2 px-3">
                              {isAdmin && (
                                <Link
                                  href={route('admin.dashboard')}
                                  className="flex items-center px-4 py-3 my-1 text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 dark:shadow-purple-700/30 mr-3">
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </div>
                                  <span>Dashboard</span>
                                  <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400/0 to-indigo-500/0 group-hover:from-purple-400/10 group-hover:to-indigo-500/10 transition-colors duration-300"></span>
                                </Link>
                              )}

                              <Link
                                href={route('profile.edit')}
                                className="flex items-center px-4 py-3 my-1 text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 mr-3">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                                <span>Profile</span>
                                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 to-rose-500/0 group-hover:from-pink-400/10 group-hover:to-rose-500/10 transition-colors duration-300"></span>
                              </Link>

                              <Link
                                href={route('orders.index')}
                                className="flex items-center px-4 py-3 my-1 text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 dark:shadow-amber-700/30 mr-3">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                  </svg>
                                </div>
                                <span>Orders</span>
                                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/0 to-orange-500/0 group-hover:from-amber-400/10 group-hover:to-orange-500/10 transition-colors duration-300"></span>
                              </Link>
                            </div>

                            <div className="py-2 px-3 border-t border-gray-200/50 dark:border-gray-700/50 mt-1">
                              <button
                                onClick={handleLogout}
                                className="flex w-full items-center px-4 py-3 my-1 text-sm text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 rounded-xl hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-all duration-300 group relative overflow-hidden"
                              >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 dark:shadow-red-700/30 mr-3">
                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                  </svg>
                                </div>
                                <span>Log Out</span>
                                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400/0 to-pink-500/0 group-hover:from-red-400/10 group-hover:to-pink-500/10 transition-colors duration-300"></span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center space-x-2 sm:space-x-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={route('login')}
                        className="relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 bg-gradient-to-br from-gray-100/80 to-white/90 dark:from-gray-800/80 dark:to-gray-900/90 backdrop-blur-md shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 group overflow-hidden"
                      >
                        <span className="relative z-10">{t('navigation.login')}</span>
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-hover:from-pink-400/10 group-hover:to-purple-500/10 transition-colors duration-300"></span>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        href={route('register')}
                        className="relative px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-xl border border-pink-400/30 dark:border-purple-700/30 overflow-hidden group"
                      >
                        <span className="relative z-10">{t('navigation.register')}</span>
                        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-400/0 to-purple-500/0 group-hover:from-pink-400/30 group-hover:to-purple-500/30 transition-colors duration-300"></span>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 sm:p-3 relative transition-all duration-150 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-700/50 focus:outline-none group active:scale-95"
                  aria-expanded={mobileMenuOpen}
                >
                  <span className="sr-only">Open main menu</span>
                  <div className="text-gray-700 dark:text-gray-300 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-150">
                    {mobileMenuOpen ? (
                      <svg
                        className="block h-5 w-5"
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
                        className="block h-5 w-5"
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
                  </div>

                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-0 z-40 md:hidden bg-gray-800/50 dark:bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Mobile menu, show/hide based on menu state */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: rtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: rtl ? '100%' : '-100%' }}
              transition={{
                type: 'tween',
                duration: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth feel
              }}
              className={`fixed inset-y-0 ${rtl ? 'right-0' : 'left-0'} z-50 md:hidden w-[85%] max-w-sm`}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
              {...menuSwipeHandlers}
            >
              <div className="relative h-full w-full bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto custom-scrollbar border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
                {/* Menu header with close button */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-900">
                  <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-xl tracking-tight">
                      {t('app.name')}
                    </span>
                  </Link>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    aria-label="Close menu"
                  >
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Menu content */}
                <div className="flex-1 overflow-y-auto p-4">

                  {/* Navigation Links */}
                  <nav className="space-y-1.5 sm:space-y-2 md:space-y-3 mb-4 sm:mb-6 md:mb-8">
                    <div className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-1 sm:mb-2 font-medium tracking-wider">
                      {t('navigation.main_menu')}
                    </div>
                    <ResponsiveNavLink
                      href={route('home')}
                      active={route().current('home')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('navigation.home')}
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      href={route('products.index')}
                      active={route().current('products.index')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('navigation.products')}
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      href={route('categories.skincare')}
                      active={route().current('categories.skincare')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('navigation.skincare')}
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      href={route('categories.makeup')}
                      active={route().current('categories.makeup')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('navigation.makeup')}
                    </ResponsiveNavLink>
                  </nav>

                  {/* User Account Links */}
                  {auth.user ? (
                    <div className="mb-6 sm:mb-8">
                      <div className="text-xs sm:text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wider">
                        {t('auth.my_account')}
                      </div>

                      <div className="flex items-center p-2 sm:p-3 mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-gray-100/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30 border border-white/20 dark:border-black/10">
                          {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-2 sm:ml-3">
                          <div className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white">{auth.user.name}</div>
                          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">{auth.user.email}</div>
                        </div>
                      </div>

                      {isAdmin && (
                        <ResponsiveNavLink
                          href={route('admin.dashboard')}
                          active={route().current('admin.dashboard')}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t('navigation.dashboard')}
                        </ResponsiveNavLink>
                      )}

                      <ResponsiveNavLink
                        href={route('profile.edit')}
                        active={route().current('profile.edit')}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('navigation.profile')}
                      </ResponsiveNavLink>

                      <ResponsiveNavLink
                        href={route('cart.index')}
                        active={route().current('cart.index')}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('navigation.cart')}
                      </ResponsiveNavLink>

                      <ResponsiveNavLink
                        href={route('favorites.index')}
                        active={route().current('favorites.index')}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('navigation.wishlist')}
                      </ResponsiveNavLink>

                      <ResponsiveNavLink
                        href={route('orders.index')}
                        active={route().current('orders.index')}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('navigation.orders')}
                      </ResponsiveNavLink>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          handleLogout(e);
                        }}
                        className="w-full flex items-center px-2 sm:px-3 py-1.5 sm:py-2 mt-1 text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 rounded-lg hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-all duration-300"
                      >
                        {t('navigation.logout')}
                      </button>
                    </div>
                  ) : (
                    <div className="mb-6 sm:mb-8">
                      <div className="text-xs sm:text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wider">
                        {t('auth.account')}
                      </div>
                      <ResponsiveNavLink
                        href={route('login')}
                        active={route().current('login')}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('navigation.login')}
                      </ResponsiveNavLink>
                      <ResponsiveNavLink
                        href={route('register')}
                        active={route().current('register')}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('navigation.register')}
                      </ResponsiveNavLink>
                    </div>
                  )}

                  {/* Help Links */}
                  <div className="mb-6 sm:mb-8">
                    <div className="text-xs sm:text-sm uppercase text-gray-500 dark:text-gray-400 mb-2 font-medium tracking-wider">
                      {t('navigation.help')}
                    </div>
                    <ResponsiveNavLink
                      href={route('help.about')}
                      active={route().current('help.about')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.about_us')}
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      href={route('help.contact')}
                      active={route().current('help.contact')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.contact_us')}
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                      href={route('help.faqs')}
                      active={route().current('help.faqs')}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {t('common.faqs')}
                    </ResponsiveNavLink>
                  </div>

                  {/* Settings */}
                  <div className="pt-3 sm:pt-4 md:pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {t('common.dark_mode')}
                      </span>
                      <DarkModeToggle />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {t('common.language')}
                      </span>
                      <LanguageSwitcher />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20 md:pt-24 flex-grow">
        <div className="container max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CinematicLayout;