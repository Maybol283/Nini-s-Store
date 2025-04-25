<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Display the cart page
     */
    public function index()
    {
        $summary = $this->cartService->getCartSummary();
        return Inertia::render('Cart/Index', $summary);
    }

    /**
     * Add item to cart
     */
    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',

        ]);

        $product = Product::findOrFail($request->product_id);
        $this->cartService->addToCart(
            $product,
            $request->quantity
        );

        return redirect()->back()->with('success', 'Product added to cart successfully!');
    }

    /**
     * Remove item from cart
     */
    public function remove($cartItemId)
    {
        $this->cartService->removeFromCart($cartItemId);
        return redirect()->back()->with('success', 'Product removed from cart!');
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, $cartItemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $this->cartService->updateQuantity($cartItemId, $request->quantity);
        return redirect()->back()->with('success', 'Cart updated successfully!');
    }

    /**
     * Clear the entire cart
     */
    public function clear()
    {
        $this->cartService->clearCart();
        return redirect()->back()->with('success', 'Cart cleared successfully!');
    }

    /**
     * Get cart summary (used for header/mini cart)
     */
    public function summary()
    {
        return response()->json($this->cartService->getCartSummary());
    }

    /**
     * Sync cart from client storage to session
     */
    public function sync(Request $request)
    {
        $request->validate([
            'items' => 'required|string',
            'total' => 'required|numeric',
            'itemCount' => 'required|integer',
        ]);

        try {
            $items = json_decode($request->items, true);

            // Store in session
            session()->put('cart', $items);

            return redirect()->back()->with('success', 'Cart cleared successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to synchronize cart');
        }
    }
}
