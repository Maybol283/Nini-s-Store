import { Link } from "@inertiajs/react";
import ShopLayout from "@/Layouts/ShopLayout";

export default function ThankYou() {
    return (
        <ShopLayout>
            <div className="bg-cream py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-brown sm:text-5xl">
                            Thank you for your order!
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-brown/70">
                            Your order has been received and is now being
                            processed. You will receive a confirmation email
                            shortly.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/shop"
                                className="rounded-md bg-brown px-3.5 py-2.5 text-sm font-semibold text-cream shadow-sm hover:bg-brown/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brown"
                            >
                                Continue shopping
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-semibold leading-6 text-brown"
                            >
                                Learn more about us{" "}
                                <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
