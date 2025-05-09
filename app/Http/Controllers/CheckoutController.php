<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

use function Laravel\Prompts\confirm;

class CheckoutController extends Controller
{
    public function index()
    {
        // Get cart from session
        $cart = session('cart', ['items' => [], 'total' => 0, 'itemCount' => 0]);

        // Only create payment intent if cart has items
        if (!empty($cart['items']) && $cart['total'] > 0) {
            try {
                // Set your Stripe secret key
                Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

                // Calculate the total with VAT and shipping
                $shipping = 10;
                $vat = $cart['total'] * 0.2;
                $totalAmount = $cart['total'] + $shipping + $vat;

                // Create a PaymentIntent with the calculated amount
                $paymentIntent = PaymentIntent::create([
                    'amount' => round($totalAmount * 100), // Amount in cents
                    'currency' => 'gbp', // British Pounds
                    'automatic_payment_methods' => [
                        'enabled' => true,
                    ],
                    'metadata' => [
                        'cart_id' => session()->getId(),
                    ],

                ]);

                // Render the checkout page with stripe data
                return Inertia::render('Checkout/Checkout', [
                    'stripeKey' => env('STRIPE_PUBLISHABLE_KEY'),
                    'clientSecret' => $paymentIntent->client_secret,
                ]);
            } catch (ApiErrorException $e) {
                // Log the error
                logger()->error('Stripe Error', ['message' => $e->getMessage()]);

                // Render the checkout page with error
                return Inertia::render('Checkout/Checkout', [
                    'stripeKey' => env('STRIPE_PUBLISHABLE_KEY'),
                    'stripeError' => $e->getMessage(),
                ]);
            }
        }

        // If cart is empty, just render the checkout page
        return Inertia::render('Checkout/Checkout', [
            'stripeKey' => env('STRIPE_PUBLISHABLE_KEY'),
        ]);
    }

    // This method is now only used for API calls if needed for updates
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.50',
        ]);

        // Set your Stripe secret key
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

        try {
            // Create a PaymentIntent with the order amount and currency
            $paymentIntent = PaymentIntent::create([
                'amount' => round($request->amount * 100), // Amount in cents
                'currency' => 'gbp', // British Pounds
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'cart_id' => session()->getId(),
                ],

            ]);

            // Debug the paymentIntent to see what we're getting
            logger()->debug('Payment Intent created', [
                'client_secret' => $paymentIntent->client_secret,
            ]);

            // Return the client secret directly
            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (ApiErrorException $e) {
            logger()->error('Stripe Error', ['message' => $e->getMessage()]);

            // Return the error directly
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function processPayment(Request $request)
    {
        // Validate the payment was successful
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        try {
            // Verify the payment with Stripe
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status !== 'succeeded') {
                return response()->json([
                    'error' => 'Payment was not successful.',
                ], 400);
            }

            /*
            //While testing, we don't want to mark items as out of stock

            $cart = session('cart', ['items' => [], 'total' => 0, 'itemCount' => 0]);
            $cartItems = $cart['items'] ?? [];

            // Mark each purchased item as out of stock
            foreach ($cartItems as $item) {
                // Skip if product id is missing
                if (!isset($item['product_id'])) {
                    continue;
                }

                $product = Product::find($item['product_id']);
                if ($product) {
                    // Mark as out of stock since each item is unique
                    $product->in_stock = false;
                    $product->save();

                    // Log the inventory update
                    logger()->info('Product marked as sold', [
                        'product_id' => $product->id,
                        'product_name' => $product->name
                    ]);
                }
            }
                */

            // Create the order in your database
            // TODO: Implement order creation logic

            // Clear the cart from session
            session()->forget('cart');
            return redirect()->route('checkout.thank-you');
        } catch (\Exception $e) {
            logger()->error('Error processing payment', ['error' => $e->getMessage()]);

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function thankYou()
    {
        return Inertia::render('Checkout/ThankYou');
    }
}
