<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        // Apply filters
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('age_group') && $request->age_group !== 'all') {
            $query->where('age_group', $request->age_group);
        }

        if ($request->has('stock_status')) {
            $query->where('in_stock', $request->stock_status === 'in_stock');
        }

        // Apply sorting
        $sort = $request->sort ?? 'created_at';
        $direction = $request->direction ?? 'desc';

        $allowedSorts = ['name', 'price', 'category', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        }

        $products = $query->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $request->search ?? '',
                'category' => $request->category ?? 'all',
                'age_group' => $request->age_group ?? 'all',
                'stock_status' => $request->stock_status ?? 'all',
                'sort' => $sort,
                'direction' => $direction,
            ],
            'categories' => [
                'scarves' => 'Scarves',
                'sweaters' => 'Sweaters',
                'hats' => 'Hats',
                'gloves' => 'Gloves',
                'miscellaneous' => 'Miscellaneous',
            ],
            'ageGroups' => [
                'adult' => 'Adult',
                'baby' => 'Baby',
            ],
        ]);
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
            'age_group' => 'required|string|in:adult,baby',
            'size' => 'required|string',
            'images' => 'required|array|min:1|max:5',
            'images.*' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048', // 2MB
                'dimensions:min_width=100,min_height=100,max_width=2500,max_height=2500'
            ],
            'inStock' => 'required|boolean',
        ], [
            'name.required' => 'Please enter a product name',
            'price.required' => 'Please enter a price',
            'price.numeric' => 'Price must be a number',
            'price.min' => 'Price cannot be negative',
            'description.required' => 'Please enter a product description',
            'category.required' => 'Please select a category',
            'category.in' => 'Please select a valid category',
            'age_group.required' => 'Please select an age group',
            'age_group.in' => 'Age group must be either adult or baby',
            'size.required' => 'Please select a size',
            'images.required' => 'Please upload at least one product image',
            'images.min' => 'Please upload at least one product image',
            'images.max' => 'You can upload a maximum of 5 images',
            'images.*.image' => 'File must be an image',
            'images.*.mimes' => 'Image must be a jpeg, png, or jpg file',
            'images.*.max' => 'Image size cannot exceed 2MB',
            'images.*.dimensions' => 'Image dimensions must be between 100x100 and 2000x2000 pixels',
        ]);

        try {
            $product = Product::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'age_group' => $validated['age_group'],
                'size' => $validated['size'],
                'in_stock' => $validated['inStock'],
                'images' => [], // Set default empty array for images
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
            Log::error('Failed to create product: ' . $e->getMessage());
            return back()->withErrors([
                'error' => 'Failed to create product: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return redirect()->route('admin.products.index')
                ->with('success', 'Product deleted successfully');
        } catch (\Exception $e) {
            Log::error('Failed to delete product: ' . $e->getMessage());
            return back()->withErrors([
                'error' => 'Failed to delete product: ' . $e->getMessage()
            ]);
        }
    }

    public function edit(Product $product)
    {
        return Inertia::render('Admin/Products/Edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'category' => 'required|string|in:scarves,sweaters,hats,gloves,miscellaneous',
            'age_group' => 'required|string|in:adult,baby',
            'size' => 'required|string',
            'images' => 'sometimes|array',
            'images.*' => [
                'sometimes',
                'image',
                'mimes:jpeg,png,jpg',
                'max:2048', // 2MB
                'dimensions:min_width=100,min_height=100,max_width=2000,max_height=2000'
            ],
            'inStock' => 'required|boolean',
            '_existing_images' => 'sometimes|string',
        ], [
            'name.required' => 'Please enter a product name',
            'price.required' => 'Please enter a price',
            'price.numeric' => 'Price must be a number',
            'price.min' => 'Price cannot be negative',
            'description.required' => 'Please enter a product description',
            'category.required' => 'Please select a category',
            'category.in' => 'Please select a valid category',
            'age_group.required' => 'Please select an age group',
            'age_group.in' => 'Age group must be either adult or baby',
            'size.required' => 'Please select a size',
            'images.*.image' => 'File must be an image',
            'images.*.mimes' => 'Image must be a jpeg, png, or jpg file',
            'images.*.max' => 'Image size cannot exceed 2MB',
            'images.*.dimensions' => 'Image dimensions must be between 100x100 and 2000x2000 pixels',
        ]);

        try {
            $product->update([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'description' => $validated['description'],
                'category' => $validated['category'],
                'age_group' => $validated['age_group'],
                'size' => $validated['size'],
                'in_stock' => $validated['inStock'],
            ]);

            // Handle images
            $images = [];

            // First, add existing images if any
            if ($request->has('_existing_images') && !empty($request->_existing_images)) {
                $existingImages = json_decode($request->_existing_images, true);
                if (is_array($existingImages)) {
                    $images = $existingImages;
                }
            }

            // Then add new images if any
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    // Generate unique name
                    $filename = uniqid('product_') . '.' . $image->getClientOriginalExtension();
                    $path = $image->storeAs('products', $filename, 'public');
                    $images[] = [
                        'imageSrc' => '/storage/' . $path,
                        'imageAlt' => $validated['name']
                    ];
                }
            }

            // Make sure we have at least one image
            if (empty($images)) {
                return back()->withErrors([
                    'images' => 'Product must have at least one image'
                ])->withInput();
            }

            // Update the product images
            $product->images = $images;
            $product->save();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update product: ' . $e->getMessage());
            return back()->withErrors([
                'error' => 'Failed to update product: ' . $e->getMessage()
            ])->withInput();
        }
    }
}
