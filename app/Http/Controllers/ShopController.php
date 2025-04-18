<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;

class ShopController extends Controller
{
    public function show($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('Shop/ShopItem', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'description' => $product->description,
                'category' => $product->category,
                'images' => $product->images,
                'sizes' => $product->sizes,
                'inStock' => $product->in_stock,
            ]
        ]);
    }
}
