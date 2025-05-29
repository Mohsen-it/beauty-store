import React, { useState, useEffect, useCallback, memo } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';

const PaymentForm = memo(({ order, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Create a payment intent when the component mounts
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const createIntent = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);

        // Use AbortController for cancelable requests
        const response = await axios.post(route('payment.create-intent'), {}, {
          signal: controller.signal
        });

        if (!isMounted) return;

        if (response.data.clientSecret) {
          setClientSecret(response.data.clientSecret);
          setPaymentIntentId(response.data.paymentIntentId);
          setIsReady(true);
        } else {
          setError('Failed to get client secret from server');
          onError('Failed to get client secret from server');
        }
      } catch (err) {
        if (!isMounted || axios.isCancel(err)) return;

        setError(err.response?.data?.error || 'Failed to initialize payment');
        onError(err.response?.data?.error || 'Failed to initialize payment');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    createIntent();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [onError]);

  // Validate the payment method before processing - memoized with useCallback
  const validatePaymentMethod = useCallback(async (paymentMethodId) => {
    try {
      const response = await axios.post(route('payment.validate-method'), {
        payment_method_id: paymentMethodId,
      });

      return response.data;
    } catch (err) {
      return {
        valid: false,
        message: err.response?.data?.message || 'Error validating card'
      };
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get payment method - combine card creation and validation in one step
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      // Validate the payment method first
      const validation = await validatePaymentMethod(paymentMethod.id);

      if (!validation.valid) {
        setError(validation.message);
        toast.error(validation.message);
        return;
      }

      // Confirm payment - use Promise.all to optimize if possible in the future
      const response = await axios.post(route('payment.confirm'), {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethod.id,
      });

      if (response.data.success) {
        toast.success('Payment successful!');
        onSuccess(response.data.order);
      } else {
        setError('Payment failed. Please try again.');
        onError('Payment failed. Please try again.');
      }
    } catch (err) {
      // Check if this is a card validation error
      if (err.response?.data?.code === 'invalid_card') {
        toast.error(err.response.data.error);
      }

      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      onError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [stripe, elements, clientSecret, paymentIntentId, validatePaymentMethod, onSuccess, onError]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border border-gray-300 rounded-md bg-white">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={!stripe || loading || !clientSecret}
        className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </motion.button>

      {/* Remove debug information in production */}
    </form>
  );
});

PaymentForm.displayName = 'PaymentForm';

export default PaymentForm;
