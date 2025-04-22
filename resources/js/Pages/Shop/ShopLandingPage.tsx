import React, { useState, useEffect } from "react";
import ShopLayout from "@/Layouts/ShopLayout";
import { Link } from "@inertiajs/react";
import ProductCard from "@/Components/Shop/ProductCard";
import { Product } from "@/types";

interface Props {
    featuredProducts: Product[];
    categories: string[];
    ageGroups: string[];
}

export default function ShopLandingPage({
    featuredProducts = [],
    categories = [],
    ageGroups = [],
}: Props) {
    // Animation states
    const [isVisible, setIsVisible] = useState(false);

    // Trigger animations on component mount
    useEffect(() => {
        setIsVisible(true);
    }, []);

    // CSS for animated elements
    const animationBaseClass = "transition-all duration-700 transform";
    const beforeAnimation = `${animationBaseClass} opacity-0 translate-x-20`;
    const afterAnimation = `${animationBaseClass} opacity-100 translate-x-0`;

    return (
        <ShopLayout>
            <div className="p-8 font-sans">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-modak mb-4 text-green text-outline-white">
                        Welcome to My Unique Crocheted Shop
                    </h1>
                    <p className="text-lg">
                        Discover my exclusive, handmade crochet collection.
                    </p>
                </div>

                {/* Handcrafted Collection Categories */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">
                        Handcrafted Collection
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/shop/adults">
                            <div className="p-4 bg-beige rounded-md text-center hover:bg-green hover:text-cream transition-colors duration-300">
                                <h3 className="text-2xl font-bold">Adults</h3>
                                <p className="mt-2 text-sm">
                                    Each piece is uniquely crocheted with love.
                                </p>
                            </div>
                        </Link>
                        <Link href="/shop/babies">
                            <div className="p-4 bg-beige rounded-md text-center hover:bg-green hover:text-cream transition-colors duration-300">
                                <h3 className="text-2xl font-bold">Babies</h3>
                                <p className="mt-2 text-sm">
                                    Soft, cozy crocheted items for your little
                                    ones.
                                </p>
                            </div>
                        </Link>
                    </div>
                </section>

                {/* New Arrivals */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-4">
                        New Arrivals
                    </h2>
                    {featuredProducts.length === 0 ? (
                        <p className="text-center text-gray-500">
                            No featured products available.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {featuredProducts
                                .slice(0, 4)
                                .map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={`${
                                            isVisible
                                                ? afterAnimation
                                                : beforeAnimation
                                        } delay-${index * 150}`}
                                        style={{
                                            transitionDelay: `${index * 150}ms`,
                                        }}
                                    >
                                        <ProductCard
                                            product={product}
                                            showDescription={false}
                                            className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg bg-white rounded shadow"
                                        />
                                    </div>
                                ))}
                        </div>
                    )}
                </section>

                {/* Why Choose Us */}
                <section className="mb-12 bg-beige rounded-lg p-8">
                    <h2 className="text-3xl font-semibold mb-6 text-center">
                        Why Choose Our Crocheted Items?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-cream rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Made with Love
                            </h3>
                            <p>
                                Each item is carefully crocheted by hand with
                                attention to detail and love.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-cream rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Quality Materials
                            </h3>
                            <p>
                                We use only the finest yarns and materials for
                                lasting comfort.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-cream rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Unique Designs
                            </h3>
                            <p>
                                Every piece is unique and tells its own story.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Popular Categories */}
                {categories.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-4">
                            Popular Categories
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {categories.map((category, index) => (
                                <Link
                                    key={category}
                                    href={`/shop/search?category=${category}`}
                                    className={`bg-cream p-4 rounded-md text-center hover:bg-green hover:text-cream transition-colors duration-300 ${
                                        isVisible
                                            ? afterAnimation
                                            : beforeAnimation
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <span className="text-lg font-medium capitalize">
                                        {category}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Now */}
                {featuredProducts.length > 4 && (
                    <section className="mb-12">
                        <h2 className="text-3xl font-semibold mb-4">
                            Trending Now
                        </h2>
                        <div className="md:flex md:flex-grow md:flex-wrap grid-cols-1 gap-6">
                            {featuredProducts
                                .slice(4, 8)
                                .map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={`${
                                            isVisible
                                                ? afterAnimation
                                                : beforeAnimation
                                        }`}
                                        style={{
                                            transitionDelay: `${
                                                (index + 4) * 150
                                            }ms`,
                                        }}
                                    >
                                        <ProductCard
                                            product={product}
                                            showDescription={false}
                                            className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg bg-white rounded shadow"
                                        />
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Customer Reviews */}
                <section className="mb-12">
                    <h2 className="text-3xl font-semibold mb-6 text-center">
                        What Our Customers Say
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah M.",
                                review: "The quality of the baby sweater I received is amazing. The crochet work is so soft and well-made!",
                                rating: 5,
                            },
                            {
                                name: "John D.",
                                review: "Love my new crocheted scarf! The attention to detail is incredible.",
                                rating: 5,
                            },
                            {
                                name: "Emma W.",
                                review: "The crocheted mittens are perfect for winter. Warm and stylish!",
                                rating: 5,
                            },
                        ].map((review, index) => (
                            <div
                                key={index}
                                className={`bg-white p-6 rounded-lg shadow-md ${
                                    isVisible ? afterAnimation : beforeAnimation
                                }`}
                                style={{
                                    transitionDelay: `${index * 200}ms`,
                                }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-5 h-5 text-yellow-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">
                                    "{review.review}"
                                </p>
                                <p className="font-semibold">{review.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="mb-12 bg-green text-cream rounded-lg p-8 text-center">
                    <h2 className="text-3xl font-semibold mb-4">
                        Ready to Find Your Perfect Crochet?
                    </h2>
                    <p className="mb-6 max-w-2xl mx-auto">
                        Browse our collection to find unique, handcrafted items
                        that will become treasured pieces in your wardrobe.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/shop/adults"
                            className="bg-cream text-green px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium"
                        >
                            Shop Adult Collection
                        </Link>
                        <Link
                            href="/shop/babies"
                            className="bg-cream text-green px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors font-medium"
                        >
                            Shop Baby Collection
                        </Link>
                    </div>
                </section>
            </div>
        </ShopLayout>
    );
}

ShopLayout;
