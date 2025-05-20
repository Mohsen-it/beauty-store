<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Cart;
use App\Models\CartItem;
use App\Services\CardValidationService;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\PaymentMethod;
use Stripe\Stripe;
use Stripe\StripeClient;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Session;

class StripePaymentService
{
    protected $stripe;
    protected $cardValidator;

    public function __construct(CardValidationService $cardValidator = null)
    {
        // Ensure we have a valid Stripe key
        $stripeKey = config('services.stripe.secret');

        // Only log in development environment to reduce overhead
        if (app()->environment('local', 'development')) {
            if (empty($stripeKey)) {
                Log::warning('Using fallback Stripe test key');
            }
        }

        Stripe::setApiKey($stripeKey);
        $this->stripe = new StripeClient($stripeKey);

        // Initialize card validator
        $this->cardValidator = $cardValidator ?: new CardValidationService();
    }

    /**
     * Create a payment intent for an order
     *
     * @param Order $order
     * @return PaymentIntent
     * @throws ApiErrorException
     */
    public function createPaymentIntent(Order $order)
    {
        Log::info('Creating payment intent for order', [
            'order_id' => $order->id,
            'order_total' => $order->total,
            'amount_in_cents' => $this->convertToCents($order->total)
        ]);

        return PaymentIntent::create([
            'amount' => $this->convertToCents($order->total),
            'currency' => 'usd',
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
            'description' => 'Order #' . $order->order_number,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);
    }

    /**
     * Create a payment intent from a temporary order array
     *
     * @param array $temporaryOrder
     * @return PaymentIntent
     * @throws ApiErrorException
     */
    public function createPaymentIntentFromArray(array $temporaryOrder)
    {
        // Minimal logging in production
        if (!app()->environment('production')) {
            Log::info('Creating payment intent for temporary order', [
                'order_number' => $temporaryOrder['order_number']
            ]);
        }

        // Calculate amount once to avoid duplicate calculations
        $amountInCents = $this->convertToCents($temporaryOrder['total']);

        return PaymentIntent::create([
            'amount' => $amountInCents,
            'currency' => 'usd',
            'metadata' => [
                'order_number' => $temporaryOrder['order_number'],
                'temporary_order' => 'true',
            ],
            'description' => 'Order #' . $temporaryOrder['order_number'],
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);
    }

    /**
     * Validate a payment method to check for test or fake cards
     *
     * @param string $paymentMethodId
     * @return array
     * @throws ApiErrorException
     */
    public function validatePaymentMethod($paymentMethodId)
    {
        // Cache environment check to avoid multiple calls
        static $isProduction = null;
        if ($isProduction === null) {
            $isProduction = app()->environment('production');
        }

        try {
            // Retrieve the payment method to get card details
            $paymentMethod = $this->stripe->paymentMethods->retrieve($paymentMethodId);

            // Check if it's a card payment method
            if ($paymentMethod->type !== 'card' || !isset($paymentMethod->card)) {
                return [
                    'valid' => false,
                    'message' => 'Only credit card payments are accepted.'
                ];
            }

            // Get card details
            $card = $paymentMethod->card;
            $cardNumber = $card->last4;
            $cardBrand = $card->brand;

            // Minimal logging in production
            if (!$isProduction) {
                Log::info('Validating payment method', [
                    'card_brand' => $cardBrand,
                    'last4' => $cardNumber
                ]);
            }

            // Check for test cards based on known patterns
            // Note: We can only check the last4 digits since Stripe doesn't expose the full number
            $isTestCard = in_array($cardNumber, ['4242', '0000', '1111', '2222']);

            if ($isTestCard) {
                // In production, reject test cards
                if ($isProduction) {
                    return [
                        'valid' => false,
                        'message' => 'Test cards are not allowed in production environment.'
                    ];
                } else {
                    // In development/local environment, allow test cards
                    return [
                        'valid' => true,
                        'message' => 'Test card accepted in development environment.'
                    ];
                }
            }

            // Additional validation for suspicious cards
            if ($cardBrand === 'unknown') {
                return [
                    'valid' => false,
                    'message' => 'Unknown card brand. Please use a valid card.'
                ];
            }

            return [
                'valid' => true,
                'message' => 'Valid card'
            ];

        } catch (\Exception $e) {
            // Only log errors in development or for serious issues
            if (!$isProduction || str_contains($e->getMessage(), 'server error')) {
                Log::error('Error validating payment method: ' . $e->getMessage());
            }

            return [
                'valid' => false,
                'message' => 'Error validating card: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Confirm a payment intent
     *
     * @param string $paymentIntentId
     * @param string $paymentMethodId
     * @param int $orderId
     * @return PaymentIntent
     * @throws ApiErrorException
     */
    public function confirmPaymentIntent($paymentIntentId, $paymentMethodId, $orderId = null)
    {
        Log::info('Confirming payment intent', [
            'payment_intent_id' => $paymentIntentId,
            'payment_method_id' => $paymentMethodId,
            'environment' => app()->environment()
        ]);

        try {
            // Validate the payment method first
            $validation = $this->validatePaymentMethod($paymentMethodId);

            if (!$validation['valid']) {
                Log::warning('Payment rejected due to invalid card', [
                    'payment_method_id' => $paymentMethodId,
                    'reason' => $validation['message'],
                    'environment' => app()->environment()
                ]);

                throw new \Exception($validation['message']);
            }

            // Generate return URL for the order success page
            $returnUrl = URL::route('orders.success', ['order' => $orderId ?: 'latest']);

            Log::info('Using return URL for payment confirmation', [
                'return_url' => $returnUrl
            ]);

            // Skip the separate attach step as it's causing issues
            // Instead, directly confirm the payment intent with the payment method
            return $this->stripe->paymentIntents->confirm(
                $paymentIntentId,
                [
                    'payment_method' => $paymentMethodId,
                    'return_url' => $returnUrl,
                ]
            );
        } catch (\Exception $e) {
            Log::error('Error confirming payment intent: ' . $e->getMessage(), [
                'payment_intent_id' => $paymentIntentId,
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Confirm a payment intent without an existing order
     *
     * @param string $paymentIntentId
     * @param string $paymentMethodId
     * @return PaymentIntent
     * @throws ApiErrorException
     */
    public function confirmPaymentIntentWithoutOrder($paymentIntentId, $paymentMethodId)
    {
        Log::info('Confirming payment intent for temporary order', [
            'payment_intent_id' => $paymentIntentId,
            'payment_method_id' => $paymentMethodId,
            'environment' => app()->environment()
        ]);

        try {
            // Validate the payment method first
            $validation = $this->validatePaymentMethod($paymentMethodId);

            if (!$validation['valid']) {
                Log::warning('Payment rejected due to invalid card', [
                    'payment_method_id' => $paymentMethodId,
                    'reason' => $validation['message'],
                    'environment' => app()->environment()
                ]);

                throw new \Exception($validation['message']);
            }

            // For temporary orders, we'll use a generic success page
            $returnUrl = URL::route('home');

            Log::info('Using generic return URL for temporary order payment confirmation', [
                'return_url' => $returnUrl
            ]);

            // Confirm the payment intent
            return $this->stripe->paymentIntents->confirm(
                $paymentIntentId,
                [
                    'payment_method' => $paymentMethodId,
                    'return_url' => $returnUrl,
                ]
            );
        } catch (\Exception $e) {
            Log::error('Error confirming payment intent for temporary order: ' . $e->getMessage(), [
                'payment_intent_id' => $paymentIntentId,
                'payment_method_id' => $paymentMethodId,
                'error' => $e->getMessage(),
                'environment' => app()->environment()
            ]);
            throw $e;
        }
    }

    /**
     * Retrieve a payment intent
     *
     * @param string $paymentIntentId
     * @return PaymentIntent
     * @throws ApiErrorException
     */
    public function retrievePaymentIntent($paymentIntentId)
    {
        return PaymentIntent::retrieve($paymentIntentId);
    }

    /**
     * Update order with payment intent details
     *
     * @param Order $order
     * @param PaymentIntent $paymentIntent
     * @return Order
     */
    public function updateOrderWithPaymentIntent(Order $order, PaymentIntent $paymentIntent)
    {
        Log::info('Updating order with payment intent details', [
            'order_id' => $order->id,
            'payment_intent_id' => $paymentIntent->id,
            'payment_status' => $paymentIntent->status
        ]);

        $order->payment_intent_id = $paymentIntent->id;
        $order->payment_method_id = $paymentIntent->payment_method;

        if ($paymentIntent->status === 'succeeded') {
            $order->payment_status = 'completed';
            $order->status = 'processing';
            $order->payment_completed_at = now();

            // Clear the cart after successful payment
            $this->clearCartAfterPayment($order);
        } elseif ($paymentIntent->status === 'requires_payment_method') {
            $order->payment_status = 'failed';
            $order->payment_error = $paymentIntent->last_payment_error ? $paymentIntent->last_payment_error->message : 'Payment failed';
        } else {
            $order->payment_status = 'pending';
        }

        $order->save();

        return $order;
    }

    /**
     * Handle webhook events from Stripe
     *
     * @param array $payload
     * @return void
     */
    public function handleWebhookEvent(array $payload)
    {
        $event = $payload['type'];
        $data = $payload['data']['object'];

        Log::info('Handling Stripe webhook event', ['event_type' => $event]);

        switch ($event) {
            case 'payment_intent.succeeded':
                $this->handlePaymentIntentSucceeded($data);
                break;
            case 'payment_intent.payment_failed':
                $this->handlePaymentIntentFailed($data);
                break;
            case 'charge.refunded':
                $this->handleChargeRefunded($data);
                break;
        }
    }

    /**
     * Handle payment intent succeeded event
     *
     * @param array $data
     * @return void
     */
    protected function handlePaymentIntentSucceeded($data)
    {
        $order = Order::where('payment_intent_id', $data['id'])->first();

        if ($order) {
            Log::info('Payment succeeded for order', ['order_id' => $order->id]);

            $order->payment_status = 'completed';
            $order->status = 'processing';
            $order->payment_completed_at = now();
            $order->save();

            // Add to order history
            $order->histories()->create([
                'status' => 'processing',
                'comment' => 'Payment completed successfully',
            ]);

            // Clear the cart after successful payment
            $this->clearCartAfterPayment($order);
        } else {
            Log::warning('Payment succeeded but order not found', ['payment_intent_id' => $data['id']]);
        }
    }

    /**
     * Handle payment intent failed event
     *
     * @param array $data
     * @return void
     */
    protected function handlePaymentIntentFailed($data)
    {
        $order = Order::where('payment_intent_id', $data['id'])->first();

        if ($order) {
            Log::info('Payment failed for order', ['order_id' => $order->id]);

            $order->payment_status = 'failed';
            $order->payment_error = $data['last_payment_error']['message'] ?? 'Payment failed';
            $order->save();

            // Add to order history
            $order->histories()->create([
                'status' => 'failed',
                'comment' => 'Payment failed: ' . ($data['last_payment_error']['message'] ?? 'Unknown error'),
            ]);
        } else {
            Log::warning('Payment failed but order not found', ['payment_intent_id' => $data['id']]);
        }
    }

    /**
     * Handle charge refunded event
     *
     * @param array $data
     * @return void
     */
    protected function handleChargeRefunded($data)
    {
        $paymentIntentId = $data['payment_intent'];
        $order = Order::where('payment_intent_id', $paymentIntentId)->first();

        if ($order) {
            Log::info('Payment refunded for order', ['order_id' => $order->id]);

            $order->payment_status = 'refunded';
            $order->status = 'refunded';
            $order->save();

            // Add to order history
            $order->histories()->create([
                'status' => 'refunded',
                'comment' => 'Payment refunded',
            ]);
        } else {
            Log::warning('Payment refunded but order not found', ['payment_intent_id' => $paymentIntentId]);
        }
    }

    /**
     * Convert amount to cents for Stripe
     *
     * @param float $amount
     * @return int
     */
    protected function convertToCents($amount)
    {
        return (int) ($amount * 100);
    }

    /**
     * Clear the cart after successful payment
     *
     * @param Order $order
     * @return void
     */
    protected function clearCartAfterPayment(Order $order)
    {
        try {
            Log::info('Clearing cart after successful payment', ['order_id' => $order->id]);

            $sessionId = Session::getId();
            $userId = $order->user_id;

            // Find the cart associated with this user/session
            $cart = Cart::where(function ($query) use ($sessionId, $userId) {
                if ($userId) {
                    $query->where('user_id', $userId);
                } else {
                    $query->where('session_id', $sessionId);
                }
            })->first();

            if ($cart) {
                // Delete all cart items
                CartItem::where('cart_id', $cart->id)->delete();

                // Reset cart total
                $cart->total = 0;
                $cart->save();

                Log::info('Cart cleared successfully', ['cart_id' => $cart->id]);
            } else {
                Log::info('No cart found to clear');
            }
        } catch (\Exception $e) {
            Log::error('Error clearing cart: ' . $e->getMessage(), [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
        }
    }
}
