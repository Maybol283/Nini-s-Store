<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        // Get all images from the gallery_images directory
        $images = collect(Storage::disk('public')->files('gallery_images'))
            ->filter(fn($file) => in_array(pathinfo($file, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif', 'webp']))
            ->map(fn($file) => [
                'src' => Storage::url($file),
                'alt' => pathinfo($file, PATHINFO_FILENAME)
            ])
            ->values()
            ->toArray();

        return Inertia::render('Gallery', [
            'images' => $images
        ]);
    }
}
