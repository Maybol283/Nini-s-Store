import { Head, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import ShopLayout from "@/Layouts/ShopLayout";
type FormDataConvertible = string | number | boolean | Blob | null;

interface ProductForm {
    name: string;
    price: number;
    description: string;
    category: string;
    age_group: string;
    size: string;
    images: File[];
    inStock: boolean;
    [key: string]: FormDataConvertible | FormDataConvertible[] | undefined;
}

interface ImageError {
    file: File;
    error: string;
}

const categories = [
    { value: "scarves", label: "Scarves" },
    { value: "sweaters", label: "Sweaters" },
    { value: "hats", label: "Hats" },
    { value: "gloves", label: "Gloves" },
    { value: "dresses", label: "Dresses" },
    { value: "miscellaneous", label: "Miscellaneous" },
];

const ageGroups = [
    { value: "adult", label: "Adult" },
    { value: "baby", label: "Baby" },
];

const adultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const babySizes = ["0-3M", "3-6M", "6-12M", "12-18M", "18-24M"];

function Create() {
    const { data, setData, post, processing, errors } = useForm<ProductForm>({
        name: "",
        price: 0,
        description: "",
        category: categories[0].value,
        age_group: ageGroups[0].value,
        size: "",
        images: [],
        inStock: true,
    });

    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [availableSizes, setAvailableSizes] = useState<string[]>(adultSizes);
    const [imageErrors, setImageErrors] = useState<ImageError[]>([]);

    // Update available sizes when age group changes
    useEffect(() => {
        if (data.age_group === "adult") {
            setAvailableSizes(adultSizes);
            // Reset size selection when switching age groups
            if (data.size && !adultSizes.includes(data.size)) {
                setData("size", "");
            }
        } else {
            setAvailableSizes(babySizes);
            // Reset size selection when switching age groups
            if (data.size && !babySizes.includes(data.size)) {
                setData("size", "");
            }
        }
    }, [data.age_group]);

    const validateImage = (file: File): string | null => {
        // Check file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            return `${file.name} exceeds 2MB limit`;
        }

        // Check file type
        const acceptedTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!acceptedTypes.includes(file.type)) {
            return `${file.name} must be JPEG, PNG, or JPG`;
        }

        return null;
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;

        const files = Array.from(fileList);

        // Validate max 5 images
        if (files.length > 5) {
            setImageErrors([
                { file: files[0], error: "Maximum 5 images allowed" },
            ]);
            return;
        }

        // Validate each image
        const newErrors: ImageError[] = [];
        files.forEach((file) => {
            const error = validateImage(file);
            if (error) {
                newErrors.push({ file, error });
            }
        });

        setImageErrors(newErrors);

        // Only set valid images
        const validFiles =
            newErrors.length > 0
                ? files.filter(
                      (file) => !newErrors.some((err) => err.file === file)
                  )
                : files;

        setData("images", validFiles);

        // Create preview URLs for valid images
        const urls = validFiles.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleSizeSelect = (size: string) => {
        setData("size", size);
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
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg font-sans">
                <h1 className="text-3xl font-bold mb-2 text-green">
                    Add New Product
                </h1>
                <p className="text-gray-600 mb-6">
                    Create a new product for your store
                </p>

                {data.age_group && (
                    <div className="mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green bg-opacity-10 text-green">
                            {data.age_group === "adult"
                                ? "Adult Product"
                                : "Baby Product"}
                        </span>
                        {data.category && (
                            <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink bg-opacity-10 text-pink">
                                {
                                    categories.find(
                                        (c) => c.value === data.category
                                    )?.label
                                }
                            </span>
                        )}
                    </div>
                )}

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
                            className={`mt-1 block w-full rounded-md shadow-sm ${
                                errors.name
                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-pink focus:ring-pink"
                            }`}
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
                            Price (£)
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

                    {/* Age Group */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Age Group
                        </label>
                        <div className="mt-2 grid grid-cols-2 gap-4">
                            {ageGroups.map((group) => (
                                <button
                                    key={group.value}
                                    type="button"
                                    onClick={() =>
                                        setData("age_group", group.value)
                                    }
                                    className={`${
                                        data.age_group === group.value
                                            ? "bg-green text-white"
                                            : "bg-white text-gray-700"
                                    } px-4 py-3 rounded-md border border-gray-300 font-medium text-lg`}
                                >
                                    {group.label}
                                </button>
                            ))}
                        </div>
                        {errors.age_group && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.age_group}
                            </p>
                        )}
                    </div>

                    {/* Size */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Size
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {availableSizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeSelect(size)}
                                    className={`${
                                        data.size === size
                                            ? "bg-pink text-white"
                                            : "bg-white text-gray-700"
                                    } px-4 py-2 rounded-md border border-gray-300`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {errors.size && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.size}
                            </p>
                        )}
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Images (1-5 images, max 2MB each,
                            JPEG/PNG/JPG)
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleImageChange}
                            className={`mt-1 block w-full ${
                                errors.images || imageErrors.length > 0
                                    ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:border-pink focus:ring-pink"
                            }`}
                        />

                        {/* Client-side validation errors */}
                        {imageErrors.length > 0 && (
                            <div className="mt-2">
                                {imageErrors.map((err, index) => (
                                    <p
                                        key={index}
                                        className="text-sm text-red-600"
                                    >
                                        {err.error}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* Server validation errors */}
                        {errors.images && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.images}
                            </p>
                        )}

                        {/* Image count indicator */}
                        <p className="mt-1 text-sm text-gray-500">
                            {previewUrls.length} of 5 images selected
                        </p>

                        {/* Image previews */}
                        {previewUrls.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {previewUrls.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-30 h-full object-cover rounded-md border border-gray-200"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newUrls = [
                                                    ...previewUrls,
                                                ];
                                                newUrls.splice(index, 1);
                                                setPreviewUrls(newUrls);

                                                const newImages = [
                                                    ...data.images,
                                                ];
                                                newImages.splice(index, 1);
                                                setData("images", newImages);
                                            }}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {Object.keys(errors).length > 0 && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-red-600 font-medium">
                                    Please fix the errors below before
                                    submitting:
                                </p>
                                <ul className="mt-1 list-disc list-inside text-sm text-red-500">
                                    {Object.entries(errors).map(
                                        ([key, message]) => (
                                            <li key={key}>
                                                <strong>
                                                    {key
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        key.slice(1)}
                                                </strong>
                                                : {message}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={
                                processing || Object.keys(errors).length > 0
                            }
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-pink hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    Adding Product...
                                </>
                            ) : (
                                "Add Product"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page: React.ReactNode) => <ShopLayout children={page} />;

export default Create;
