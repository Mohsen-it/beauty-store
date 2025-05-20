import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import CinematicLayout from "@/Layouts/CinematicLayout";
import { t } from "@/utils/translate";
import { toast } from "react-hot-toast";
import { getCsrfHeaders } from "@/utils/csrf";

const HomePage = ({ featuredProducts, categories }) => {
  // State to track which product is being added to cart (for animation)
  const [addingToCart, setAddingToCart] = useState(null);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <CinematicLayout>
      <Head title={`${t('navigation.home')} - ${t('app.title')}`} />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-pink-50 dark:bg-cinematic-900 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 mb-6 sm:mb-8 md:mb-0">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-2 sm:mb-4"
              >
                {t('home.hero_title')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-cinematic-300 mb-4 sm:mb-6"
              >
                {t('home.hero_description')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Link
                  href={route("products.index")}
                  className="inline-block bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-600 text-white font-medium py-2 sm:py-3 px-4 sm:px-6 rounded-md transition duration-300 text-sm sm:text-base"
                >
                  {t('common.shop_now')}
                </Link>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="rounded-lg overflow-hidden shadow-xl dark:shadow-soft"
              >
                <img
                  src={`/assets/cover.png?v=${new Date().getTime()}`}
                  alt="Cosmetics Collection"
                  className="w-full h-auto"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <section className="py-6 sm:py-8 md:py-12 bg-white dark:bg-cinematic-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 sm:mb-8 md:mb-12"
          >
            {t('product.shop_by_category')}
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={item}>
                <Link href={route("products.index", { category: category.id })}>
                  <div className="group relative overflow-hidden rounded-lg shadow-md dark:shadow-soft hover:shadow-xl transition-shadow duration-300">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 dark:bg-cinematic-700">
                      <img
                        src={
                          category.image_url
                            ? category.image_url
                            : `/assets/default-category.png`
                        }
                        alt={category.name}
                        className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-end p-2 sm:p-3 md:p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-sm sm:text-base md:text-lg font-medium text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 sm:py-8 md:py-12 bg-gray-50 dark:bg-cinematic-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 sm:mb-8 md:mb-12"
          >
            {t('product.featured_products')}
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Link href={route("products.show", product.slug)}>
                  <div className="group bg-white dark:bg-cinematic-800 rounded-lg overflow-hidden shadow-md dark:shadow-soft hover:shadow-xl transition-shadow duration-300 border border-transparent dark:border-cinematic-700">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                      <img
                        src={
                          product.image_url
                            ? product.image_url
                            : product.images && product.images[0]?.image_url
                              ? product.images[0].image_url
                              : product.images && product.images[0]?.url
                                ? `/storage/${product.images[0].url}?v=${new Date().getTime()}`
                                : `/assets/default-product_1.png`
                        }
                        alt={product.name}
                        className="h-40 sm:h-48 md:h-60 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-xs sm:text-sm text-gray-500 dark:text-cinematic-400">
                        {product.category.name}
                      </h3>
                      <p className="mt-1 text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          {product.sale_price ? (
                            <div className="flex items-center">
                              <span className="text-sm sm:text-base md:text-lg text-primary-600 dark:text-primary-400">
                                ${product.sale_price}
                              </span>
                              <span className="ml-2 text-xs sm:text-sm text-cinematic-500 dark:text-cinematic-400 line-through">
                                ${product.price}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm sm:text-base md:text-lg font-bold text-primary-600 dark:text-primary-600">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                          disabled={addingToCart === product.id}
                          className={`p-2 rounded-full ${
                            addingToCart === product.id
                              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/20 dark:shadow-pink-700/30'
                              : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-pink-800/40'
                          } transition-all duration-300 relative overflow-hidden`}
                        >
                          {addingToCart === product.id ? (
                            <>
                              {/* Spinner animation */}
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>

                              {/* Success animation overlay that appears after a delay */}
                              <motion.div
                                className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            </>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
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
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-6 sm:mt-8 md:mt-10 text-center">
            <Link
              href={route("products.index")}
              className="inline-block bg-white dark:bg-cinematic-800 border border-pink-600 dark:border-pink-500 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 font-medium py-1.5 sm:py-2 px-4 sm:px-6 rounded-md transition duration-300 text-xs sm:text-sm md:text-base"
            >
              {t('common.view_all_products')}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-6 sm:py-8 md:py-12 bg-white dark:bg-cinematic-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center mb-6 sm:mb-8 md:mb-12"
          >
            {t('home.why_choose_us')}
          </motion.h2>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            <motion.div variants={item} className="text-center p-3 sm:p-4 md:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-3 sm:mb-4 md:mb-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {t('home.premium_quality')}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-cinematic-400">
                {t('home.premium_quality_desc')}
              </p>
            </motion.div>
            <motion.div variants={item} className="text-center p-3 sm:p-4 md:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-3 sm:mb-4 md:mb-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {t('home.cruelty_free')}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-cinematic-400">
                {t('home.cruelty_free_desc')}
              </p>
            </motion.div>
            <motion.div variants={item} className="text-center p-3 sm:p-4 md:p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-3 sm:mb-4 md:mb-6 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                {t('home.fast_shipping')}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-cinematic-400">
                {t('home.fast_shipping_desc')}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </CinematicLayout>
  );
};

export default HomePage;
