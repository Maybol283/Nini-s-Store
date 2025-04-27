import { Link, router } from "@inertiajs/react";
import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { formatCurrency } from "../../Utils/helpers";
import { cartStorage } from "@/Utils/cartStorage";

interface CartItem {
    id: string;
    product_id: number;
    name: string;
    price: number;
    quantity: number;
    image: {
        imageSrc: string;
        imageAlt: string;
    };
    category: string;
}

interface CartPanelProps {
    cartItems: CartItem[];
    position?: "mobile" | "desktop";
}

const CartPanel = ({ cartItems, position = "desktop" }: CartPanelProps) => {
    // Different styling based on position
    const panelClassName =
        position === "desktop"
            ? "absolute inset-x-0 top-10 sm:top-8 bg-palette-3 pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-3 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5"
            : "absolute right-0 top-10 bg-palette-3 pb-6 shadow-lg w-80 rounded-lg ring-1 ring-black ring-opacity-5 z-50";

    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    // Handle removing an item from the cart
    const handleRemoveItem = (itemId: string) => {
        // First update local storage to maintain UI consistency
        cartStorage.removeItem(itemId);

        // Then send delete request to server
        router.delete(`/cart/remove/${itemId}`, {
            preserveScroll: true,
            onBefore: () => {
                console.log("Removing item:", itemId);
                return true;
            },
            onSuccess: () => {
                console.log("Item removed successfully");
            },
            onError: (errors) => {
                console.error("Failed to remove item:", errors);
            },
        });
    };

    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={panelClassName}>
                <div className="px-4 py-3 bg-brown text-cream">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <p className="text-sm">
                        {cartItems.length}{" "}
                        {cartItems.length === 1 ? "item" : "items"}
                    </p>
                </div>

                <div className="divide-y divide-gray-200">
                    {cartItems.length === 0 ? (
                        <div className="py-6 px-4 text-center">
                            <p className="text-gray-500">Your cart is empty</p>
                            <Link
                                href="/shop"
                                className="mt-4 inline-block text-sm text-brown hover:text-pink-500 font-medium"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <li key={item.id} className="py-4 px-4">
                                        <div className="flex items-start">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.image.imageSrc}
                                                    alt={item.image.imageAlt}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3 className="font-medium line-clamp-1">
                                                            <Link
                                                                href={`/shop/item/${item.product_id}`}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="ml-4 text-cream">
                                                            {formatCurrency(
                                                                item.price
                                                            )}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-300">
                                                        {item.category}
                                                    </p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <p className="text-gray-200">
                                                        Qty {item.quantity}
                                                    </p>
                                                    <div className="flex">
                                                        <button
                                                            onClick={() =>
                                                                handleRemoveItem(
                                                                    item.id
                                                                )
                                                            }
                                                            className="font-medium text-red-400 hover:text-red-300"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                    <p className="text-cream">Subtotal</p>
                                    <p className="text-cream font-bold">
                                        {formatCurrency(subtotal)}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Link href="/cart">
                                        <button className="w-full border border-cream bg-brown py-2 px-4 text-sm font-medium text-cream shadow-sm hover:bg-brown-600 hover:text-white">
                                            View Cart
                                        </button>
                                    </Link>
                                    <Link href="/checkout">
                                        <button className="w-full bg-pink-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-pink-600">
                                            Checkout
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Transition>
    );
};

export default CartPanel;
