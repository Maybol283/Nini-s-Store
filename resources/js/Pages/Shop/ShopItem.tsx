import { Head, useForm, router } from "@inertiajs/react";
import React, { useState } from "react";
import { cartStorage } from "@/Utils/cartStorage";
import { Product } from "@/types";

interface Props {
    product: Product;
}

export default function ShopItem({ product }: Props) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        const cartItem = {
            id: `${product.id}-${selectedSize}`,
            product_id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images[0],
            category: product.category,
        };

        cartStorage.addItem(cartItem);

        // Sync with server
        router.post("/cart/add", cartItem, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ["cart"] });
            },
        });
    };

    return (
        <>
            <Head title={product.name} />
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
                        {/* Image gallery */}
                        <div className="flex flex-col-reverse">
                            <div className="aspect-h-1 aspect-w-1 w-full">
                                <img
                                    src={product.images[0].imageSrc}
                                    alt={product.images[0].imageAlt}
                                    className="h-full w-full object-cover object-center sm:rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Product info */}
                        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                {product.name}
                            </h1>

                            <div className="mt-3">
                                <h2 className="sr-only">Product information</h2>
                                <p className="text-3xl tracking-tight text-gray-900">
                                    ${product.price}
                                </p>
                            </div>

                            <div className="mt-6">
                                <h3 className="sr-only">Description</h3>
                                <div className="space-y-6 text-base text-gray-700">
                                    {product.description}
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        Size
                                    </h3>
                                </div>

                                <div className="mt-4">
                                    <div className="grid grid-cols-4 gap-4">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
                                                className={`${
                                                    selectedSize === size
                                                        ? "border-pink bg-pink text-white"
                                                        : "border-gray-200 bg-white text-gray-900"
                                                } flex items-center justify-center rounded-md border py-3 px-3 text-sm font-medium hover:bg-gray-50`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center">
                                    <label htmlFor="quantity" className="mr-4">
                                        Quantity:
                                    </label>
                                    <select
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) =>
                                            setQuantity(Number(e.target.value))
                                        }
                                        className="rounded-md border-gray-300"
                                    >
                                        {[1, 2, 3, 4, 5].map((num) => (
                                            <option key={num} value={num}>
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-10 flex">
                                <button
                                    onClick={addToCart}
                                    disabled={!product.inStock}
                                    className={`flex max-w-xl flex-1 items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        product.inStock
                                            ? "bg-pink hover:bg-pink-600 focus:ring-pink"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    {product.inStock
                                        ? "Add to cart"
                                        : "Out of stock"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
