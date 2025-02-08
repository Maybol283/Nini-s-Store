import React from "react";
import ShopLayout from "@/Layouts/ShopLayout";

export default function BaseShop() {
    return (
        <ShopLayout>
            <div className="p-8 font-sans">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-modak mb-4 text-green text-outline-white">
                        Welcome to My Unique Handcrafted Shop
                    </h1>
                    <p className="text-lg">
                        Discover my exclusive, handmade collection of Sweaters,
                        Skirts, Gloves, and Hats.
                    </p>
                </div>

                {/* Handcrafted Collection Categories */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">
                        Handcrafted Collection
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-beige rounded-md text-center">
                            <h3 className="text-2xl font-bold">Sweaters</h3>
                            <p className="mt-2 text-sm">
                                Each sweater is uniquely hand-knitted with love.
                            </p>
                        </div>
                        <div className="p-4 bg-beige rounded-md text-center">
                            <h3 className="text-2xl font-bold">Skirts</h3>
                            <p className="mt-2 text-sm">
                                Our skirts are artisan-stitched to perfection.
                            </p>
                        </div>
                        <div className="p-4 bg-beige rounded-md text-center">
                            <h3 className="text-2xl font-bold">Gloves</h3>
                            <p className="mt-2 text-sm">
                                Find your perfect pair of handcrafted gloves.
                            </p>
                        </div>
                        <div className="p-4 bg-beige rounded-md text-center">
                            <h3 className="text-2xl font-bold">Hats</h3>
                            <p className="mt-2 text-sm">
                                Top off your look with our unique handmade hats.
                            </p>
                        </div>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">
                        New Arrivals
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Product Card for Sweater */}
                        <div className="bg-white p-4 rounded shadow">
                            <img
                                src="https://via.placeholder.com/300x200"
                                alt="Handmade Sweater"
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <h3 className="text-xl font-bold">
                                Handmade Sweater
                            </h3>
                            <p className="mt-2 text-green">$79.99</p>
                        </div>
                        {/* Product Card for Skirt */}
                        <div className="bg-white p-4 rounded shadow">
                            <img
                                src="https://via.placeholder.com/300x200"
                                alt="Artisan Skirt"
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <h3 className="text-xl font-bold">Artisan Skirt</h3>
                            <p className="mt-2 text-green">$69.99</p>
                        </div>
                        {/* Product Card for Gloves */}
                        <div className="bg-white p-4 rounded shadow">
                            <img
                                src="https://via.placeholder.com/300x200"
                                alt="Handcrafted Gloves"
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <h3 className="text-xl font-bold">
                                Handcrafted Gloves
                            </h3>
                            <p className="mt-2 text-green">$39.99</p>
                        </div>
                        {/* Product Card for Hat */}
                        <div className="bg-white p-4 rounded shadow">
                            <img
                                src="https://via.placeholder.com/300x200"
                                alt="Unique Handmade Hat"
                                className="w-full h-32 object-cover mb-4 rounded"
                            />
                            <h3 className="text-xl font-bold">
                                Unique Handmade Hat
                            </h3>
                            <p className="mt-2 text-green">$29.99</p>
                        </div>
                    </div>
                </section>

                {/* Call-to-Action */}
                <section className="text-center">
                    <p className="text-lg mb-4">
                        Every item is handmade and one of a kind. Experience the
                        uniqueness of our collection.
                    </p>
                    <button className="mt-6 px-8 py-2 border border-green hover:bg-green hover:text-cream transition-colors duration-300">
                        Explore Now
                    </button>
                </section>
            </div>
        </ShopLayout>
    );
}

ShopLayout;
