import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Link, usePage, router } from "@inertiajs/react";
import React, { useState, useEffect, Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
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

interface PageProps {
    cart: {
        items: { [key: string]: CartItem };
        total: number;
        itemCount: number;
    };
    [key: string]: any;
}

const Header = () => {
    const { cart } = usePage<PageProps>().props;
    const cartItems = Object.values(cart.items);

    // When activeDropdown is 0, no dropdown is open.
    // Setting it to 1 will open the shop dropdown.
    const [activeDropdown, setActiveDropdown] = useState<number>(0);
    // Controls whether the dropdown element should be rendered.
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        // Sync cart with localStorage whenever server cart changes
        cartStorage.syncWithServer(cart);
    }, [cart]);

    useEffect(() => {
        // On initial load, check if we need to sync localStorage cart with server
        const localCart = cartStorage.getCart();
        if (
            Object.keys(localCart.items).length > 0 &&
            Object.keys(cart.items).length === 0
        ) {
            // If we have items in localStorage but not on server, sync to server
            router.post("/cart/sync", {
                items: JSON.stringify(localCart.items),
                total: localCart.total,
                itemCount: localCart.itemCount,
            });
        }
    }, []);

    useEffect(() => {
        if (activeDropdown === 1) {
            // When the dropdown becomes active, immediately show it.
            setShowDropdown(true);
        } else {
            // When dropdown is being closed, wait for the fade-out to finish (300ms)
            const timer = setTimeout(() => {
                setShowDropdown(false);
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeDropdown]);

    return (
        <header
            // When the mouse leaves the header, close all menus.
            onMouseLeave={() => setActiveDropdown(0)}
            className="text-cream py-4 px-6 border-b-8 border-pink bg-brown "
        >
            <div className="mx-auto flex justify-between items-center text-outline-green">
                <h1 className="text-2xl font-bold ">Knitted With Love</h1>
                <nav>
                    <ul className="flex space-x-6 font-modak ">
                        <li>
                            <Link
                                href="/"
                                className="hover:text-pink-400 text-outline-green"
                                onMouseEnter={() => setActiveDropdown(0)}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="hover:text-pink-400 text-outline-green"
                                onMouseEnter={() => setActiveDropdown(0)}
                            >
                                About
                            </Link>
                        </li>
                        <li>
                            <div className="relative inline-block text-left">
                                <div>
                                    <button
                                        // When hovering over "Shop", set the active dropdown to 1.
                                        onMouseEnter={() =>
                                            setActiveDropdown(1)
                                        }
                                        className="inline-flex justify-center w-full font-medium text-outline-green"
                                    >
                                        <Link
                                            className="text-outline-green"
                                            href="/shop"
                                        >
                                            Shop
                                        </Link>
                                    </button>
                                </div>
                                {showDropdown && (
                                    <div
                                        // The transition uses Tailwind's transition classes.
                                        // When activeDropdown is 1, the menu is visible (opacity-100);
                                        // when it's 0, it fades out to opacity-0 before being removed.
                                        className={`absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-opacity duration-300 ${
                                            activeDropdown === 1
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    >
                                        <div
                                            className="py-1 text-outline-transparent text-center font-sans"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="options-menu"
                                        >
                                            <Link
                                                href="/shop/search"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Browse
                                            </Link>
                                            <Link
                                                href="/size-guide"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Size Guide
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                        <Popover className="text-sm lg:relative pr-4 md:pr-12">
                            <Popover.Button className="group -m-2 flex items-center p-2">
                                <ShoppingBagIcon
                                    className="size-10 flex-shrink-0 text-gray-400 group-hover:text-palette-3"
                                    aria-hidden="true"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                                    {cart.itemCount}
                                </span>
                                <span className="sr-only">
                                    items in cart, view bag
                                </span>
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Popover.Panel className="absolute inset-x-0 top-10 sm:top-8 bg-palette-3 pb-6 shadow-lg sm:px-2 lg:left-auto lg:right-0 lg:top-full lg:-mr-1.5 lg:mt-3 lg:w-80 lg:rounded-lg lg:ring-1 lg:ring-black lg:ring-opacity-5 m-0 -mt-1">
                                    <h2 className="sr-only">Shopping Cart</h2>

                                    <form className="mx-auto max-w-2xl px-4">
                                        <ul
                                            role="list"
                                            className="divide-y divide-palette-1"
                                        >
                                            {cartItems.length === 0 ? (
                                                <li className="py-6 text-center">
                                                    <p className="text-palette-1">
                                                        No Products selected
                                                    </p>
                                                </li>
                                            ) : (
                                                cartItems.map((product) => (
                                                    <li
                                                        key={product.id}
                                                        className="flex items-center py-6"
                                                    >
                                                        <Link
                                                            href={`/shop/${product.category}/${product.name}`}
                                                        >
                                                            <div className="flex place-around pb-4">
                                                                <div className="h-16 w-16 flex-none rounded-md border border-gray-200">
                                                                    <img
                                                                        src={
                                                                            product
                                                                                .image
                                                                                .imageSrc
                                                                        }
                                                                        alt={
                                                                            product
                                                                                .image
                                                                                .imageAlt
                                                                        }
                                                                    />
                                                                </div>
                                                                <div className="ml-4 flex-auto">
                                                                    <h3 className="font-bold text-palette-1">
                                                                        <p>
                                                                            {
                                                                                product.name
                                                                            }
                                                                        </p>
                                                                    </h3>
                                                                    <div className="text-white">
                                                                        <p>
                                                                            Quantity:{" "}
                                                                            {
                                                                                product.quantity
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                        <Link
                                            href="/checkout"
                                            className="w-full"
                                        >
                                            <button
                                                type="button"
                                                className="w-full rounded-md border border-transparent bg-palette-1 px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:text-palette-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                            >
                                                Checkout
                                            </button>
                                        </Link>
                                        <p className="mt-6 text-center">
                                            <Link
                                                href="/cart"
                                                className="text-sm font-medium text-gray-300 hover:text-palette-1"
                                            >
                                                View Shopping Bag
                                            </Link>
                                        </p>
                                    </form>
                                </Popover.Panel>
                            </Transition>
                        </Popover>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
