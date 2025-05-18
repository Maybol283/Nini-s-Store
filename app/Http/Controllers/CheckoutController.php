<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderCompleted;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
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
                $shipping = 5;
                $vat = $cart['total'] * 0.0;
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
        $validator = Validator::make($request->all(), [
            'payment_intent_id' => 'required|string',
            'shipping.name' => 'required|string',
            'shipping.address.line1' => 'required|string',
            'shipping.address.line2' => 'nullable|string',
            'shipping.address.city' => 'required|string',
            'shipping.address.postal_code' => 'required|string',
            'shipping.address.country' => 'required|string',
            'email' => 'required|email',

        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', [
                'errors' => $validator->errors()->toArray(),
                'request_data' => $request->all()
            ]);

            return back()->withErrors($validator->errors());
        }

        try {
            // Verify the payment with Stripe
            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
            $paymentIntent = PaymentIntent::retrieve($request->payment_intent_id);

            if ($paymentIntent->status !== 'succeeded') {
                return response()->json([
                    'error' => 'Payment was not successful.',
                ], 400);
            }

            $cart = session('cart', ['items' => [], 'total' => 0, 'itemCount' => 0]);

            // Recalculate total from trusted data
            $cartTotal = 0;
            foreach ($cart['items'] as $item) {
                // Get current price from database
                $product = Product::find($item['product_id']);
                $cartTotal += $product->price * $item['quantity'];
            }
            // Add shipping and tax
            $finalTotal = $cartTotal + $cartTotal * 0.0 + 5; // VAT + shipping


            // Create the order
            $order = Order::create([
                'user_id' => Auth::check() ? Auth::id() : null,
                'total_amount' => $finalTotal,
                'status' => 'processing',
                'shipping_name' => $request->shipping['name'],
                'shipping_email' => $request->email,
                'shipping_address_line1' => $request->shipping['address']['line1'],
                'shipping_address_line2' => $request->shipping['address']['line2'] ?? null,
                'shipping_city' => $request->shipping['address']['city'],
                'shipping_postal_code' => $request->shipping['address']['postal_code'],
                'shipping_country' => $request->shipping['address']['country'],
            ]);

            // Create order items and update inventory
            foreach ($cart['items'] as $item) {
                $product = Product::find($item['product_id']);

                // Create order item
                $order->items()->create([
                    'product_id' => $item['product_id'],
                    'product_name' => $product->name,
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'size' => $product->size,
                ]);


                $product->in_stock = false;
                $product->save();

                // Log the inventory update
                logger()->info('Product marked as sold', [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'order_id' => $order->id
                ]);
            }

            // Send order confirmation email
            Mail::to($order->shipping_email)
                ->send(new OrderCompleted($order));

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
