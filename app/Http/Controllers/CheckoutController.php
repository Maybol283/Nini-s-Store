<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

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

            // Create the order in your database
            // TODO: Implement order creation logic

            // Clear the cart
            if (session()->has('cart')) {
                session()->forget('cart');
            }

            return response()->json([
                'success' => true,
            ]);
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
