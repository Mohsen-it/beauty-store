import React, { useState, useEffect, useRef } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion, useReducedMotion } from "framer-motion";
import CinematicLayout from "@/Layouts/CinematicLayout";
import { t } from "@/utils/translate";
import { toast } from "react-hot-toast";
import { getCsrfHeaders } from "@/utils/csrf";
import "../../../css/category-circles.css";
import "../../../css/carousel.css";

const HomePage = ({ featuredProducts, categories }) => {
  // State to track which product is being added to cart (for animation)
  const [addingToCart, setAddingToCart] = useState(null);

  // Check if user prefers reduced motion for accessibility
  const prefersReducedMotion = useReducedMotion();

  // Refs for scrollable containers
  const categoryScrollRef = useRef(null);
  const productsScrollRef = useRef(null);

  // Use effect to optimize image loading
  useEffect(() => {
    // Preload hero image for better performance
    const preloadHeroImage = new Image();
    preloadHeroImage.src = '/assets/cover.png';

    // Add intersection observer for lazy loading images
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }, []);

  const handleAddToCart = async (productId) => {
    // Set the product as being added to cart (for animation)
    setAddingToCart(productId);

    try {
      // Use the utility function to get CSRF headers
      const headers = getCsrfHeaders();

      const response = await fetch(route('cart.add'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        })
      });

      // Check if the response is a redirect to login page (unauthenticated)
      if (response.redirected && response.url.includes('/login')) {
        // Redirect to login page
        window.location.href = response.url;
        return;
      }

      // Check for 401 Unauthorized status
      if (response.status === 401) {
        // Redirect to login page
        window.location.href = route('login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        // عرض رسالة النجاح
        toast.success(data.message || t('cart.product_added'));

        // تحديث عدد العناصر في السلة فوراً
        if (data.count) {
          // تحديث عدد العناصر في السلة باستخدام الحدث المخصص
          window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: parseInt(data.count) }
          }));
        }
      } else {
        // If the message indicates authentication is required, redirect to login
        if (data.message === 'Unauthenticated.' || data.message?.toLowerCase().includes('login')) {
          window.location.href = route('login');
          return;
        }
        toast.error(data.message || t('cart.add_failed'));
      }

      // إزالة حالة الإضافة بعد فترة قصيرة
      setTimeout(() => {
        setAddingToCart(null);
      }, 1000);

    } catch (error) {
      console.error('Cart error:', error);
      toast.error(t('cart.add_failed'));
      // إزالة حالة الإضافة في حالة الخطأ
      setAddingToCart(null);
    }
  };

  // Optimized animation variants for better mobile performance
  // Respect user's preference for reduced motion
  const container = {
    hidden: { opacity: prefersReducedMotion ? 0.8 : 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0.03 : 0.08, // Faster staggering for reduced motion
        delayChildren: prefersReducedMotion ? 0 : 0.1,       // No delay for reduced motion
      },
    },
  };

  const item = {
    hidden: {
      opacity: prefersReducedMotion ? 0.8 : 0,
      y: prefersReducedMotion ? 5 : 15        // Minimal movement for reduced motion
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",                                // Using tween for more predictable performance
        duration: prefersReducedMotion ? 0.2 : 0.4,   // Shorter duration for reduced motion
        ease: "easeOut"                               // Smoother easing function
      }
    },
  };

  return (
    <CinematicLayout>
      <Head title={`${t('navigation.home')} - ${t('app.title')}`} />

      {/* Hero Section - Mobile Optimized with Reduced Motion Support */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.3 : 0.6 }}
        className="relative bg-pink-50 dark:bg-cinematic-900 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-16 lg:py-24">
          {/* Mobile-first layout with reversed order on mobile */}
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            {/* Hero image shown first on mobile for immediate visual impact */}
            <div className="w-full md:w-1/2 -mt-2 sm:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: prefersReducedMotion ? 0.98 : 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: prefersReducedMotion ? 0.1 : 0.2,
                  duration: prefersReducedMotion ? 0.3 : 0.5,
                  ease: "easeOut"
                }}
                className="rounded-xl overflow-hidden shadow-lg dark:shadow-soft"
              >
                <img
                  src={`/assets/cover.png?v=${new Date().getTime()}`}
                  alt="Cosmetics Collection"
                  className="w-full h-auto object-cover"
                  loading="eager"
                  fetchpriority="high"
                  width="600"
                  height="400"
                />
              </motion.div>
            </div>

            {/* Text content shown after image on mobile */}
            <div className="w-full md:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: prefersReducedMotion ? -5 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0.1 : 0.3,
                  duration: prefersReducedMotion ? 0.2 : 0.4,
                  ease: "easeOut"
                }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight"
              >
                {t('home.hero_title')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: prefersReducedMotion ? -3 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0.2 : 0.4,
                  duration: prefersReducedMotion ? 0.2 : 0.4,
                  ease: "easeOut"
                }}
                className="text-base sm:text-lg text-gray-600 dark:text-cinematic-300 mb-5 sm:mb-6"
              >
                {t('home.hero_description')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: prefersReducedMotion ? -3 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: prefersReducedMotion ? 0.3 : 0.5,
                  duration: prefersReducedMotion ? 0.2 : 0.4,
                  ease: "easeOut"
                }}
                className="flex justify-center md:justify-start"
              >
                <Link
                  href={route("products.index")}
                  className="inline-flex items-center justify-center w-full sm:w-auto bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-base"
                  aria-label="Shop now"
                >
                  {t('common.shop_now')}
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 md:py-12 bg-white dark:bg-cinematic-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-5 sm:mb-6 md:mb-8"
          >
            {t('product.shop_by_category')}
          </motion.h2>

          {/* Horizontal scrolling carousel for categories on mobile */}
          <div className="relative">
            {/* Scroll indicators */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center z-10">
              <button
                onClick={() => {
                  if (categoryScrollRef.current) {
                    categoryScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md text-gray-700 dark:text-gray-300 scroll-indicator hover:bg-white dark:hover:bg-gray-800"
                aria-label="Scroll left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center z-10">
              <button
                onClick={() => {
                  if (categoryScrollRef.current) {
                    categoryScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md text-gray-700 dark:text-gray-300 scroll-indicator hover:bg-white dark:hover:bg-gray-800"
                aria-label="Scroll right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile scroll indicator */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2 sm:hidden">
              <span>← اسحب لرؤية المزيد من الفئات →</span>
            </div>

            {/* Scrollable container */}
            <div ref={categoryScrollRef} className="overflow-x-auto pb-4 hide-scrollbar snap-x">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex md:grid md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                style={{ minWidth: "min-content" }}
              >
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={item}
                    className="touch-manipulation w-32 sm:w-40 md:w-full flex-shrink-0 md:flex-shrink snap-center carousel-item"
                  >
                    <Link
                      href={route("products.index", { category: category.id })}
                      className="block h-full"
                      aria-label={`Browse ${category.name} category`}
                    >
                      <div className="relative overflow-hidden rounded-lg shadow-md dark:shadow-soft hover:shadow-lg transition-shadow duration-300 h-full">
                        {/* Aspect ratio container for consistent sizing */}
                        <div className="aspect-square w-full overflow-hidden bg-gray-200 dark:bg-cinematic-700">
                          <img
                            src={
                              category.image_url
                                ? category.image_url
                                : `/assets/default-category.png`
                            }
                            alt={category.name}
                            className="h-full w-full object-cover object-center transition-opacity duration-300"
                            loading="lazy"
                          />
                        </div>

                        {/* Improved text overlay with better contrast */}
                        <div className="absolute inset-0 flex items-end p-2 sm:p-3 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                          <h3 className="text-sm sm:text-base font-medium text-white drop-shadow-sm">
                            {category.name}
                          </h3>
                        </div>

                        {/* Simplified discount badge for better mobile visibility */}
                        {category.discount && (
                          <div className="absolute top-1 right-1 bg-pink-600 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-md z-10">
                            {category.discount}%
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 md:py-12 bg-gray-50 dark:bg-cinematic-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-5 sm:mb-6 md:mb-8"
          >
            {t('product.featured_products')}
          </motion.h2>

          {/* Horizontal scrolling carousel for products on mobile */}
          <div className="relative">
            {/* Scroll indicators */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center z-10">
              <button
                onClick={() => {
                  if (productsScrollRef.current) {
                    productsScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md text-gray-700 dark:text-gray-300 scroll-indicator hover:bg-white dark:hover:bg-gray-800"
                aria-label="Scroll products left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center z-10">
              <button
                onClick={() => {
                  if (productsScrollRef.current) {
                    productsScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
                  }
                }}
                className="w-8 h-8 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md text-gray-700 dark:text-gray-300 scroll-indicator hover:bg-white dark:hover:bg-gray-800"
                aria-label="Scroll products right"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Mobile scroll indicator */}
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2 sm:hidden">
              <span>← اسحب لرؤية المزيد من المنتجات →</span>
            </div>

            {/* Scrollable container */}
            <div ref={productsScrollRef} className="overflow-x-auto pb-4 hide-scrollbar snap-x">
              <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex sm:grid sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4"
                style={{ minWidth: "min-content" }}
              >
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={item}
                className="touch-manipulation carousel-item snap-center flex-shrink-0 w-40 sm:w-auto" // Improves touch behavior
              >
                <div className="group bg-white dark:bg-cinematic-800 rounded-lg overflow-hidden shadow-sm dark:shadow-soft hover:shadow-md transition-shadow duration-300 border border-transparent dark:border-cinematic-700 h-full flex flex-col">
                  {/* Product image with link */}
                  <Link
                    href={route("products.show", product.slug)}
                    className="block relative"
                    aria-label={`عرض تفاصيل ${product.name}`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={
                          product.image_url
                            ? product.image_url
                            : product.images && product.images[0]?.image_url
                              ? product.images[0].image_url
                              : product.images && product.images[0]?.url
                                ? `/storage/${product.images[0].url}`
                                : `/assets/default-product_1.png`
                        }
                        alt={product.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>

                    {/* Smaller sale badge if on sale */}
                    {product.sale_price && (
                      <div className="absolute top-1 left-1 bg-pink-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                        خصم
                      </div>
                    )}
                  </Link>

                  {/* Ultra compact product info for mobile */}
                  <div className="p-1.5 flex-grow flex flex-col">
                    <Link
                      href={route("products.show", product.slug)}
                      className="flex-grow"
                    >
                      <h3 className="text-[9px] text-gray-500 dark:text-cinematic-400 line-clamp-1">
                        {product.category.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] font-medium text-gray-900 dark:text-white line-clamp-1">
                        {product.name}
                      </p>
                    </Link>

                    {/* Price and add to cart - ultra compact layout */}
                    <div className="mt-1 flex items-center justify-between">
                      <div>
                        {product.sale_price ? (
                          <div className="flex items-center space-x-1 rtl:space-x-reverse">
                            <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400">
                              ${product.sale_price}
                            </span>
                            <span className="text-[9px] text-cinematic-500 dark:text-cinematic-400 line-through">
                              ${product.price}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] font-bold text-primary-600 dark:text-primary-600">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {/* Tiny add to cart button */}
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        disabled={addingToCart === product.id}
                        aria-label={`إضافة ${product.name} إلى السلة`}
                        className={`p-1.5 rounded-full ${
                          addingToCart === product.id
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm shadow-pink-500/20 dark:shadow-pink-700/30'
                            : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40'
                        } transition-all duration-300 relative overflow-hidden`}
                      >
                        {addingToCart === product.id ? (
                          <>
                            {/* Simplified spinner animation */}
                            <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>

                            {/* Success animation overlay */}
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5, duration: 0.3 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </motion.div>
                          </>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                          </svg>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
              </motion.div>
            </div>
          </div>

          {/* Larger, more touch-friendly "View All" button */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href={route("products.index")}
              className="inline-flex items-center justify-center w-full sm:w-auto bg-white dark:bg-cinematic-800 border-2 border-pink-600 dark:border-pink-500 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition duration-300 text-base"
              aria-label="View all products"
            >
              {t('common.view_all_products')}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section - Mobile Optimized */}
      <section className="py-6 sm:py-8 md:py-12 bg-white dark:bg-cinematic-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-5 sm:mb-6 md:mb-8"
          >
            {t('home.why_choose_us')}
          </motion.h2>

          {/* Horizontal scrolling benefits on mobile, grid on larger screens */}
          <div className="sm:hidden text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>← اسحب لرؤية المزيد من المزايا →</span>
          </div>
          <div className="overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible snap-x">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
              style={{ minWidth: "min-content" }}
            >
            {/* Premium Quality */}
            <motion.div
              variants={item}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-row sm:flex-col items-center sm:items-center sm:text-center flex-shrink-0 sm:flex-shrink w-72 sm:w-auto snap-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shadow-sm mb-0 sm:mb-4 mr-3 sm:mr-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('home.premium_quality')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-cinematic-400 line-clamp-2 sm:line-clamp-none">
                  {t('home.premium_quality_desc')}
                </p>
              </div>
            </motion.div>

            {/* Cruelty Free */}
            <motion.div
              variants={item}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-row sm:flex-col items-center sm:items-center sm:text-center flex-shrink-0 sm:flex-shrink w-72 sm:w-auto snap-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shadow-sm mb-0 sm:mb-4 mr-3 sm:mr-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('home.cruelty_free')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-cinematic-400 line-clamp-2 sm:line-clamp-none">
                  {t('home.cruelty_free_desc')}
                </p>
              </div>
            </motion.div>

            {/* Fast Shipping */}
            <motion.div
              variants={item}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-row sm:flex-col items-center sm:items-center sm:text-center sm:col-span-2 md:col-span-1 flex-shrink-0 sm:flex-shrink w-72 sm:w-auto sm:mx-auto sm:max-w-md md:max-w-none snap-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 shadow-sm mb-0 sm:mb-4 mr-3 sm:mr-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  {t('home.fast_shipping')}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-cinematic-400 line-clamp-2 sm:line-clamp-none">
                  {t('home.fast_shipping_desc')}
                </p>
              </div>
            </motion.div>
          </motion.div>
            </div>
        </div>
      </section>
    </CinematicLayout>
  );
};

export default HomePage;
