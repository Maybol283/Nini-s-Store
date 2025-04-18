<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'admin', 'admin.ratelimit']);
    }

    public function create()
    {
        return Inertia::render('Admin/Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'category' => 'required|string|in:scarves,sweaters,hats,gloves,miscellaneous',
            'sizes' => 'required|array|min:1',
            'sizes.*' => 'string|in:XS,S,M,L,XL,XXL',
            'images' => 'required|array|min:1|max:5',
            'images.*' => [
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048',
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000'
            ],
            'inStock' => 'required|boolean',
        ]);

        try {
            $product = Product::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'sizes' => $validated['sizes'],
                'in_stock' => $validated['inStock'],
            ]);

            if ($request->hasFile('images')) {
                $images = [];
                foreach ($request->file('images') as $image) {
                    // Generate unique name
                    $filename = uniqid('product_') . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('products', $filename, 'public');
                    $images[] = [
                        'imageSrc' => '/storage/' . $path,
                        'imageAlt' => $validated['name']
                    ];
                }
                $product->images = $images;
                $product->save();
            }

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to create product. Please try again.']);
        }
    }
}
