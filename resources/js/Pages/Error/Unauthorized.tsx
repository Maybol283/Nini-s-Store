import React from "react";
import { Head, Link } from "@inertiajs/react";

interface Props {
    status: number;
    message?: string;
}

export default function Unauthorized({
    status,
    message = "Unauthorized",
}: Props) {
    return (
        <>
            <Head title="Unauthorized" />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="max-w-md p-8 text-center bg-white shadow-lg rounded-lg">
                    <h1 className="text-6xl font-bold text-red-500">403</h1>
                    <p className="mt-4 text-xl text-gray-700">{message}</p>
                    <p className="mt-2 text-gray-500">
                        You don't have permission to access this area.
                    </p>
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="px-4 py-2 text-white bg-pink rounded-md hover:bg-pink-600"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
