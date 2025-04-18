import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";

type FormDataConvertible = string | number | boolean | Blob | null;

interface ProductForm {
    name: string;
    price: number;
    description: string;
    category: string;
    sizes: string[];
    images: File[];
    inStock: boolean;
    [key: string]: FormDataConvertible | FormDataConvertible[] | undefined;
}

const categories = [
    { value: "scarves", label: "Scarves" },
    { value: "sweaters", label: "Sweaters" },
    { value: "hats", label: "Hats" },
    { value: "gloves", label: "Gloves" },
    { value: "miscellaneous", label: "Miscellaneous" },
];

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<ProductForm>({
        name: "",
        price: 0,
        description: "",
        category: categories[0].value,
        sizes: [],
        images: [],
        inStock: true,
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setData("images", files);

        // Create preview URLs
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleSizeToggle = (size: string) => {
        const newSizes = data.sizes.includes(size)
            ? data.sizes.filter((s) => s !== size)
            : [...data.sizes, size];
        setData("sizes", newSizes);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/admin/products", {
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Add Product" />
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Add New Product</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Price ($)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={(e) =>
                                setData("price", Number(e.target.value))
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                        />
                        {errors.price && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.price}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={data.description}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <select
                            value={data.category}
                            onChange={(e) =>
                                setData("category", e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.category}
                            </p>
                        )}
                    </div>

                    {/* Sizes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Available Sizes
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`${
                                        data.sizes.includes(size)
                                            ? "bg-pink text-white"
                                            : "bg-white text-gray-700"
                                    } px-4 py-2 rounded-md border border-gray-300`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {errors.sizes && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.sizes}
                            </p>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Images
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="mt-1 block w-full"
                        />
                        {errors.images && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.images}
                            </p>
                        )}
                        {/* Image previews */}
                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {previewUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />
                            ))}
                        </div>
                    </div>

                    {/* In Stock */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={data.inStock}
                            onChange={(e) =>
                                setData("inStock", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300 text-pink focus:ring-pink"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            In Stock
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink disabled:opacity-50"
                        >
                            {processing ? "Adding Product..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
