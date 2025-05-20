<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class HelpController extends Controller
{
    /**
     * Display the About Us page.
     */
    public function aboutUs()
    {
        return Inertia::render('Help/AboutUs');
    }

    /**
     * Display the Terms of Service page.
     */
    public function termsOfService()
    {
        return Inertia::render('Help/TermsOfService');
    }

    /**
     * Display the Privacy Policy page.
     */
    public function privacyPolicy()
    {
        return Inertia::render('Help/PrivacyPolicy');
    }

    /**
     * Display the Contact Us page.
     */
    public function contactUs()
    {
        return Inertia::render('Help/ContactUs');
    }

    /**
     * Display the FAQs page.
     */
    public function faqs()
    {
        $faqs = [
            [
                'question' => __('faqs.order_question'),
                'answer' => __('faqs.order_answer')
            ],
            [
                'question' => __('faqs.payment_question'),
                'answer' => __('faqs.payment_answer')
            ],
            [
                'question' => __('faqs.delivery_question'),
                'answer' => __('faqs.delivery_answer')
            ],
            [
                'question' => __('faqs.cancel_question'),
                'answer' => __('faqs.cancel_answer')
            ],
            [
                'question' => __('faqs.shipping_question'),
                'answer' => __('faqs.shipping_answer')
            ],
            [
                'question' => __('faqs.cruelty_free_question'),
                'answer' => __('faqs.cruelty_free_answer')
            ],
            [
                'question' => __('faqs.damaged_question'),
                'answer' => __('faqs.damaged_answer')
            ],
            [
                'question' => __('faqs.loyalty_question'),
                'answer' => __('faqs.loyalty_answer')
            ],
        ];

        return Inertia::render('Help/Faqs', [
            'faqs' => $faqs
        ]);
    }

    /**
     * Display the Shipping Information page.
     */
    public function shipping()
    {
        $shippingInfo = [
            'domestic' => [
                'standard' => [
                    'time' => __('shipping.domestic_standard_time'),
                    'cost' => __('shipping.domestic_standard_cost')
                ],
                'express' => [
                    'time' => __('shipping.domestic_express_time'),
                    'cost' => __('shipping.domestic_express_cost')
                ]
            ],
            'international' => [
                'standard' => [
                    'time' => __('shipping.international_standard_time'),
                    'cost' => __('shipping.international_standard_cost')
                ],
                'express' => [
                    'time' => __('shipping.international_express_time'),
                    'cost' => __('shipping.international_express_cost')
                ]
            ]
        ];

        return Inertia::render('Help/Shipping', [
            'shippingInfo' => $shippingInfo
        ]);
    }

    /**
     * Display the Returns Policy page.
     */
    public function returns()
    {
        $returnsPolicy = [
            'timeframe' => __('returns.timeframe'),
            'condition' => __('returns.condition'),
            'process' => __('returns.process'),
            'refund' => __('returns.refund'),
            'exceptions' => __('returns.exceptions')
        ];

        return Inertia::render('Help/Returns', [
            'returnsPolicy' => $returnsPolicy
        ]);
    }

    /**
     * Process contact form submission.
     */
    public function submitContactForm(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'subject' => 'required|string|max:255',
                'message' => 'required|string',
            ]);

            // Here you would typically send an email or store the contact request
            // For example:
            // Mail::to('support@example.com')->send(new ContactFormMail($validated));

            // Log the contact form submission
            Log::info('Contact form submission', [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'subject' => $validated['subject']
            ]);

            return redirect()->back()->with('success', __('contact.success_message'));
        } catch (\Exception $e) {
            Log::error('Contact form error', [
                'error' => $e->getMessage(),
                'data' => $request->except(['message'])
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', __('contact.error_message'));
        }
    }
}
