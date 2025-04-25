import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, usePage, router } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import React, { useState, useEffect, Fragment } from "react";
import {
    Popover,
    Transition,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Dialog,
    DialogPanel,
    PopoverPanel,
    PopoverButton,
} from "@headlessui/react";
import { cartStorage } from "@/Utils/cartStorage";
import CartPanel from "./CartPanel";

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

interface Auth {
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface SharedPageProps {
    cart?: {
        items: { [key: string]: CartItem };
        total: number;
        itemCount: number;
    };
    auth: Auth;
}

type PageProps = InertiaPageProps & SharedPageProps;

const Header = () => {
    const { cart: serverCart, auth } = usePage<PageProps>().props;
    const user = auth.user;

    // Provide default empty cart if serverCart is undefined
    const cart = serverCart || { items: {}, total: 0, itemCount: 0 };
    // Ensure items is never undefined before using Object.values
    const cartItems = Array.isArray(Object.values(cart.items || {}))
        ? Object.values(cart.items || {})
        : [];

    // When activeDropdown is 0, no dropdown is open.
    // Setting it to 1 will open the shop dropdown.
    const [activeDropdown, setActiveDropdown] = useState<number>(0);
    // Controls whether the dropdown element should be rendered.
    const [showDropdown, setShowDropdown] = useState(false);
    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        router.post("/logout");
    };

    useEffect(() => {
        // Sync cart with localStorage whenever server cart changes
        cartStorage.syncWithServer(cart);
    }, [cart]);

    useEffect(() => {
        // On initial load, check if we need to sync localStorage cart with server
        const localCart = cartStorage.getCart();
        const cartItemsObj = cart?.items || {};

        if (
            Object.keys(localCart.items).length > 0 &&
            Object.keys(cartItemsObj).length === 0
        ) {
            // If we have items in localStorage but not on server, sync to server
            router.post(
                "/cart/sync",
                {
                    items: JSON.stringify(localCart.items),
                    total: localCart.total,
                    itemCount: localCart.itemCount,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
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
            className="text-cream py-4 px-6 border-b-8 border-pink bg-brown"
        >
            <div className="mx-auto flex justify-between items-center text-outline-green">
                <h1 className="text-2xl font-bold">Crocheted With Love</h1>

                {/* Mobile menu button */}
                <div className="flex md:hidden">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center p-2 rounded-md text-cream hover:text-pink-400"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Popover className="relative flex items-center ml-2">
                        <PopoverButton className="group flex items-center p-2">
                            <ShoppingBagIcon
                                className="size-6 flex-shrink-0 text-cream group-hover:text-pink-400"
                                aria-hidden="true"
                            />
                            <span className="ml-2 text-sm font-medium text-cream group-hover:text-pink-400">
                                {cart.itemCount || 0}
                            </span>
                            <span className="sr-only">
                                items in cart, view bag
                            </span>
                        </PopoverButton>
                        <CartPanel cartItems={cartItems} position="mobile" />
                    </Popover>
                </div>

                {/* Desktop navigation */}
                <nav className="hidden md:flex items-center">
                    <ul className="flex items-center space-x-6 font-modak">
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
                                        className="inline-flex justify-center w-full font-medium text-outline-green hover:text-pink-400"
                                    >
                                        <Link
                                            className="text-outline-green hover:text-pink-400"
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
                                                href="/shop/adults"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Adults
                                            </Link>
                                            <Link
                                                href="/shop/babies"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Babies
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
                        {/* Auth links */}
                        {user ? (
                            <li className="relative">
                                <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                >
                                    <div>
                                        <MenuButton className="inline-flex justify-center w-full hover:text-pink-400 text-outline-green font-medium">
                                            {user.name}
                                        </MenuButton>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                            <MenuItem>
                                                {({ active }) => (
                                                    <Link
                                                        href="/dashboard"
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } block px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Dashboard
                                                    </Link>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                    >
                                                        Log out
                                                    </button>
                                                )}
                                            </MenuItem>
                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </li>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        href="/login"
                                        className="hover:text-pink-400 text-outline-green"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/register"
                                        className="hover:text-pink-400 text-outline-green"
                                    >
                                        Register
                                    </Link>
                                </li>
                            </>
                        )}
                        <li>
                            <Popover className="relative flex items-center">
                                <Popover.Button className="group flex items-center p-2">
                                    <ShoppingBagIcon
                                        className="size-6 flex-shrink-0 text-cream group-hover:text-pink-400"
                                        aria-hidden="true"
                                    />
                                    <span className="ml-2 text-sm font-medium text-cream group-hover:text-pink-400">
                                        {cart.itemCount || 0}
                                    </span>
                                    <span className="sr-only">
                                        items in cart, view bag
                                    </span>
                                </Popover.Button>
                                <CartPanel
                                    cartItems={cartItems}
                                    position="desktop"
                                />
                            </Popover>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Mobile menu dialog */}
            <Dialog
                open={mobileMenuOpen}
                onClose={setMobileMenuOpen}
                className="relative z-40 md:hidden"
            >
                <div className="fixed inset-0 bg-black/25" aria-hidden="true" />

                <div className="fixed inset-0 z-40 flex">
                    <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-brown px-6 py-8 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-cream">
                                Menu
                            </h2>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-md text-cream hover:text-pink-400"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon
                                    className="h-6 w-6"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>

                        <div className="mt-6 border-t border-pink pt-6">
                            <nav className="grid gap-y-6">
                                <Link
                                    href="/"
                                    className="text-cream hover:text-pink-400 text-lg font-modak"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-cream hover:text-pink-400 text-lg font-modak"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    About
                                </Link>
                                <Link
                                    href="/shop"
                                    className="text-cream hover:text-pink-400 text-lg font-modak"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Shop
                                </Link>
                                <div className="grid grid-cols-1 gap-y-4 pl-6">
                                    <Link
                                        href="/shop/adults"
                                        className="text-cream hover:text-pink-400 text-base font-modak"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Adults
                                    </Link>
                                    <Link
                                        href="/shop/babies"
                                        className="text-cream hover:text-pink-400 text-base font-modak"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Babies
                                    </Link>
                                    <Link
                                        href="/size-guide"
                                        className="text-cream hover:text-pink-400 text-base font-modak"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Size Guide
                                    </Link>
                                </div>

                                {/* Auth links */}
                                {user ? (
                                    <>
                                        <Link
                                            href="/dashboard"
                                            className="text-cream hover:text-pink-400 text-lg font-modak"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className="text-cream hover:text-pink-400 text-lg font-modak text-left"
                                        >
                                            Log out
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="text-cream hover:text-pink-400 text-lg font-modak"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="text-cream hover:text-pink-400 text-lg font-modak"
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}

                                <Link
                                    href="/cart"
                                    className="text-cream hover:text-pink-400 text-lg font-modak"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cart ({cart.itemCount || 0})
                                </Link>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </header>
    );
};

export default Header;
