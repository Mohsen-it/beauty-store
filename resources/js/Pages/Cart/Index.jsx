import React, { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { t } from '@/utils/translate';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import CinematicLayout from '@/Layouts/CinematicLayout';

const CartIndex = ({ cart }) => {
  // State for tracking quantities
  const [itemQuantities, setItemQuantities] = useState(() => {
    const initialQuantities = {};
    if (cart.items && cart.items.length > 0) {
      cart.items.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });
    }
    return initialQuantities;
  });

  // State for tracking loading state of items
  const [updatingItems, setUpdatingItems] = useState({});

  // State for tracking when the cart is being cleared
  const [clearingCart, setClearingCart] = useState(false);

  // State to track if cart is empty (used after clearing without reload)
  const [isCartEmpty, setIsCartEmpty] = useState(cart.items.length === 0);

  const { delete: destroy, processing } = useForm();

  // Calculate cart subtotal based on current quantities
  const cartSubtotal = useMemo(() => {
    if (!cart.items || cart.items.length === 0) return 0;

    return cart.items.reduce((total, item) => {
      const quantity = itemQuantities[item.id] || item.quantity;
      return total + (parseFloat(item.price) * quantity);
    }, 0);
  }, [cart.items, itemQuantities]);

  // Calculate tax (5%)
  const taxAmount = useMemo(() => {
    return cartSubtotal * 0.05;
  }, [cartSubtotal]);

  // Fixed shipping cost
  const shippingCost = 10.00;

  // Calculate order total
  const orderTotal = useMemo(() => {
    return cartSubtotal + shippingCost + taxAmount;
  }, [cartSubtotal, taxAmount]);

  const handleRemoveItem = (cartItemId) => {
    // Set loading state for this item
    setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));

    // Get CSRF token from meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Use axios for AJAX request
    axios.delete(route('cart.remove', cartItemId), {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      toast.success(t('cart.remove_success'));

      // Dispatch cart-updated event with the new count
      if (response.data && typeof response.data.count !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cart-updated', {
          detail: { count: response.data.count }
        }));
      }

      // Update cart items locally by filtering out the removed item
      const updatedItems = cart.items.filter(item => item.id !== cartItemId);
      cart.items = updatedItems;

      // If cart is now empty, update the empty state
      if (updatedItems.length === 0) {
        setIsCartEmpty(true);
      }

      // Remove the item from quantities state
      const newQuantities = { ...itemQuantities };
      delete newQuantities[cartItemId];
      setItemQuantities(newQuantities);

      // Clear loading state
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
    })
    .catch(error => {
      console.error('Remove error:', error.response?.data || error);
      toast.error(t('cart.remove_failed'));

      // Clear loading state
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
    });
  };

  // Updated increment function using direct axios call like in ProductShow
  const incrementQuantity = (cartItemId) => {
    const currentItem = cart.items.find(item => item.id === cartItemId);
    const currentQuantity = itemQuantities[cartItemId] || currentItem.quantity;

    if (currentItem && currentQuantity < currentItem.product.stock) {
      // Set loading state
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));

      // Update local state immediately for responsive UI
      const newQuantity = currentQuantity + 1;
      setItemQuantities(prev => ({ ...prev, [cartItemId]: newQuantity }));

      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Use direct axios call with explicit headers like in ProductShow
      axios.patch(route('cart.update', cartItemId), {
        quantity: newQuantity
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        toast.success(t('cart.update_success'));

        // Dispatch cart-updated event with the new count
        if (response.data && typeof response.data.count !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: response.data.count }
          }));
        }

        // Clear loading state
        setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
      })
      .catch(error => {
        // Error handling
        console.error('Update error:', error.response?.data || error);
        toast.error(t('cart.update_failed'));

        // Revert to original quantity on error
        setItemQuantities(prev => ({ ...prev, [cartItemId]: currentQuantity }));

        // Clear loading state
        setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
      });
    }
  };

  // Updated decrement function using the same approach as increment
  const decrementQuantity = (cartItemId) => {
    const currentItem = cart.items.find(item => item.id === cartItemId);
    const currentQuantity = itemQuantities[cartItemId] || currentItem.quantity;

    if (currentQuantity > 1) {
      // Set loading state
      setUpdatingItems(prev => ({ ...prev, [cartItemId]: true }));

      // Update local state immediately for responsive UI
      const newQuantity = currentQuantity - 1;
      setItemQuantities(prev => ({ ...prev, [cartItemId]: newQuantity }));

      // Get CSRF token from meta tag
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Use direct axios call with explicit headers like in ProductShow
      axios.patch(route('cart.update', cartItemId), {
        quantity: newQuantity
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        }
      })
      .then(response => {
        // Success handling
        toast.success(t('cart.update_success'));

        // Dispatch cart-updated event with the new count
        if (response.data && typeof response.data.count !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cart-updated', {
            detail: { count: response.data.count }
          }));
        }

        // Clear loading state
        setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
      })
      .catch(error => {
        // Error handling
        console.error('Update error:', error.response?.data || error);
        toast.error(t('cart.update_failed'));

        // Revert to original quantity on error
        setItemQuantities(prev => ({ ...prev, [cartItemId]: currentQuantity }));

        // Clear loading state
        setUpdatingItems(prev => ({ ...prev, [cartItemId]: false }));
      });
    }
  };

  const handleClearCart = () => {
    // Set loading state
    setClearingCart(true);

    // Get CSRF token from meta tag
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    // Use axios for AJAX request
    axios.delete(route('cart.clear'), {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
      }
    })
    .then(() => {
      toast.success(t('cart.clear_success'));

      // Dispatch cart-updated event with count 0
      window.dispatchEvent(new CustomEvent('cart-updated', {
        detail: { count: 0 }
      }));

      // Update local state instead of reloading the page
      setIsCartEmpty(true);

      // Clear the quantities state
      setItemQuantities({});

      // Clear loading state
      setClearingCart(false);
    })
    .catch(error => {
      console.error('Clear cart error:', error.response?.data || error);
      toast.error('Failed to clear cart');

      // Clear loading state
      setClearingCart(false);
    });
  };

  // Calculate item subtotal
  const calculateItemSubtotal = (item) => {
    const quantity = itemQuantities[item.id] || item.quantity;
    return (parseFloat(item.price) * quantity).toFixed(2);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <CinematicLayout>
      <Head title={`${t('cart.shopping_cart')} - ${t('app.title')}`} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-cinematic-900 dark:text-white mb-4 sm:mb-6 md:mb-8"
        >
          {t('cart.shopping_cart')}
        </motion.h1>

        {!isCartEmpty && cart.items && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
            {/* Cart Items */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="lg:col-span-8"
            >
              <div className="bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft overflow-hidden border border-cinematic-200 dark:border-cinematic-700">
                <ul className="divide-y divide-cinematic-200 dark:divide-cinematic-700">
                  {cart.items.map((cartItem) => (
                    <motion.li key={cartItem.id} variants={item} className="p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <div className="flex-shrink-0 w-full sm:w-20 md:w-24 h-20 sm:h-20 md:h-24 rounded-md overflow-hidden mb-3 sm:mb-0">
                          <img
                            src={
                              cartItem.product.image
                                ? `/storage/${cartItem.product.image}?v=${new Date().getTime()}`
                                : cartItem.product.images && cartItem.product.images[0]?.url
                                  ? `/storage/${cartItem.product.images[0].url}?v=${new Date().getTime()}`
                                  : `/assets/default-product.png?v=${new Date().getTime()}`
                            }
                            alt={cartItem.product.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="sm:ml-6 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <h3 className="text-base sm:text-lg font-medium text-cinematic-900 dark:text-white">
                                <Link href={route('products.show', cartItem.product.slug)} className="hover:text-pink-600 dark:hover:text-pink-400">
                                  {cartItem.product.name}
                                </Link>
                              </h3>
                              <p className="mt-1 text-xs sm:text-sm text-cinematic-500 dark:text-cinematic-400">{cartItem.product.category.name}</p>
                              <p className="mt-1 text-base sm:text-lg font-medium text-cinematic-900 dark:text-white sm:hidden">${cartItem.price}</p>
                            </div>
                            <p className="hidden sm:block text-base sm:text-lg font-medium text-cinematic-900 dark:text-white">${cartItem.price}</p>
                          </div>
                          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center mb-3 sm:mb-0">
                              {/* Enhanced touch-friendly quantity controls */}
                              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => decrementQuantity(cartItem.id)}
                                  disabled={processing || updatingItems[cartItem.id] || (itemQuantities[cartItem.id] || cartItem.quantity) <= 1}
                                  className={`p-3 sm:p-3 min-w-[44px] min-h-[44px] ${(itemQuantities[cartItem.id] || cartItem.quantity) <= 1 ? 'text-cinematic-300 dark:text-cinematic-600 bg-gray-100 dark:bg-gray-800' : 'text-cinematic-600 dark:text-cinematic-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200`}
                                  aria-label={t('cart.decrease_quantity')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                  </svg>
                                </motion.button>
                                <div className="w-10 sm:w-12 text-center text-cinematic-700 dark:text-cinematic-300 relative font-medium">
                                  <span className={updatingItems[cartItem.id] ? 'opacity-0' : 'opacity-100 transition-opacity duration-200'}>
                                    {itemQuantities[cartItem.id] || cartItem.quantity}
                                  </span>
                                  {updatingItems[cartItem.id] && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                      <svg className="animate-spin h-4 w-4 text-pink-600 dark:text-pink-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                    </span>
                                  )}
                                </div>
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  type="button"
                                  onClick={() => incrementQuantity(cartItem.id)}
                                  disabled={processing || updatingItems[cartItem.id] || (itemQuantities[cartItem.id] || cartItem.quantity) >= cartItem.product.stock}
                                  className={`p-3 sm:p-3 min-w-[44px] min-h-[44px] ${(itemQuantities[cartItem.id] || cartItem.quantity) >= cartItem.product.stock ? 'text-cinematic-300 dark:text-cinematic-600 bg-gray-100 dark:bg-gray-800' : 'text-cinematic-600 dark:text-cinematic-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-all duration-200`}
                                  aria-label={t('cart.increase_quantity')}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                  </svg>
                                </motion.button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end">
                              <p className="text-base sm:text-lg font-medium text-cinematic-900 dark:text-white mr-3 sm:mr-4">
                                ${calculateItemSubtotal(cartItem)}
                              </p>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                type="button"
                                onClick={() => handleRemoveItem(cartItem.id)}
                                disabled={processing || updatingItems[cartItem.id]}
                                className={`p-3 sm:p-3 rounded-full min-w-[44px] min-h-[44px] ${
                                  updatingItems[cartItem.id]
                                    ? 'text-gray-400 dark:text-gray-500'
                                    : 'text-cinematic-500 dark:text-cinematic-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 relative`}
                                aria-label={t('cart.remove_item')}
                              >
                                {updatingItems[cartItem.id] ? (
                                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
                <div className="p-3 sm:p-4 md:p-6 border-t border-cinematic-200 dark:border-cinematic-700">
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleClearCart}
                    disabled={clearingCart}
                    className={`text-sm px-3 py-2 rounded-md min-h-[44px] ${
                      clearingCart
                        ? 'text-gray-400 dark:text-gray-500'
                        : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10'
                    } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-200 flex items-center`}
                  >
                    {clearingCart ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('common.clearing')}
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('common.clear_cart')}
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20, x: 0 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-4"
            >
              <div className="bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft p-4 sm:p-5 md:p-6 border border-cinematic-200 dark:border-cinematic-700 sticky top-24">
                <h2 className="text-base sm:text-lg font-medium text-cinematic-900 dark:text-white mb-3 sm:mb-4 md:mb-6">{t('checkout.order_summary')}</h2>
                <div className="flow-root">
                  <dl className="text-sm">
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-cinematic-600 dark:text-cinematic-400">{t('common.subtotal')}</dt>
                      <dd className="font-medium text-cinematic-900 dark:text-white">${cartSubtotal.toFixed(2)}</dd>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-cinematic-600 dark:text-cinematic-400">{t('common.shipping')}</dt>
                      <dd className="font-medium text-cinematic-900 dark:text-white">${shippingCost.toFixed(2)}</dd>
                    </div>
                    <div className="py-2 flex items-center justify-between">
                      <dt className="text-cinematic-600 dark:text-cinematic-400">{t('common.tax')}</dt>
                      <dd className="font-medium text-cinematic-900 dark:text-white">${taxAmount.toFixed(2)}</dd>
                    </div>
                    <div className="py-2 border-t border-cinematic-200 dark:border-cinematic-700 flex items-center justify-between">
                      <dt className="text-base font-medium text-cinematic-900 dark:text-white">{t('common.total')}</dt>
                      <dd className="text-base font-medium text-pink-600 dark:text-pink-400">${orderTotal.toFixed(2)}</dd>
                    </div>
                  </dl>
                </div>
                <div className="mt-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={route('checkout')}
                      className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-500 dark:hover:to-pink-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 text-center font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base shadow-md hover:shadow-lg min-h-[44px]"
                    >
                      <span>{t('common.proceed_to_checkout')}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
                <div className="mt-5">
                  <motion.div
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={route('products.index')}
                      className="text-sm sm:text-base text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 flex items-center justify-center py-2 transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span>{t('common.continue_shopping')}</span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8 sm:py-10 md:py-16 px-4 sm:px-6 md:px-8 bg-white dark:bg-cinematic-800 rounded-xl shadow-md dark:shadow-soft border border-cinematic-200 dark:border-cinematic-700"
          >
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-cinematic-400 dark:text-cinematic-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 sm:mt-6 text-xl sm:text-2xl font-medium text-cinematic-900 dark:text-white"
              >
                {t('common.empty_cart')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-3 text-sm sm:text-base text-cinematic-600 dark:text-cinematic-400 max-w-xs mx-auto"
              >
                {t('common.cart_empty_message')}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 sm:mt-8"
              >
                <Link
                  href={route('products.index')}
                  className="inline-flex items-center px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-500 dark:hover:to-pink-600 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 transition-all duration-300 text-sm sm:text-base shadow-md hover:shadow-lg min-h-[44px]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{t('common.browse_products')}</span>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </CinematicLayout>
  );
};

export default CartIndex;
