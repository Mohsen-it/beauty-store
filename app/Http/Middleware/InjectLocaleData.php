<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\BrowserLanguageService;
use Illuminate\Support\Facades\Session;

class InjectLocaleData
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if a language is set in the session
        $languageCode = Session::get('locale');

        // If no language is set in the session, detect from browser
        if (!$languageCode) {
            $browserLanguageService = new BrowserLanguageService();
            $languageCode = $browserLanguageService->detectLanguage($request);
            
            // Store the detected language in the session
            Session::put('locale', $languageCode);
        }

        // Set the application locale
        app()->setLocale($languageCode);

        // Specify the path to the language JSON files
        $localesPath = resource_path('lang');
        $languageFilePath = "{$localesPath}/{$languageCode}.json";

        if (file_exists($languageFilePath)) {
            $data = json_decode(file_get_contents($languageFilePath), true);
        } else {
            // Fallback to English if the language file does not exist
            $englishFilePath = "{$localesPath}/en.json";
            $data = json_decode(file_get_contents($englishFilePath), true);
            $languageCode = 'en';
        }

        // Inject data into Inertia
        inertia()->share('localeData', [
            'data' => $data,
            'languageCode' => $languageCode,
        ]);

        return $next($request);
    }
}
