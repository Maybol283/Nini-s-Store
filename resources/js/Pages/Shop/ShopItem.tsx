import { Head, useForm, router } from "@inertiajs/react";
import React, { useState } from "react";
import { cartStorage } from "@/Utils/cartStorage";
import { Product } from "@/types";
import ShopLayout from "@/Layouts/ShopLayout";
import { Link } from "@inertiajs/react";

interface Props {
    product: Product;
    relatedProducts?: Product[];
}

export default function ShopItem({ product, relatedProducts }: Props) {
    const [selectedSize, setSelectedSize] = useState(
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
    );

    const addToCart = () => {
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

        cartStorage.addItem(cartItem);

        // Sync with server
        router.post("/cart/add", cartItem, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["cart"] });
                console.log("Cart updated successfully");
            },
            onError: (error) => {
                console.log("Error updating cart:", error);
            },
        });
    };

    console.log(product);

    return (
        <ShopLayout>
            <Head title={product.name} />
            <div className="justify-center">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        {/* Image gallery */}
                        <div className="flex flex-col-reverse">
                            <div className="aspect-h-1 aspect-w-1 w-full">
                                <img
                                    src={
                                        product.images &&
                                        product.images.length > 0
                                            ? product.images[0].imageSrc
                                            : "/images/placeholder.png"
                                    }
                                    alt={
                                        product.images &&
                                        product.images.length > 0
                                            ? product.images[0].imageAlt
                                            : product.name
                                    }
                                    className="h-full w-full object-cover object-center sm:rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-3xl font-bold tracking-tight text-charcoal">
                                {product.name}
                            </h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl tracking-tight text-green">
                                    £{product.price.toFixed(2)}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-charcoal">
                                    Description
                                </h3>
                                <div className="mt-4 space-y-6 text-base text-lightGray">
                                    {product.description}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-charcoal">
                                    Details
                                </h3>
                                <div className="mt-4 space-y-4 text-lightGray">
                                    <p>
                                        <span className="font-medium">
                                            Category:
                                        </span>{" "}
                                        {product.category}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Age Group:
                                        </span>{" "}
                                        {product.age_group}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Size:
                                        </span>{" "}
                                        {product.size}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h3 className="text-lg font-medium text-charcoal">
                                    Care Instructions
                                </h3>
                                <div className="mt-4 space-y-2 text-lightGray">
                                    <p>
                                        • Hand wash in cold water with mild
                                        detergent
                                    </p>
                                    <p>• Gently squeeze out excess water</p>
                                    <p>• Lay flat to dry on a clean towel</p>
                                    <p>• Avoid direct sunlight while drying</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <button
                                    onClick={addToCart}
                                    disabled={!product.in_stock}
                                    className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        product.in_stock
                                            ? "bg-green hover:bg-opacity-90 focus:ring-green"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {product.in_stock
                                        ? "Add to cart"
                                        : "Out of stock"}
                                </button>
                            </div>

                            {!product.in_stock && (
                                <div className="mt-4 text-center">
                                    <p className="text-lightGray">
                                        This unique piece is currently out of
                                        stock. Contact us to inquire about
                                        custom orders.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="mt-2 inline-block text-green hover:text-opacity-80"
                                    >
                                        Contact for Custom Order
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* You Might Also Like */}
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-charcoal mb-8">
                        You Might Also Like
                    </h2>
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedProducts?.map((relatedProduct) => (
                            <div
                                key={relatedProduct.id}
                                className="group relative"
                            >
                                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-beige">
                                    <img
                                        src={
                                            relatedProduct.images &&
                                            relatedProduct.images.length > 0
                                                ? relatedProduct.images[0]
                                                      .imageSrc
                                                : "/images/placeholder.png"
                                        }
                                        alt={
                                            relatedProduct.images &&
                                            relatedProduct.images.length > 0
                                                ? relatedProduct.images[0]
                                                      .imageAlt
                                                : relatedProduct.name
                                        }
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-charcoal">
                                            <Link
                                                href={`/shop/item/${relatedProduct.id}`}
                                            >
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute inset-0"
                                                />
                                                {relatedProduct.name}
                                            </Link>
                                        </h3>
                                        <p className="mt-1 text-sm text-lightGray">
                                            {relatedProduct.category}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-green">
                                        £{relatedProduct.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
