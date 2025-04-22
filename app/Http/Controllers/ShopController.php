<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class ShopController extends Controller
{
    /**
     * Display the shop landing page with featured products
     */
    public function index()
    {
        // Get featured products (showing a mix of products from different categories)
        $featuredProducts = Product::where('in_stock', true)
            ->orderBy('created_at', 'desc')
            ->take(8)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'category' => $product->category,
                    'age_group' => $product->age_group,
                    'size' => $product->size,
                    'images' => $product->images,
                    'in_stock' => $product->in_stock,
                ];
            });

        // Get all available categories
        $categories = $this->getUniqueCategories();

        return Inertia::render('Shop/ShopLandingPage', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'ageGroups' => ['adult', 'baby'],
        ]);
    }


    /**
     * Display products filtered by age group
     */
    public function byAgeGroup(string $age_group)
    {
        if (!in_array($age_group, ['adult', 'baby'])) {
            abort(404);
        }

        // Get products filtered by age group
        $products = Product::where('age_group', $age_group)
            ->where('in_stock', true)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'description' => $product->description,
                    'category' => $product->category,
                    'age_group' => $product->age_group,
                    'size' => $product->size,
                    'images' => $product->images,
                    'in_stock' => $product->in_stock,
                ];
            });

        return Inertia::render('Shop/ShopBrowse', [
            'ageGroup' => $age_group,
            'products' => $products,
            'categories' => $this->getUniqueCategories($age_group),
        ]);
    }

    /**
     * Display adult products
     */
    public function adults(Request $request)
    {
        // Start with a base query for adult products
        $query = Product::where('age_group', 'adult');

        // Apply filters from request
        $this->applyFilters($query, $request);

        // Get filtered products
        $products = $query->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'category' => $product->category,
                'age_group' => $product->age_group,
                'size' => $product->size,
                'images' => $product->images,
                'in_stock' => $product->in_stock,
            ];
        });

        return Inertia::render('Shop/ShopBrowse', [
            'ageGroup' => 'adult',
            'products' => $products,
            'categories' => $this->getUniqueCategories('adult'),
            'filters' => [
                'q' => $request->q ?? '',
                'category' => $request->category ?? 'all',
                'age_group' => 'adult',
                'sort' => $request->sort ?? 'created_at',
                'direction' => $request->direction ?? 'desc',
                'show_out_of_stock' => $request->show_out_of_stock ?? false,
            ]
        ]);
    }

    /**
     * Display baby products
     */
    public function babies(Request $request)
    {
        // Start with a base query for baby products
        $query = Product::where('age_group', 'baby');

        // Apply filters from request
        $this->applyFilters($query, $request);

        // Get filtered products
        $products = $query->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'category' => $product->category,
                'age_group' => $product->age_group,
                'size' => $product->size,
                'images' => $product->images,
                'in_stock' => $product->in_stock,
            ];
        });

        return Inertia::render('Shop/ShopBrowse', [
            'ageGroup' => 'baby',
            'products' => $products,
            'categories' => $this->getUniqueCategories('baby'),
            'filters' => [
                'q' => $request->q ?? '',
                'category' => $request->category ?? 'all',
                'age_group' => 'baby',
                'sort' => $request->sort ?? 'created_at',
                'direction' => $request->direction ?? 'desc',
                'show_out_of_stock' => $request->show_out_of_stock ?? false,
            ]
        ]);
    }

    /**
     * Get unique categories for a specific age group
     */
    private function getUniqueCategories(?string $age_group = null)
    {
        $query = Product::where('in_stock', true);

        if ($age_group) {
            $query->where('age_group', $age_group);
        }

        return $query->pluck('category')
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Display details for a specific product
     */
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('Shop/ShopItem', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => (float) $product->price,
                'description' => $product->description,
                'category' => $product->category,
                'images' => $product->images,
                'sizes' => $product->sizes,
                'in_stock' => $product->in_stock,
            ]
        ]);
    }

    /**
     * Apply common filters to a product query
     */
    private function applyFilters($query, Request $request)
    {
        // Apply search filter
        if ($request->has('q')) {
            $searchTerm = $request->q;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                    ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Apply category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Apply size filter if present
        if ($request->has('size') && !empty($request->size)) {
            $sizes = explode(',', $request->size);
            if (!empty($sizes)) {
                $query->whereIn('size', $sizes);
            }
        }

        // Only show in-stock items by default
        if (!$request->has('show_out_of_stock') || !$request->show_out_of_stock) {
            $query->where('in_stock', true);
        }

        // Apply sorting
        $sort = $request->sort ?? 'created_at';
        $direction = $request->direction ?? 'desc';

        $allowedSorts = ['name', 'price', 'created_at'];
        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        return $query;
    }
}
