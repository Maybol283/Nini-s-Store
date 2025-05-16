import { Head, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { cartStorage } from "@/Utils/cartStorage";
import { Product } from "@/types";
import ShopLayout from "@/Layouts/ShopLayout";
import { Link } from "@inertiajs/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ProductCard from "@/Components/Shop/ProductCard";

interface Props {
    product: Product;
    relatedProducts?: Product[];
}

export default function ShopItem({ product, relatedProducts }: Props) {
    const [selectedSize, setSelectedSize] = useState(
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
    );
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const addToCart = () => {
        // Set loading state to true when process starts
        setIsLoading(true);

        const cartItem = {
            id: `${product.id}-${selectedSize}`,
            product_id: product.id,
            name: product.name,
            price: product.price,
            image:
                product.images && product.images.length > 0
                    ? product.images[0]
                    : {
                          imageSrc: "/images/placeholder.png",
                          imageAlt: product.name,
                      },
            category: product.category,
            quantity: 1,
        };

        // Check if item already exists in cart by product_id
        const cart = cartStorage.getCart();

        // Check if any item in the cart has the same product_id
        const itemExists = Object.values(cart.items).some(
            (item: any) => item.product_id === product.id
        );

        if (itemExists) {
            setIsLoading(false); // Reset loading state
            alert("This item is already in your cart");
            router.visit("/shop");
            return;
        }

        // Add the item to cart
        cartStorage.addItem(cartItem);

        // Sync with server
        router.post(
            "/cart/add",
            {
                product_id: cartItem.product_id,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Reset loading state on success
                    setIsLoading(false);
                    router.reload({ only: ["cart"] });
                    console.log("Cart updated successfully");
                    router.visit("/shop");
                },
                onError: (error) => {
                    // Reset loading state on error
                    setIsLoading(false);
                    console.log("Error updating cart:", error);
                },
            }
        );
    };

    // Default placeholder image
    const placeholderImage = {
        imageSrc: "/images/placeholder.png",
        imageAlt: product.name,
    };

    // Get available images or use placeholder
    const productImages =
        product.images && product.images.length > 0
            ? product.images
            : [placeholderImage];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === productImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? productImages.length - 1 : prevIndex - 1
        );
    };

    const [visibleProducts, setVisibleProducts] = useState(2); // Default to 2 for mobile

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                // lg
                setVisibleProducts(4);
            } else if (window.innerWidth >= 768) {
                // md
                setVisibleProducts(3);
            } else {
                // sm and below
                setVisibleProducts(2);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <ShopLayout>
            <Head title={product.name} />

            <div className="mx-auto px-4 pt-16 sm:px-6 sm:pt-24 lg:max-w-7xl xl:max-w-full lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                    {/* Image gallery with carousel */}
                    <div className="flex flex-col space-y-4">
                        {/* Main image with navigation arrows */}

                        <div className="relative flex items-center justify-center ">
                            <img
                                src={productImages[currentImageIndex].imageSrc}
                                alt={productImages[currentImageIndex].imageAlt}
                                className="max-w-[40vw] max-h-[85vh] object-cover object-center rounded-lg lg:mt-24 xl:mt-0"
                            />

                            {productImages.length > 1 && (
                                <>
                                    {/* Left arrow */}
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-10 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 rounded-full p-1 focus:outline-none"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6 text-charcoal" />
                                    </button>

                                    {/* Right arrow */}
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-10 top-1/2 -translate-y-1/2 bg-white/60 hover:bg-white/80 rounded-full p-1 focus:outline-none"
                                        aria-label="Next image"
                                    >
                                        <ChevronRightIcon className="h-6 w-6 text-charcoal" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails row */}
                        {productImages.length > 1 && (
                            <div className="flex space-x-2 overflow-x-auto pb-2 justify-center">
                                {productImages.map((image, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() =>
                                            setCurrentImageIndex(idx)
                                        }
                                        className={`cursor-pointer flex-shrink-0 w-16 h-16 border-2 ${
                                            currentImageIndex === idx
                                                ? "border-green"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={image.imageSrc}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="h-full w-full max-h-[10vh] object-cover object-center rounded-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="lg:mt-0 mt-24 px-4 sm:mt-24 sm:px-0 xl:mt-36">
                        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight text-charcoal">
                            {product.name}
                        </h1>

                        <div className="mt-3">
                            <h2 className="sr-only">Product information</h2>
                            <p className="text-3xl md:text-5xl lg:text-7xl tracking-tight text-green">
                                £{product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg md:text-3xl lg:text-5xl font-medium text-charcoal">
                                Description
                            </h3>
                            <div className="lg:text-lg mt-4 space-y-6 text-base text-lightGray">
                                {product.description}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg md:text-3xl lg:text-5xl font-medium text-charcoal">
                                Details
                            </h3>
                            <div className="mt-4 space-y-4 text-lightGray">
                                <p>
                                    <span className="font-medium md:text-lg lg:text-3xl">
                                        Category:
                                    </span>{" "}
                                    {product.category}
                                </p>
                                <p>
                                    <span className="font-medium md:text-lg lg:text-3xl">
                                        Age Group:
                                    </span>{" "}
                                    {product.age_group}
                                </p>
                                <p>
                                    <span className="font-medium md:text-lg lg:text-3xl">
                                        Size:
                                    </span>{" "}
                                    {product.sizes && product.sizes.length > 0
                                        ? product.sizes.join(", ")
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <button
                                onClick={addToCart}
                                disabled={!product.in_stock || isLoading}
                                className={`flex w-full items-center justify-center rounded-xl border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                    product.in_stock && !isLoading
                                        ? "bg-green hover:bg-opacity-90 focus:ring-green"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-pink"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Adding to cart...
                                    </>
                                ) : product.in_stock ? (
                                    "Add to cart"
                                ) : (
                                    "Out of stock"
                                )}
                            </button>
                        </div>

                        {!product.in_stock && (
                            <div className="mt-4 text-center">
                                <p className="text-lightGray">
                                    This unique piece is currently out of stock.
                                    Contact us to inquire about custom orders.
                                </p>
                                <Link
                                    href="/contact"
                                    className="mt-2 inline-block text-green hover:text-opacity-80"
                                >
                                    Contact for Custom Order
                                </Link>
                            </div>
                        )}

                        <div className="mt-4">
                            <p className="text-lightGray">
                                If you are unsure about sizes please visit our{" "}
                                <Link
                                    href="/size-guide"
                                    className="text-green hover:text-opacity-80"
                                >
                                    size guide
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* You Might Also Like */}
            <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-charcoal mb-8">
                    You Might Also Like
                </h2>
                {relatedProducts && relatedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-hidden">
                        {relatedProducts
                            .slice(0, visibleProducts)
                            .map((relatedProduct) => (
                                <ProductCard
                                    key={relatedProduct.id}
                                    product={relatedProduct}
                                    showDescription={false}
                                    className="transform transition duration-300 hover:-translate-y-1 hover:shadow-lg bg-white rounded shadow"
                                />
                            ))}
                    </div>
                ) : (
                    <p className="text-center">No related products found</p>
                )}
            </div>
        </ShopLayout>
    );
}
