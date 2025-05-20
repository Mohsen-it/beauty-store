<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\App;

class LanguageController extends Controller
{
    /**
     * Change the application language
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function change(Request $request)
    {
        $request->validate([
            'language' => 'required|string|in:en,ar',
        ]);

        $language = $request->input('language');
        
        // Store the selected language in the session
        Session::put('locale', $language);
        
        // Set the application locale
        App::setLocale($language);
        
        return redirect()->back();
    }
}
