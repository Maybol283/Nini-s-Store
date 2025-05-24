<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
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

    public function manage()
    {
        // Get all images from the gallery_images directory for management
        $images = collect(Storage::disk('public')->files('gallery_images'))
            ->filter(fn($file) => in_array(pathinfo($file, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png', 'gif', 'webp']))
            ->map(fn($file) => [
                'id' => md5($file), // Create a unique ID for each image
                'src' => Storage::url($file),
                'path' => $file,
                'alt' => pathinfo($file, PATHINFO_FILENAME),
                'name' => basename($file),
            ])
            ->values()
            ->toArray();

        return Inertia::render('Admin/Gallery/Manage', [
            'images' => $images
        ]);
    }

    public function upload(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg,gif,webp',
                'max:2048', // 2MB
                'dimensions:min_width=100,min_height=100,max_width=2500,max_height=2500'
            ],
            'alt_text' => 'nullable|string|max:255',
        ], [
            'image.required' => 'Please select an image to upload',
            'image.image' => 'The file must be an image',
            'image.mimes' => 'The image must be a JPEG, PNG, JPG, GIF, or WEBP file',
            'image.max' => 'The image cannot be larger than 2MB',
            'image.dimensions' => 'The image dimensions must be between 100x100 and 2500x2500 pixels',
        ]);

        $image = $request->file('image');
        $altText = $request->input('alt_text') ?? pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);

        // Generate a unique filename
        $filename = 'gallery_' . uniqid() . '.' . $image->getClientOriginalExtension();

        // Store the image
        $path = $image->storeAs('gallery_images', $filename, 'public');

        if ($path) {
            return redirect()->route('gallery.manage')->with('success', 'Image added to gallery successfully.');
        }

        return redirect()->route('gallery.manage')->with('error', 'Failed to upload image.');
    }

    public function destroy(Request $request, $filename)
    {
        // Remove special characters and validate filename
        $filename = basename($filename);

        // Check if file exists
        $path = 'gallery_images/' . $filename;
        if (Storage::disk('public')->exists($path)) {
            if (Storage::disk('public')->delete($path)) {
                return redirect()->route('gallery.manage')->with('success', 'Image removed from gallery.');
            }
        }

        return redirect()->route('gallery.manage')->with('error', 'Failed to remove image.');
    }

    public function addToGallery(Request $request, $productId)
    {
        // Validate the request
        $validated = $request->validate([
            'image_url' => 'required|string'
        ]);

        // Find the product
        $product = Product::findOrFail($productId);

        // Get the image URL
        $imageUrl = $validated['image_url'];

        // Remove the /storage/ prefix if it exists to get the correct path
        $imagePath = str_replace('/storage/', '', $imageUrl);

        // Extract the original file name
        $originalFileName = basename($imagePath);

        // Generate a unique filename to prevent overwriting
        $filename = 'product_' . $product->id . '_' . uniqid() . '.' . pathinfo($originalFileName, PATHINFO_EXTENSION);

        // Copy the file to the gallery directory
        if (Storage::disk('public')->exists($imagePath)) {
            Storage::disk('public')->copy($imagePath, 'gallery_images/' . $filename);

            return redirect()->back()->with('success', 'Image added to gallery successfully.');
        }

        return redirect()->back()->with('error', 'Failed to add image to gallery.');
    }
}
