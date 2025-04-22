<?php

namespace App\Http\Controllers;


use Inertia\Inertia;

class HomeController extends Controller
{
    public function landing()
    {
        return Inertia::render('LandingPage', [
            'message' => 'Welcome to the About Us page!',
        ]);
    }

    public function about()
    {
        return Inertia::render('Home/About');
    }

    public function sizeGuide()
    {
        return Inertia::render('SizeGuide');
    }
}
