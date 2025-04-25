<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\Request;

class CartService
{
    public function getCart()
    {
        return session()->get('cart', []);
    }

    public function addToCart(Product $product, int $quantity)
    {
        $cart = $this->getCart();
        $cartItemId = $this->generateCartItemId($product->id);

        if (isset($cart[$cartItemId])) {
            $cart[$cartItemId]['quantity'] += $quantity;
        } else {
            $cart[$cartItemId] = [
                'id' => $cartItemId,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'image' => [
                    'imageSrc' => $product->image_url,
                    'imageAlt' => $product->name,
                ],
                'category' => $product->category,
            ];
        }

        $this->updateCart($cart);
        return $cart;
    }

    public function removeFromCart(string $cartItemId)
    {
        $cart = $this->getCart();
        unset($cart[$cartItemId]);
        $this->updateCart($cart);
        return $cart;
    }

    public function updateQuantity(string $cartItemId, int $quantity)
    {
        $cart = $this->getCart();
        if (isset($cart[$cartItemId])) {
            $cart[$cartItemId]['quantity'] = $quantity;
            $this->updateCart($cart);
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
        $total = $this->calculateTotal($cart);
        $itemCount = empty($cart) ? 0 : count($cart);

        return [
            'items' => $cart,
            'total' => (float)$total,
            'itemCount' => (int)$itemCount
        ];
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

        return array_reduce($cartItems, function ($carry, $item) {
            return $carry + ((float)$item['price'] * (int)$item['quantity']);
        }, 0);
    }

    private function updateCart($cart)
    {
        session()->put('cart', $cart);
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
