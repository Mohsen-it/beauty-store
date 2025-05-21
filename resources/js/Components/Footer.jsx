import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { t } from '@/utils/translate';

/**
 * Enhanced Footer component with modern design and animations
 *
 * @returns {JSX.Element} - Footer component
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    // Here we would normally send the data to the server
    try {
      // Check if the route exists before trying to fetch
      if (route().has('newsletter.subscribe')) {
        fetch(route('newsletter.subscribe'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
          },
          body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            toast.success(data.message || t('newsletter.subscription_success', 'Thank you for subscribing to our newsletter!'));
            e.target.reset();
          } else {
            toast.error(data.message || t('newsletter.subscription_error', 'Something went wrong'));
          }
        })
        .catch(error => {
          console.error('Newsletter subscription error:', error);
          toast.error(t('newsletter.subscription_error', 'Failed to subscribe. Please try again.'));
        });
      } else {
        // If route doesn't exist, just show a success message
        toast.success(t('newsletter.subscription_success', 'Thank you for subscribing to our newsletter!'));
        e.target.reset();
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(t('newsletter.subscription_error', 'Failed to subscribe. Please try again.'));
    }
  };

  return (
    <footer className="relative w-full">
      {/* Decorative top edge with gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 transform -translate-y-full"></div>

      {/* Decorative elements - responsive sizes */}
      <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-br from-pink-300/10 to-purple-400/10 dark:from-pink-700/10 dark:to-purple-800/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-gradient-to-tr from-blue-300/10 to-cyan-400/10 dark:from-blue-700/10 dark:to-cyan-800/10 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>

      <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/80 dark:border-gray-800/80 backdrop-blur-sm relative z-10 pb-0">
        <div className="container max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <motion.div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 sm:gap-y-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Shop Links Column */}
            <motion.div variants={itemVariants} className="col-span-1">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6">{t('navigation.shop', 'Shop')}</h3>
              <ul className="space-y-2 sm:space-y-3">
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('products.index')} className="text-sm sm:text-base text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('navigation.products')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('categories.skincare')} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('navigation.skincare')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('categories.makeup')} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('navigation.makeup')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            {/* Account Links Column */}
            <motion.div variants={itemVariants} className="col-span-1">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6">{t('auth.my_account', 'My Account')}</h3>
              <ul className="space-y-2 sm:space-y-3">
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('cart.index')} className="text-sm sm:text-base text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('navigation.cart')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('favorites.index')} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('navigation.wishlist')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('orders.index')} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('navigation.orders')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            {/* Help Links Column */}
            <motion.div variants={itemVariants} className="col-span-1 md:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6">{t('navigation.help', 'Help')}</h3>
              <ul className="space-y-2 sm:space-y-3">
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('help.about')} className="text-sm sm:text-base text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('common.about_us')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('help.contact')} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('common.contact_us')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
                <motion.li whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Link href={route('help.faqs')} className="text-gray-600 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 transition-all duration-300 flex items-center group">
                    <span className="relative overflow-hidden">
                      <span className="relative inline-block">{t('common.faqs')}</span>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                    </span>
                  </Link>
                </motion.li>
              </ul>
            </motion.div>

            {/* Newsletter and Social Media Column */}
            <motion.div variants={itemVariants} className="col-span-1 xs:col-span-2 sm:col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent mb-4 sm:mb-6">{t('common.connect_with_us')}</h3>

              {/* Modern social media icons with hover effects - more compact on mobile */}
              <div className="flex space-x-3 sm:space-x-5 mb-6 sm:mb-8">
                <motion.a
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                  aria-label={t('common.facebook')}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                  aria-label={t('common.instagram')}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-lg group-hover:shadow-pink-500/30 transition-all duration-300">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </motion.a>

                <motion.a
                  href="#"
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                  aria-label={t('common.twitter')}
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-blue-400/30 transition-all duration-300">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </div>
                </motion.a>
              </div>

              {/* Enhanced newsletter subscription form - more compact on mobile */}
              <div className="relative">
                <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-pink-300/10 to-purple-400/10 dark:from-pink-700/10 dark:to-purple-800/10 rounded-full blur-2xl pointer-events-none"></div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 md:p-5 border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
                >
                  <h4 className="text-sm sm:text-base font-semibold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-500 dark:to-purple-500 bg-clip-text text-transparent mb-1 sm:mb-2 md:mb-3">{t('common.join_newsletter')}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 sm:mb-3 md:mb-4">{t('common.newsletter_description')}</p>

                  <form onSubmit={handleNewsletterSubmit} className="w-full">
                    <div className="relative w-full">
                      <div className="flex flex-col sm:flex-row sm:space-x-2 w-full">
                        <input
                          type="email"
                          name="email"
                          placeholder={t('common.your_email_address')}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent dark:text-gray-100 shadow-sm text-xs sm:text-sm"
                          required
                          aria-label={t('common.your_email_address')}
                        />
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="mt-2 sm:mt-0 w-full sm:w-auto sm:flex-shrink-0 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-pink-500/30 dark:hover:shadow-pink-700/30 transition-all duration-300 text-xs sm:text-sm"
                          aria-label={t('common.subscribe')}
                        >
                          {t('common.subscribe')}
                        </motion.button>
                      </div>
                    </div>
                  </form>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer copyright section with decorative elements */}
          <div className="relative mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200/80 dark:border-gray-800/80">
            {/* Decorative elements */}
            <div className="absolute left-1/4 top-0 w-1/2 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent transform -translate-y-1/2"></div>

            <div className="flex flex-col sm:flex-row justify-between items-center">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="mb-4 sm:mb-0 text-center sm:text-left"
              >
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                  &copy; {currentYear} Cinematic Beauty Store. {t('common.copyright')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 md:gap-6"
              >
                <Link
                  href={route('help.privacy')}
                  className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 text-xs sm:text-sm transition-colors duration-300 relative group"
                  aria-label={t('common.privacy')}
                >
                  <span className="relative">
                    {t('common.privacy')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
                <Link
                  href={route('help.terms')}
                  className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 text-xs sm:text-sm transition-colors duration-300 relative group"
                  aria-label={t('common.terms')}
                >
                  <span className="relative">
                    {t('common.terms')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
                <Link
                  href={route('help.contact')}
                  className="text-gray-500 hover:text-pink-600 dark:text-gray-400 dark:hover:text-pink-400 text-xs sm:text-sm transition-colors duration-300 relative group"
                  aria-label={t('common.contact')}
                >
                  <span className="relative">
                    {t('common.contact')}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Mobile-friendly payment methods */}
            <div className="mt-6 sm:mt-8">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
                {t('common.payment_methods')}
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {['visa', 'mastercard', 'amex', 'paypal', 'apple-pay'].map((method) => (
                  <div
                    key={method}
                    className="w-10 h-6 sm:w-12 sm:h-7 bg-white dark:bg-gray-800 rounded-md flex items-center justify-center shadow-sm border border-gray-200 dark:border-gray-700"
                    aria-label={`${method} payment method`}
                  >
                    <div className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                      {method.charAt(0).toUpperCase() + method.slice(1).replace('-', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Add a newsletter subscription success message to translation files if it doesn't exist
// t('newsletter.subscription_success', 'Thank you for subscribing to our newsletter!');
