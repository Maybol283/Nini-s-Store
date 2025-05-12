import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import {
    Popover,
    PopoverBackdrop,
    PopoverButton,
    PopoverPanel,
} from "@headlessui/react";
import ShopLayout from "@/Layouts/ShopLayout";
import { router, usePage } from "@inertiajs/react";
import { CartItem, Cart, PageProps } from "@/types";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    LinkAuthenticationElement,
    useStripe,
    useElements,
    AddressElement,
} from "@stripe/react-stripe-js";
import { cartStorage } from "@/Utils/cartStorage";

const Billings = {
    VAT: 0.2,
    Shipping: 10,
};

// We'll get the stripe key from the server props now
export default function Checkout() {
    const { cart, stripeKey, clientSecret, stripeError } =
        usePage<PageProps>().props;
    const cartItems = Object.values(cart.items || {});
    const [error, setError] = useState<string | null>(stripeError || null);
    const [stripePromise, setStripePromise] = useState<any>(null);

    console.log(cart.items);

    // Calculate total amount including VAT and shipping
    const totalAmount = (
        cart.total +
        Billings.Shipping +
        cart.total * Billings.VAT
    ).toFixed(2);

    // Initialize Stripe once we have the key
    useEffect(() => {
        if (stripeKey) {
            setStripePromise(loadStripe(stripeKey));
        }
    }, [stripeKey]);

    const appearance = {
        theme: "stripe" as const,
        variables: {
            colorPrimary: "#7C5E4C",
            colorBackground: "#F5F0E6",
            fontFamily: "inherit",
        },
    };

    // Stripe options including appearance
    const options = clientSecret
        ? {
              clientSecret: clientSecret as string,
              appearance,
          }
        : undefined;

    return (
        <div className="bg-cream font-sans">
            {/* Background color split screen for large screens */}
            <div
                aria-hidden="true"
                className="fixed left-0 top-0 hidden h-full w-1/2 bg-cream lg:block"
            />
            <div
                aria-hidden="true"
                className="fixed right-0 top-0 hidden h-full w-1/2 bg-beige lg:block"
            />

            <main className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
                <h1 className="sr-only">Order information</h1>

                <section
                    aria-labelledby="summary-heading"
                    className="bg-beige px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
                >
                    <div className="mx-auto max-w-lg lg:max-w-none">
                        <h2
                            id="summary-heading"
                            className="text-lg font-medium text-brown"
                        >
                            Order summary
                        </h2>

                        <ul
                            role="list"
                            className="divide-y divide-brown/20 text-sm font-medium text-green"
                        >
                            {cartItems.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex items-start space-x-4 py-6"
                                >
                                    <img
                                        alt={item.image.imageAlt}
                                        src={item.image.imageSrc}
                                        className="size-20 flex-none rounded-md object-cover"
                                    />
                                    <div className="flex-auto space-y-1">
                                        <h3>{item.name}</h3>
                                    </div>
                                    <p className="flex-none text-base font-medium text-brown">
                                        £{item.price}
                                    </p>
                                </li>
                            ))}
                        </ul>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt>Subtotal</dt>
                                <dd>£{cart.total}</dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <dt>Shipping</dt>
                                <dd>£{Billings.Shipping}</dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <dt>VAT (20%)</dt>
                                <dd>
                                    £{(cart.total * Billings.VAT).toFixed(2)}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between border-t border-brown/20 pt-6">
                                <dt className="text-base text-brown">Total</dt>
                                <dd className="text-base font-bold text-brown">
                                    £
                                    {(
                                        cart.total +
                                        Billings.Shipping +
                                        cart.total * Billings.VAT
                                    ).toFixed(2)}
                                </dd>
                            </div>
                        </dl>

                        <Popover className="fixed inset-x-0 bottom-0 flex flex-col-reverse text-sm font-medium text-brown lg:hidden">
                            <div className="relative z-10 border-t border-brown/20 bg-cream px-4 sm:px-6">
                                <div className="mx-auto max-w-lg">
                                    <PopoverButton className="flex w-full items-center py-6 font-medium">
                                        <span className="mr-auto text-base">
                                            Total
                                        </span>
                                        <span className="mr-2 text-base">
                                            £{totalAmount}
                                        </span>
                                        <ChevronUpIcon
                                            aria-hidden="true"
                                            className="size-5 text-brown"
                                        />
                                    </PopoverButton>
                                </div>
                            </div>

                            <PopoverBackdrop
                                transition
                                className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
                            />

                            <PopoverPanel
                                transition
                                className="relative transform bg-cream px-4 py-6 transition duration-300 ease-in-out data-[closed]:translate-y-full sm:px-6"
                            >
                                {/* Mobile summary details */}
                            </PopoverPanel>
                        </Popover>
                    </div>
                </section>

                <div className="px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
                    <div className="mx-auto max-w-lg lg:max-w-none">
                        <section aria-labelledby="contact-info-heading">
                            <h2
                                id="contact-info-heading"
                                className="text-lg font-medium text-brown"
                            >
                                Checkout
                            </h2>
                        </section>

                        {error && (
                            <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        {!stripePromise && (
                            <div className="mt-6 text-center">
                                <div
                                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-brown align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                    role="status"
                                >
                                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                                        Loading...
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-brown">
                                    Initializing payment system...
                                </p>
                            </div>
                        )}

                        {stripePromise &&
                            !clientSecret &&
                            cartItems.length > 0 && (
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-brown">
                                        Please refresh the page to initialize
                                        the payment system.
                                    </p>
                                </div>
                            )}

                        {stripePromise && clientSecret && (
                            <div className="mt-6">
                                <Elements
                                    stripe={stripePromise}
                                    options={options}
                                >
                                    <CheckoutForm />
                                </Elements>
                            </div>
                        )}

                        {cartItems.length === 0 && (
                            <div className="mt-6 rounded-md bg-yellow-50 p-4 text-sm text-yellow-700">
                                Your cart is empty. Add some products before
                                checking out.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        // Retrieve the payment intent client secret from the URL query parameters
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        // If we have a client secret in the URL, it means we've returned from payment
        // So we check the status of the payment and show appropriate messages
        if (clientSecret) {
            stripe
                .retrievePaymentIntent(clientSecret)
                .then(({ paymentIntent }) => {
                    if (!paymentIntent) return;

                    switch (paymentIntent.status) {
                        case "succeeded":
                            setMessage("Payment succeeded!");
                            console.log("Payment succeeded!");
                            const shippingDetails = paymentIntent.shipping;
                            // Clear cart locally BEFORE processing
                            cartStorage.clearCart();
                            console.log("Cart cleared!");
                            setIsProcessingOrder(true);
                            console.log("Order processing started!");
                            console.log(shippingDetails);
                            console.log(paymentIntent);
                            console.log(email);
                            // Process the successful payment on the server with all required details
                            router.post("/checkout/process-payment", {
                                payment_intent_id: paymentIntent.id,
                                shipping: {
                                    name: shippingDetails?.name,
                                    address: {
                                        line1: shippingDetails?.address?.line1,
                                        line2: shippingDetails?.address?.line2,
                                        city: shippingDetails?.address?.city,
                                        postal_code:
                                            shippingDetails?.address
                                                ?.postal_code,
                                        country:
                                            shippingDetails?.address?.country,
                                    },
                                    phone: shippingDetails?.phone,
                                },
                                email: "nigorabay1998@gmail.com",
                                total_amount: paymentIntent.amount,
                            });

                            break;
                        case "processing":
                            setMessage("Your payment is processing.");
                            break;
                        case "requires_payment_method":
                            setMessage(
                                "Your payment was not successful, please try again."
                            );
                            break;
                        default:
                            setMessage("Something went wrong.");
                            break;
                    }
                });
        }
    }, [stripe]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Return directly to the thank you page for a cleaner URL flow
                return_url: `${window.location.origin}/checkout`,
            },
        });

        // This point will only be reached if there's an immediate error when
        // confirming the payment. Otherwise, the customer will be redirected to
        // the `return_url` and the status will be handled there.
        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message || "An unexpected error occurred.");
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    // If we're processing the order, show a processing spinner
    if (isProcessingOrder) {
        return (
            <div className="text-center py-12">
                <div
                    className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-brown align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Processing order...
                    </span>
                </div>
                <p className="mt-4 text-lg font-medium text-brown">
                    Processing your order...
                </p>
                <p className="mt-2 text-sm text-brown">
                    Please do not close this page. You will be redirected to the
                    confirmation page shortly.
                </p>
            </div>
        );
    }

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <LinkAuthenticationElement />

            <div className="mt-6">
                <h3 className="text-sm font-medium text-brown mb-2">
                    Shipping information
                </h3>
                <AddressElement options={{ mode: "shipping" }} />
            </div>

            <div className="mt-6">
                <h3 className="text-sm font-medium text-brown mb-2">
                    Payment method
                </h3>
                <PaymentElement id="payment-element" />
            </div>

            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="mt-8 w-full rounded-md border border-transparent bg-brown px-4 py-2 text-base font-medium text-cream shadow-sm hover:bg-brown/90 focus:outline-none focus:ring-2 focus:ring-brown focus:ring-offset-2 focus:ring-offset-cream disabled:opacity-50"
            >
                <span id="button-text">
                    {isLoading ? (
                        <div className="spinner" id="spinner">
                            Processing...
                        </div>
                    ) : (
                        "Pay now"
                    )}
                </span>
            </button>

            {/* Show any error or success messages */}
            {message && (
                <div
                    id="payment-message"
                    className="mt-4 text-sm text-center text-brown"
                >
                    {message}
                </div>
            )}
        </form>
    );
}
