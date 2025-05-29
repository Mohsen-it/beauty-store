import React, { useState, useEffect, lazy, Suspense, memo, useCallback, useMemo } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import CinematicLayout from '@/Layouts/CinematicLayout';
import axios from 'axios';
import { useTranslation } from '@/utils/translate';
import { usePerformanceOptimization } from '@/utils/usePerformanceOptimization';

// Lazy load the PaymentForm component to improve initial load time
const PaymentForm = lazy(() => import('@/Components/PaymentForm'));

// Initialize Stripe with your publishable key
// Use a hardcoded key for testing if environment variable is not available
const stripeKey = import.meta.env.VITE_STRIPE_KEY || 'pk_test_51RBUZF2Qf5vNfQsZX5QSqkVN9TLnzOSkY1vOzztj6OjuNFvMcGdEDtWPZLMQeD6ePexFEKxyy0cqng4gM1zxxNfA000DAwZVFU';
const stripePromise = loadStripe(stripeKey);


// Main Checkout Component
const Checkout = memo(({ cart, order }) => {
  // Use the translation hook
  const { t } = useTranslation();

  // Performance optimization hooks
  const { animationVariants, performanceSettings } = usePerformanceOptimization();
  const prefersReducedMotion = useReducedMotion();

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(order || null);

  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    payment_method: 'credit_card',
    latitude: null,
    longitude: null,
    location_details: '',
    notes: '',
  });

  // State for location status
  const [locationStatus, setLocationStatus] = useState({
    loading: false,
    error: null,
    success: false
  });

  // Add state for loading indicators
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize submit handler to prevent unnecessary re-renders
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (data.payment_method === 'cash_on_delivery') {
        // For cash on delivery, create the order directly
        post(route('orders.store'), {
          onSuccess: (response) => {
            toast.success(t('checkout.order_placed_cod'));
            // Redirect to order success page
            window.location.href = route('orders.success', { order: response?.props?.order?.id });
          },
          onError: (errors) => {
            setIsSubmitting(false);
            toast.error(t('checkout.order_failed'));
          }
        });
      } else {
        // For credit card payment, create a temporary order
        const response = await axios.post(route('orders.create-temporary'), data);

        if (response.data.success) {
          // Set the temporary order for payment processing
          setCompletedOrder(response.data.temporary_order);
          toast.success(t('checkout.shipping_saved'));
        } else {
          toast.error(response.data.error || t('checkout.temp_order_failed'));
        }
        setIsSubmitting(false);
      }
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error.response?.data?.error || t('checkout.error_try_again'));
    }
  }, [data, post, t, setIsSubmitting]);

  // Memoize payment success handler
  const handlePaymentSuccess = useCallback((order) => {
    setPaymentSuccess(true);
    setCompletedOrder(order);
    // Redirect to success page
    window.location.href = route('orders.success', order.id);
  }, []);

  // Memoize payment error handler
  const handlePaymentError = useCallback((errorMessage) => {
    toast.error(errorMessage);
  }, []);

  // Memoize location handler to prevent unnecessary re-renders
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        success: false
      });
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocationStatus({
      loading: true,
      error: null,
      success: false
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Success
        const { latitude, longitude } = position.coords;

        // Reverse geocoding to get address details
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`)
          .then(response => response.json())
          .then(data => {
            const locationDetails = data.display_name || t('checkout.location_detected');

            setData({
              ...data,
              latitude,
              longitude,
              location_details: locationDetails
            });

            setLocationStatus({
              loading: false,
              error: null,
              success: true
            });

            toast.success(t('checkout.location_success'));
          })
          .catch(error => {
            console.error('Error getting location details:', error);

            // Still save coordinates even if reverse geocoding fails
            setData({
              ...data,
              latitude,
              longitude
            });

            setLocationStatus({
              loading: false,
              error: 'Could not get location details, but coordinates were saved',
              success: true
            });

            toast.success(t('checkout.coordinates_saved'));
          });
      },
      (error) => {
        // Error
        let errorMessage = 'Unknown error occurred while getting location';

        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for geolocation';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out';
            break;
        }

        setLocationStatus({
          loading: false,
          error: errorMessage,
          success: false
        });

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [data, setData, t]);

  return (
    <CinematicLayout>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
      <motion.h1
        {...animationVariants.item}
        className="text-2xl sm:text-3xl font-bold text-cinematic-900 dark:text-white mb-6 sm:mb-8 performance-text"
      >
        {t('checkout.title')}
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Checkout Form - Mobile optimized */}
        <motion.div
          {...animationVariants.item}
          className="lg:col-span-8 order-2 lg:order-1 performance-card"
        >
          {!completedOrder ? (
            <form onSubmit={handleSubmit} className="bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft p-6 border border-cinematic-200 dark:border-cinematic-700">
              <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-6">{t('checkout.shipping_info')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.first_name')}
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    value={data.first_name}
                    onChange={(e) => setData('first_name', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                    required
                  />
                  {errors.first_name && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.first_name}</div>}
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.last_name')}
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    value={data.last_name}
                    onChange={(e) => setData('last_name', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                    required
                  />
                  {errors.last_name && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.last_name}</div>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.email_address')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                    required
                  />
                  {errors.email && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.email}</div>}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.phone_number')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                  />
                  {errors.phone && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.phone}</div>}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                  {t('checkout.address')}
                </label>
                <input
                  type="text"
                  id="address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                  required
                />
                {errors.address && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.address}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.city')}
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={data.city}
                    onChange={(e) => setData('city', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                    required
                  />
                  {errors.city && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.city}</div>}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.state_province')}
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={data.state}
                    onChange={(e) => setData('state', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                  />
                  {errors.state && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.state}</div>}
                </div>

                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                    {t('checkout.postal_code')}
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    value={data.postal_code}
                    onChange={(e) => setData('postal_code', e.target.value)}
                    className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                    required
                  />
                  {errors.postal_code && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.postal_code}</div>}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="country" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                  {t('checkout.country')}
                </label>
                <input
                  type="text"
                  id="country"
                  value={data.country}
                  onChange={(e) => setData('country', e.target.value)}
                  className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200"
                  required
                />
                {errors.country && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.country}</div>}
              </div>

              {/* Location Section */}
              <div className="mb-6 border border-cinematic-200 dark:border-cinematic-600 rounded-md p-4 bg-cinematic-50 dark:bg-cinematic-800/50">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300">
                    {t('checkout.precise_location')}
                  </label>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={locationStatus.loading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-500 dark:hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 dark:focus:ring-offset-cinematic-800 transition-all duration-300 shadow-sm hover:shadow-md min-h-[40px]"
                  >
                    {locationStatus.loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('checkout.detecting')}
                      </>
                    ) : (
                      <>
                        <svg className="-ml-0.5 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {t('checkout.detect_location')}
                      </>
                    )}
                  </motion.button>
                </div>

                {locationStatus.success && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-medium">{t('checkout.location_detected')}</span> {t('checkout.location_help')}
                    </p>
                    {data.location_details && (
                      <p className="mt-1 text-xs text-green-600 dark:text-green-400 truncate">
                        {data.location_details}
                      </p>
                    )}
                  </div>
                )}

                {locationStatus.error && !locationStatus.success && (
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/30 rounded border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {locationStatus.error}
                    </p>
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      {t('checkout.location_unavailable')}
                    </p>
                  </div>
                )}

                <p className="mt-2 text-xs text-cinematic-500 dark:text-cinematic-400">
                  {t('checkout.location_sharing_info')}
                </p>
              </div>

              <div className="mb-6">
                <label htmlFor="payment_method" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                  {t('checkout.payment_method')}
                </label>
                <select
                  id="payment_method"
                  value={data.payment_method}
                  onChange={(e) => setData('payment_method', e.target.value)}
                  className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 min-h-[44px] transition-all duration-200 appearance-none bg-no-repeat bg-right"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
                  required
                >
                  <option value="credit_card">{t('checkout.credit_card')}</option>
                  <option value="cash_on_delivery">{t('checkout.cash_on_delivery')}</option>
                </select>
                {errors.payment_method && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.payment_method}</div>}
              </div>

              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-cinematic-700 dark:text-cinematic-300 mb-1">
                  {t('checkout.order_notes')}
                </label>
                <textarea
                  id="notes"
                  rows={4}
                  value={data.notes}
                  onChange={(e) => setData('notes', e.target.value)}
                  className="block w-full rounded-lg border-cinematic-300 dark:border-cinematic-600 dark:bg-cinematic-900 dark:text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm py-3 px-4 transition-all duration-200 resize-y"
                  placeholder={t('checkout.special_instructions')}
                />
                {errors.notes && <div className="text-red-500 dark:text-red-400 text-xs mt-1">{errors.notes}</div>}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={processing || isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 dark:from-pink-600 dark:to-pink-700 dark:hover:from-pink-500 dark:hover:to-pink-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-cinematic-800 text-center font-medium transition-all duration-300 shadow-md hover:shadow-lg min-h-[44px] text-sm sm:text-base"
              >
                {(processing || isSubmitting) ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('checkout.processing')}
                  </span>
                ) : (
                  data.payment_method === 'cash_on_delivery' ? t('checkout.place_order') : t('checkout.continue_payment')
                )}
              </motion.button>
            </form>
          ) : (
            <div className="bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft p-6 border border-cinematic-200 dark:border-cinematic-700">
              <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-6">{t('checkout.payment')}</h2>

              <Elements stripe={stripePromise}>
                <Suspense fallback={
                  <div className="p-4 flex items-center justify-center">
                    <div className="animate-pulse flex flex-col items-center">
                      <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-12 w-full mb-4"></div>
                      <div className="h-10 bg-pink-600 dark:bg-pink-700 rounded w-full flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="ml-2 text-white">{t('checkout.loading_payment')}</span>
                      </div>
                    </div>
                  </div>
                }>
                  <PaymentForm
                    order={completedOrder}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Suspense>
              </Elements>
            </div>
          )}
        </motion.div>

        {/* Order Summary */}
        <motion.div
          {...animationVariants.item}
          className="lg:col-span-4 order-1 lg:order-2 mb-6 lg:mb-0 performance-card"
        >
          <div className="bg-white dark:bg-cinematic-800 rounded-lg shadow-md dark:shadow-soft p-5 sm:p-6 sticky top-24 border border-cinematic-200 dark:border-cinematic-700">
            <h2 className="text-lg font-medium text-cinematic-900 dark:text-white mb-4 sm:mb-6">{t('checkout.order_summary')}</h2>

            {/* Cart Items */}
            <div className="flow-root mb-5 sm:mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              <ul className="-my-3 sm:-my-4 divide-y divide-cinematic-200 dark:divide-cinematic-700">
                {cart?.items?.map((item) => (
                  <li key={item.id} className="py-3 sm:py-4 flex items-center">
                    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden">
                      <img
                        src={
                          item.product.image
                            ? `/storage/${item.product.image}?v=${new Date().getTime()}`
                            : item.product.images && item.product.images[0]?.url
                              ? (item.product.images[0].image_url ? `${item.product.images[0].image_url}?v=${new Date().getTime()}` : `/storage/${item.product.images[0].url}?v=${new Date().getTime()}`)
                              : `/assets/default-product.png?v=${new Date().getTime()}`
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1 flex flex-col">
                      <div>
                        <div className="flex justify-between text-sm font-medium text-cinematic-900 dark:text-white">
                          <h3 className="truncate max-w-[150px] sm:max-w-[200px]">{item.product.name}</h3>
                          <p className="ml-2 whitespace-nowrap">${item.subtotal}</p>
                        </div>
                        <p className="mt-1 text-xs sm:text-sm text-cinematic-500 dark:text-cinematic-400 truncate max-w-[200px]">
                          {item.product.category ? item.product.category.name : 'Uncategorized'}
                        </p>
                      </div>
                      <div className="flex-1 flex items-end justify-between text-xs sm:text-sm">
                        <p className="text-cinematic-500 dark:text-cinematic-400">{t('common.quantity')} {item.quantity}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Totals */}
            <div className="border-t border-cinematic-200 dark:border-cinematic-700 pt-4">
              <div className="flex justify-between text-sm text-cinematic-600 dark:text-cinematic-400 mb-2">
                <p>{t('common.subtotal')}</p>
                <p className="text-cinematic-900 dark:text-white font-medium">${cart?.total || '0.00'}</p>
              </div>
              <div className="flex justify-between text-sm text-cinematic-600 dark:text-cinematic-400 mb-2">
                <p>{t('common.shipping')}</p>
                <p className="text-cinematic-900 dark:text-white font-medium">$10.00</p>
              </div>
              <div className="flex justify-between text-sm text-cinematic-600 dark:text-cinematic-400 mb-2">
                <p>{t('checkout.tax_label')}</p>
                <p className="text-cinematic-900 dark:text-white font-medium">${cart ? (cart.total * 0.05).toFixed(2) : '0.00'}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-cinematic-900 dark:text-white mt-4 pt-4 border-t border-cinematic-200 dark:border-cinematic-700">
                <p>{t('common.total')}</p>
                <p className="text-pink-600 dark:text-pink-400 font-bold">${cart ? (parseFloat(cart.total) + 10 + parseFloat(cart.total) * 0.05).toFixed(2) : '0.00'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </CinematicLayout>
  );
});

Checkout.displayName = 'Checkout';

export default Checkout;
