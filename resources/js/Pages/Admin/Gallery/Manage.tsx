import React, { useState, useRef } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import ShopLayout from "@/Layouts/ShopLayout";
import { PageProps } from "@/types";

interface GalleryImage {
    id: string;
    src: string;
    path: string;
    alt: string;
    name: string;
}

interface Props extends PageProps {
    images: GalleryImage[];
}

export default function Manage({ images }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [altText, setAltText] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList || fileList.length === 0) {
            setSelectedFile(null);
            setPreviewUrl(null);
            setError(null);
            return;
        }

        const file = fileList[0];

        // Validate file
        const maxSize = 2 * 1024 * 1024; // 2MB
        const acceptedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/gif",
            "image/webp",
        ];

        if (file.size > maxSize) {
            setError(`File size exceeds 2MB limit.`);
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        if (!acceptedTypes.includes(file.type)) {
            setError(`File must be JPEG, PNG, JPG, GIF, or WEBP.`);
            setSelectedFile(null);
            setPreviewUrl(null);
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError(null);

        // Auto-fill alt text with filename (without extension)
        const fileName =
            file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setAltText(fileName);
    };

    const resetFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setAltText("");
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedFile) {
            setError("Please select an image to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("image", selectedFile);
        if (altText) {
            formData.append("alt_text", altText);
        }

        router.post("/admin/gallery/upload", formData);
        resetFileInput();
    };

    const deleteImage = (imageName: string) => {
        if (
            confirm(
                `Are you sure you want to delete this image from the gallery?`
            )
        ) {
            router.delete(`/admin/gallery/${imageName}`);
        }
    };

    return (
        <ShopLayout>
            <Head title="Manage Gallery" />

            <div className="py-12 bg-cream min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-green">
                            Manage Gallery
                        </h1>
                        <div className="flex space-x-4">
                            <Link
                                href="/admin/products"
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Products
                            </Link>
                            <Link
                                href="/gallery"
                                className="px-4 py-2 bg-green text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                                View Gallery
                            </Link>
                        </div>
                    </div>

                    {flash.success && (
                        <div className="mb-4 p-3 bg-green-50 text-green-600 border border-green-200 rounded-md">
                            {flash.success}
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
                            {flash.error}
                        </div>
                    )}

                    {/* Upload Form */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">
                                Upload New Image
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image (Max 2MB, JPEG/PNG/JPG/GIF/WEBP)
                                    </label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
                                    />
                                    {error && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                {previewUrl && (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Preview:
                                        </p>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-40 w-auto object-contain border border-gray-200 rounded-md"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alt Text (optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={altText}
                                        onChange={(e) =>
                                            setAltText(e.target.value)
                                        }
                                        placeholder="Description of the image"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green focus:border-green"
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="submit"
                                        disabled={!selectedFile}
                                        className="px-4 py-2 bg-pink text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Upload to Gallery
                                    </button>

                                    {selectedFile && (
                                        <button
                                            type="button"
                                            onClick={resetFileInput}
                                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h2 className="text-xl font-semibold mb-4">
                                Gallery Images ({images.length})
                            </h2>

                            {images.length === 0 ? (
                                <p className="text-gray-500 italic">
                                    No images in the gallery yet.
                                </p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="relative group"
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="w-full h-48 object-cover rounded-md border border-gray-200"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                                                <button
                                                    onClick={() =>
                                                        deleteImage(image.name)
                                                    }
                                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                                                    title="Delete image"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60 text-white text-sm truncate">
                                                {image.name}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
