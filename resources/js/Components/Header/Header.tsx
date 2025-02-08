import { Link } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const Header = () => {
    // When activeDropdown is 0, no dropdown is open.
    // Setting it to 1 will open the shop dropdown.
    const [activeDropdown, setActiveDropdown] = useState<number>(0);
    // Controls whether the dropdown element should be rendered.
    const [showDropdown, setShowDropdown] = useState(false);

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
                                                href="/shop/category1"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Sweaters
                                            </Link>
                                            <Link
                                                href="/shop/category2"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Skirts
                                            </Link>
                                            <Link
                                                href="/shop/category3"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Hats
                                            </Link>
                                            <Link
                                                href="/shop/category3"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                role="menuitem"
                                            >
                                                Gloves
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
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
