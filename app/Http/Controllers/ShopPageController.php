<?php

namespace App\Http\Controllers;


use Inertia\Inertia;

class ShopPageController extends Controller
{
    public function index()
    {
        return Inertia::render('Shop/ShopLandingPage');
    }

    public function search()
    {
        return Inertia::render('Shop/ShopBrowse');
    }

    public function byAgeGroup(string $age_group)
    {
        if (!in_array($age_group, ['adult', 'baby'])) {
            abort(404);
        }

        return Inertia::render('Shop/ShopBrowse', [
            'ageGroup' => $age_group
        ]);
    }
}
