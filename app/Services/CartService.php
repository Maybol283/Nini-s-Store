<?php

namespace App\Services;

use App\Models\Product;

class CartService
{
    public function getCart()
    {
        return session()->get('cart', []);
    }

    public function addToCart(Product $product, int $quantity, string $size, string $color)
    {
        $cart = $this->getCart();
        $cartItemId = $this->generateCartItemId($product->id, $size, $color);

        if (isset($cart[$cartItemId])) {
            $cart[$cartItemId]['quantity'] += $quantity;
        } else {
            $cart[$cartItemId] = [
                'id' => $cartItemId,
                'product_id' => $product->id,
                'name' => $product->name,
                'price' => $product->price,
                'quantity' => $quantity,
                'size' => $size,
                'color' => $color,
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
        return [
            'items' => $cart,
            'total' => $this->calculateTotal($cart),
            'itemCount' => count($cart)
        ];
    }

    private function generateCartItemId($productId, $size, $color)
    {
        return md5($productId . $size . $color);
    }

    private function calculateTotal($cartItems)
    {
        return array_reduce($cartItems, function ($carry, $item) {
            return $carry + ($item['price'] * $item['quantity']);
        }, 0);
    }

    private function updateCart($cart)
    {
        session()->put('cart', $cart);
    }
}
