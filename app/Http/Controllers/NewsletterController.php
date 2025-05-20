<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    /**
     * Subscribe to the newsletter.
     */
    public function subscribe(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => __('newsletter.invalid_email'),
                    'errors' => $validator->errors()
                ], 422);
            }

            // Here you would typically add the email to your newsletter service
            // For example:
            // NewsletterService::subscribe($request->email);

            // Log the subscription attempt
            Log::info('Newsletter subscription attempt', ['email' => $request->email]);

            return response()->json([
                'success' => true,
                'message' => __('newsletter.subscription_success')
            ]);
        } catch (\Exception $e) {
            Log::error('Newsletter subscription error', [
                'email' => $request->email,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => __('newsletter.subscription_error')
            ], 500);
        }
    }
}
