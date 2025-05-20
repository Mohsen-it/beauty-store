<?php

namespace App\Http\Controllers;

use App\Http\Controllers\OrderController;
use App\Models\Order;
use App\Services\StripePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Stripe\Exception\ApiErrorException;

class PaymentController extends Controller
{
    protected $stripeService;

    public function __construct(StripePaymentService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    /**
     * Create a payment intent for a temporary order
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function createPaymentIntent(Request $request)
    {
        // Minimal logging in production
        if (!App::environment('production')) {
            Log::info('Creating payment intent for temporary order');
        }

        // Get the temporary order from session
        $temporaryOrder = session('temporary_order');

        if (!$temporaryOrder) {
            return response()->json(['error' => 'No order information found. Please complete the checkout form first.'], 400);
        }

        try {
            // Create a payment intent using the temporary order data
            $paymentIntent = $this->stripeService->createPaymentIntentFromArray($temporaryOrder);

            // Return only necessary data to reduce response size
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret,
                'paymentIntentId' => $paymentIntent->id
            ]);
        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            Log::error('General Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Validate a payment method before processing
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validatePaymentMethod(Request $request)
    {
        // Minimal logging and validation
        $request->validate([
            'payment_method_id' => 'required|string',
        ]);

        try {
            $validation = $this->stripeService->validatePaymentMethod($request->payment_method_id);

            return response()->json([
                'valid' => $validation['valid'],
                'message' => $validation['message']
            ]);
        } catch (\Exception $e) {
            // Only log in development or for serious errors
            if (!App::environment('production') || str_contains($e->getMessage(), 'server error')) {
                Log::error('Error validating payment method: ' . $e->getMessage());
            }

            return response()->json([
                'valid' => false,
                'message' => 'Error validating card: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Confirm payment for a temporary order and create the actual order
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function confirmPayment(Request $request)
    {
        // Minimal validation
        $request->validate([
            'payment_intent_id' => 'required|string',
            'payment_method_id' => 'required|string',
        ]);

        // Get the temporary order from session
        $temporaryOrder = session('temporary_order');

        if (!$temporaryOrder) {
            return response()->json(['error' => 'No order information found. Please complete the checkout form first.'], 400);
        }

        try {
            // Validate the payment method first
            $validation = $this->stripeService->validatePaymentMethod($request->payment_method_id);

            if (!$validation['valid']) {
                // Minimal logging for invalid cards
                if (!App::environment('production')) {
                    Log::warning('Payment rejected: ' . $validation['message']);
                }

                return response()->json([
                    'success' => false,
                    'error' => $validation['message'],
                    'code' => 'invalid_card'
                ], 400);
            }

            // Confirm the payment intent
            $paymentIntent = $this->stripeService->confirmPaymentIntentWithoutOrder(
                $request->payment_intent_id,
                $request->payment_method_id
            );

            // If payment is successful, create the actual order
            if ($paymentIntent->status === 'succeeded') {
                // Create a new OrderController instance
                $orderController = new OrderController();

                // Create the actual order in the database
                $response = $orderController->store($request);
                $responseData = json_decode($response->getContent(), true);

                if (isset($responseData['success']) && $responseData['success']) {
                    return response()->json([
                        'success' => true,
                        'status' => $paymentIntent->status,
                        'order' => $responseData['order'],
                        'redirect' => $responseData['redirect']
                    ]);
                } else {
                    // If order creation failed, return the error
                    return response()->json([
                        'success' => false,
                        'error' => $responseData['error'] ?? 'Failed to create order after payment',
                        'payment_status' => $paymentIntent->status
                    ], 500);
                }
            } else {
                // Payment requires additional action or failed
                return response()->json([
                    'success' => false,
                    'status' => $paymentIntent->status,
                    'error' => 'Payment requires additional action or failed',
                    'client_secret' => $paymentIntent->client_secret
                ]);
            }
        } catch (ApiErrorException $e) {
            Log::error('Stripe API Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        } catch (\Exception $e) {
            Log::error('Error during payment confirmation: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle Stripe webhook events
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        $sigHeader = $request->header('Stripe-Signature');
        $webhookSecret = config('services.stripe.webhook.secret');

        try {
            // Verify the webhook signature
            \Stripe\Webhook::constructEvent(
                $request->getContent(),
                $sigHeader,
                $webhookSecret
            );

            // Log the environment for webhook events
            Log::info('Processing webhook event', [
                'event_type' => $payload['type'] ?? 'unknown',
                'environment' => App::environment()
            ]);

            // Handle the event
            $this->stripeService->handleWebhookEvent($payload);

            return response()->json(['status' => 'success']);
        } catch (\UnexpectedValueException $e) {
            Log::error('Invalid webhook payload: ' . $e->getMessage(), [
                'environment' => App::environment()
            ]);
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            Log::error('Invalid webhook signature: ' . $e->getMessage(), [
                'environment' => App::environment()
            ]);
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Exception $e) {
            Log::error('Webhook error: ' . $e->getMessage(), [
                'environment' => App::environment()
            ]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
