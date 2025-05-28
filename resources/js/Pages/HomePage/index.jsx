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

      {/* Enhanced Hero Section with Glass Morphism */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReducedMotion ? 0.3 : 0.6 }}
        className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500 overflow-hidden"
      >
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-pink-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-indigo-600/20 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 lg:py-32 relative z-10">
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
                className="heading-xl mb-6 sm:mb-8"
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
                className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-8 sm:mb-10 leading-relaxed font-medium"
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
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center md:justify-start"
              >
                <Link
                  href={route("products.index")}
                  className="btn btn-primary btn-lg hover-lift"
                  aria-label="Shop now"
                >
                  <span className="mr-2">{t('common.shop_now')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href={route("products.index", { category: "skincare" })}
                  className="btn btn-secondary btn-lg hover-lift"
                  aria-label="Browse skincare products"
                >
                  <span className="mr-2">{t('navigation.skincare')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
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

      {/* Enhanced Featured Products Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-all duration-500 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-2xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="heading-lg mb-4">
              {t('product.featured_products')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our handpicked selection of premium beauty products
            </p>
          </motion.div>

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
                className="touch-manipulation carousel-item snap-center flex-shrink-0 w-48 sm:w-auto group"
              >
                <div className="card-product h-full flex flex-col">
                  {/* Enhanced product image with overlay effects */}
                  <Link
                    href={route("products.show", product.slug)}
                    className="block relative overflow-hidden"
                    aria-label={`View ${product.name} details`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
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
                        className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />

                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* Quick view button on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full p-3 shadow-xl transform scale-75 group-hover:scale-100 transition-transform duration-300">
                          <svg className="w-5 h-5 text-gray-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced sale badge */}
                    {product.sale_price && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                        {Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                      </div>
                    )}
                  </Link>

                  {/* Enhanced product info */}
                  <div className="p-4 sm:p-5 flex-grow flex flex-col">
                    <Link
                      href={route("products.show", product.slug)}
                      className="flex-grow"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider mb-2">
                        {product.category.name}
                      </p>
                      <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white line-clamp-2 mb-3 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Enhanced price and CTA section */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          {product.sale_price ? (
                            <>
                              <span className="text-lg font-bold text-gradient">
                                ${product.sale_price}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gradient">
                              ${product.price}
                            </span>
                          )}
                        </div>

                        {/* Star rating placeholder */}
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                            </svg>
                          ))}
                        </div>
                      </div>

                      {/* Enhanced add to cart button */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product.id);
                        }}
                        disabled={addingToCart === product.id}
                        aria-label={`Add ${product.name} to cart`}
                        className="btn btn-primary w-full flex items-center justify-center gap-2 text-sm font-semibold"
                      >
                        {addingToCart === product.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Adding...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                            </svg>
                            Add to Cart
                          </>
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

          {/* Enhanced "View All" button */}
          <div className="mt-8 sm:mt-12 text-center">
            <Link
              href={route("products.index")}
              className="btn btn-secondary inline-flex items-center gap-3 text-base"
              aria-label="View all products"
            >
              <span>{t('common.view_all_products')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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
              className="card-feature p-4 sm:p-6 hover-lift flex flex-row sm:flex-col items-center sm:items-center sm:text-center flex-shrink-0 sm:flex-shrink w-72 sm:w-auto snap-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-xl mb-0 sm:mb-6 mr-4 sm:mr-0 animate-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 sm:h-10 sm:w-10"
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
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {t('home.premium_quality')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-none leading-relaxed">
                  {t('home.premium_quality_desc')}
                </p>
              </div>
            </motion.div>

            {/* Cruelty Free */}
            <motion.div
              variants={item}
              className="card-feature p-4 sm:p-6 hover-lift flex flex-row sm:flex-col items-center sm:items-center sm:text-center flex-shrink-0 sm:flex-shrink w-72 sm:w-auto snap-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl mb-0 sm:mb-6 mr-4 sm:mr-0 animate-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 sm:h-10 sm:w-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {t('home.cruelty_free')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-none leading-relaxed">
                  {t('home.cruelty_free_desc')}
                </p>
              </div>
            </motion.div>

            {/* Fast Shipping */}
            <motion.div
              variants={item}
              className="card-feature p-4 sm:p-6 hover-lift flex flex-row sm:flex-col items-center sm:items-center sm:text-center sm:col-span-2 md:col-span-1 flex-shrink-0 sm:flex-shrink w-72 sm:w-auto sm:mx-auto sm:max-w-md md:max-w-none snap-center"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl mb-0 sm:mb-6 mr-4 sm:mr-0 animate-glow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 sm:h-10 sm:w-10"
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
                <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                  {t('home.fast_shipping')}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2 sm:line-clamp-none leading-relaxed">
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
