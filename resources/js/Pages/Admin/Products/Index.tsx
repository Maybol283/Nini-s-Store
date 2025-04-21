import React, { useState, useEffect } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import ShopLayout from "@/Layouts/ShopLayout";

interface ProductImage {
    imageSrc: string;
    imageAlt: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    age_group: string;
    size: string;
    images: ProductImage[];
    in_stock: boolean;
    created_at: string;
}

interface Filters {
    search: string;
    category: string;
    age_group: string;
    stock_status: string;
    sort: string;
    direction: string;
}

interface Props {
    products: Product[];
    filters: Filters;
    categories: Record<string, string>;
    ageGroups: Record<string, string>;
}

function Index({ products, filters, categories, ageGroups }: Props) {
    const page = usePage().props;
    const [showSuccessFlash, setShowSuccessFlash] = useState(false);
    const [showErrorFlash, setShowErrorFlash] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null
    );
    const [searchTerm, setSearchTerm] = useState(filters.search);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm !== filters.search) {
                applyFilters({ search: searchTerm });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        const flash = page.flash as any;
        if (flash?.success) {
            setShowSuccessFlash(true);
            const timer = setTimeout(() => {
                setShowSuccessFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [(page.flash as any)?.success]);

    useEffect(() => {
        const flash = page.flash as any;
        if (flash?.error) {
            setShowErrorFlash(true);
            const timer = setTimeout(() => {
                setShowErrorFlash(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [(page.flash as any)?.error]);

    // Apply filters and sorting
    const applyFilters = (newFilters: Partial<Filters>) => {
        router.get(
            "/admin/products",
            { ...filters, ...newFilters },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Toggle sort direction
    const toggleSort = (column: string) => {
        const newDirection =
            filters.sort === column && filters.direction === "asc"
                ? "desc"
                : "asc";

        applyFilters({ sort: column, direction: newDirection });
    };

    // Confirm deletion of a product
    const confirmDelete = (product: Product) => {
        setProductToDelete(product);
        setIsDeleteModalOpen(true);
    };

    // Delete a product
    const deleteProduct = () => {
        if (productToDelete) {
            router.delete(`/admin/products/${productToDelete.id}`, {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setProductToDelete(null);
                },
            });
        }
    };

    // Sort icon based on current sort column and direction
    const getSortIcon = (column: string) => {
        if (filters.sort !== column) {
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                </svg>
            );
        }

        return filters.direction === "asc" ? (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                />
            </svg>
        ) : (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                />
            </svg>
        );
    };

    return (
        <>
            <Head title="Admin Products" />
            <div className="max-w-7xl mx-auto p-6 font-sans">
                {/* Flash Messages */}
                {showSuccessFlash && (page.flash as any)?.success && (
                    <div
                        className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <span className="block sm:inline">
                            {(page.flash as any).success}
                        </span>
                        <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setShowSuccessFlash(false)}
                        >
                            <svg
                                className="fill-current h-6 w-6 text-green-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </span>
                    </div>
                )}

                {showErrorFlash && (page.flash as any)?.error && (
                    <div
                        className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <span className="block sm:inline">
                            {(page.flash as any).error}
                        </span>
                        <span
                            className="absolute top-0 bottom-0 right-0 px-4 py-3"
                            onClick={() => setShowErrorFlash(false)}
                        >
                            <svg
                                className="fill-current h-6 w-6 text-red-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <title>Close</title>
                                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </span>
                    </div>
                )}

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-green">Products</h1>
                    <Link
                        href="/admin/products/create"
                        className="px-4 py-2 bg-pink text-white rounded-md hover:bg-pink-600 transition-colors"
                    >
                        Add New Product
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label
                                htmlFor="search"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Search
                            </label>
                            <input
                                type="text"
                                id="search"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Category
                            </label>
                            <select
                                id="category"
                                value={filters.category}
                                onChange={(e) =>
                                    applyFilters({ category: e.target.value })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                            >
                                <option value="all">All Categories</option>
                                {Object.entries(categories).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Age Group Filter */}
                        <div>
                            <label
                                htmlFor="age_group"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Age Group
                            </label>
                            <select
                                id="age_group"
                                value={filters.age_group}
                                onChange={(e) =>
                                    applyFilters({ age_group: e.target.value })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                            >
                                <option value="all">All Age Groups</option>
                                {Object.entries(ageGroups).map(
                                    ([value, label]) => (
                                        <option key={value} value={value}>
                                            {label}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Stock Status Filter */}
                        <div>
                            <label
                                htmlFor="stock_status"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Stock Status
                            </label>
                            <select
                                id="stock_status"
                                value={filters.stock_status}
                                onChange={(e) =>
                                    applyFilters({
                                        stock_status: e.target.value,
                                    })
                                }
                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-pink focus:ring-pink"
                            >
                                <option value="all">All Stock Status</option>
                                <option value="in_stock">In Stock</option>
                                <option value="out_of_stock">
                                    Out of Stock
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <p className="text-gray-500">No products found.</p>
                        <Link
                            href="/admin/products/create"
                            className="mt-4 inline-block px-4 py-2 bg-pink text-white rounded-md hover:bg-pink-600 transition-colors"
                        >
                            Add your first product
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => toggleSort("name")}
                                            className="flex items-center space-x-1 focus:outline-none"
                                        >
                                            <span>Product</span>
                                            {getSortIcon("name")}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() =>
                                                toggleSort("category")
                                            }
                                            className="flex items-center space-x-1 focus:outline-none"
                                        >
                                            <span>Category</span>
                                            {getSortIcon("category")}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Age Group
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button
                                            onClick={() => toggleSort("price")}
                                            className="flex items-center space-x-1 focus:outline-none"
                                        >
                                            <span>Price</span>
                                            {getSortIcon("price")}
                                        </button>
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-md object-cover"
                                                        src={
                                                            product.images[0]
                                                                ?.imageSrc ||
                                                            "/images/placeholder.png"
                                                        }
                                                        alt={product.name}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">
                                                {product.category}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 capitalize">
                                                {product.age_group}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {product.size}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                £
                                                {typeof product.price ===
                                                "number"
                                                    ? product.price.toFixed(2)
                                                    : parseFloat(
                                                          String(product.price)
                                                      ).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    product.in_stock
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {product.in_stock
                                                    ? "In Stock"
                                                    : "Out of Stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    confirmDelete(product)
                                                }
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Delete Product
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete{" "}
                                {productToDelete?.name}? This action cannot be
                                undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteProduct}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <ShopLayout children={page} />;

export default Index;
