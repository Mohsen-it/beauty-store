<?php

namespace App\Services;

use Illuminate\Http\Request;

class BrowserLanguageService
{
    /**
     * Detect the user's preferred language from browser settings
     *
     * @param Request $request
     * @return string
     */
    public function detectLanguage(Request $request)
    {
        // Get the preferred languages from the browser
        $preferredLanguages = $request->getLanguages();

        // The first language in the array is usually the preferred language
        $browserLanguage = reset($preferredLanguages);

        // Use a regular expression to extract only the language code
        if (preg_match('/^([a-z]+)/i', $browserLanguage, $matches)) {
            $languageCode = strtolower($matches[1]);

            // Only return supported languages (en, ar)
            if (in_array($languageCode, ['en', 'ar'])) {
                return $languageCode;
            }
        }

        // Default to English if no supported language is detected
        return 'en';
    }
}
