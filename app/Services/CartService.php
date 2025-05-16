<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class CartService
{
    public function getCart()
    {
        $cart = session()->get('cart', ['items' => [], 'total' => 0, 'itemCount' => 0]);

        // If the cart is just an array of items without proper structure, normalize it
        if (isset($cart) && !isset($cart['items'])) {
            return ['items' => $cart, 'total' => $this->calculateTotal($cart), 'itemCount' => count($cart)];
        }

        return $cart;
    }

    public function addToCart(Product $product, int $quantity)
    {
        $cart = $this->getCart();
        $cartItemId = $this->generateCartItemId($product->id);

        if (isset($cart['items'][$cartItemId])) {
            // Don't add more quantity if item already exists
            return $cart;
        } else {
            // Get product image data from the JSON field
            $productImages = is_array($product->images) ? $product->images : json_decode($product->images, true);


            // The database already stores the path as "/storage/products/..."
            $imageUrl = !empty($productImages) && isset($productImages[0]['imageSrc'])
                ? $productImages[0]['imageSrc']
                : '/storage/products/default.jpg';

            $imageAlt = !empty($productImages) && isset($productImages[0]['imageAlt'])
                ? $productImages[0]['imageAlt']
                : $product->name;

            $cart['items'][$cartItemId] = [
                'id' => $cartItemId,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => 1, // Always set to 1
                'image' => [
                    'imageSrc' => $imageUrl,
                    'imageAlt' => $imageAlt,
                ],
                'category' => $product->category,
            ];
        }

        // Update total and itemCount
        $cart['total'] = $this->calculateTotal($cart['items']);
        $cart['itemCount'] = array_reduce($cart['items'], function ($sum, $item) {
            return $sum + $item['quantity'];
        }, 0);

        // Store the updated cart
        session()->put('cart', $cart);

        return $cart;
    }

    public function removeFromCart(string $cartItemId)
    {
        $cart = $this->getCart();

        // Remove the item from the items array
        if (isset($cart['items'][$cartItemId])) {
            unset($cart['items'][$cartItemId]);

            // Update total and itemCount
            $cart['total'] = $this->calculateTotal($cart['items']);
            $cart['itemCount'] = count($cart['items']);

            // Store the updated cart
            session()->put('cart', $cart);
        }

        return $cart;
    }

    public function updateQuantity(string $cartItemId, int $quantity)
    {
        $cart = $this->getCart();

        if (isset($cart['items'][$cartItemId])) {
            // Always set quantity to 1
            $cart['items'][$cartItemId]['quantity'] = 1;

            // Update total and itemCount
            $cart['total'] = $this->calculateTotal($cart['items']);
            $cart['itemCount'] = array_reduce($cart['items'], function ($sum, $item) {
                return $sum + $item['quantity'];
            }, 0);

            // Store the updated cart
            session()->put('cart', $cart);
        }

        return $cart;
    }

    public function clearCart()
    {
        session()->forget('cart');
    }

    public function getCartSummary()
    {
        $cart = $this->getCart();

        // The cart already has the correct structure with items, total, and itemCount
        return $cart;
    }

    private function generateCartItemId($productId)
    {
        return md5($productId);
    }

    private function calculateTotal($cartItems)
    {
        if (empty($cartItems)) {
            return 0;
        }

        // Check if the cart items are nested under 'items' key
        if (isset($cartItems['items'])) {
            $cartItems = $cartItems['items'];
        }

        // If after potential unwrapping, we still have nothing, return 0
        if (empty($cartItems)) {
            return 0;
        }

        return array_reduce($cartItems, function ($carry, $item) {
            // Add additional check to ensure price and quantity exist
            if (!isset($item['price']) || !isset($item['quantity'])) {
                return $carry;
            }
            return $carry + ((float)$item['price'] * (int)$item['quantity']);
        }, 0);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $this->addToCart(
            $product,
            $request->quantity
        );

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    public function sync(Request $request)
    {
        $request->validate([
            'items' => 'required|string',
            'total' => 'required|numeric',
            'itemCount' => 'required|integer',
        ]);

        try {
            $items = json_decode($request->items, true);

            // Ensure each item has valid image data
            foreach ($items as $key => $item) {
                if (!isset($item['image']) || !isset($item['image']['imageSrc'])) {
                    // Add default image if missing
                    $items[$key]['image'] = [
                        'imageSrc' => '/storage/products/default.jpg',
                        'imageAlt' => $item['name'] ?? 'Product image'
                    ];
                }
            }

            session()->put('cart', [
                'items' => $items,
                'total' => (float)$request->total,
                'itemCount' => (int)$request->itemCount,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Cart synchronized successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to synchronize cart: ' . $e->getMessage(),
            ], 500);
        }
    }
}
