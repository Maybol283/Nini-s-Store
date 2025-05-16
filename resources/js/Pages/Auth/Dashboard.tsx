import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

interface Props {
    user: User;
}

const Dashboard = ({ user }: Props) => {
    const handleLogout = () => {
        router.post("/logout");
    };

    const isAdmin = user.role === "admin";

    return (
        <div className="font-sans py-12 bg-cream min-h-screen w-screen">
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-green">
                                {isAdmin ? "Admin Dashboard" : "Dashboard"}
                            </h2>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Log Out
                            </button>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-600">
                                Welcome back,{" "}
                                <span className="font-bold">{user.name}</span>!
                                {isAdmin && (
                                    <span className="ml-2 bg-green text-white px-2 py-1 text-xs rounded-full">
                                        Admin
                                    </span>
                                )}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-green bg-opacity-10 p-4 rounded-lg">
                                <h3 className="text-green font-semibold mb-2">
                                    Your Profile
                                </h3>
                                <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {user.name}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {user.email}
                                </p>
                                {isAdmin && (
                                    <p>
                                        <span className="font-medium">
                                            Role:
                                        </span>{" "}
                                        Administrator
                                    </p>
                                )}
                            </div>

                            <div className="bg-pink bg-opacity-10 p-4 rounded-lg">
                                <h3 className="text-pink font-semibold mb-2">
                                    Quick Actions
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="/shop"
                                            className="text-brown hover:underline"
                                        >
                                            Go Shopping
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/cart"
                                            className="text-brown hover:underline"
                                        >
                                            View Cart
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/orders"
                                            className="text-brown hover:underline"
                                        >
                                            Your Orders
                                        </Link>
                                    </li>
                                    {isAdmin && (
                                        <>
                                            <li className="pt-4 border-t border-gray-200">
                                                <h4 className="font-medium text-gray-700 mb-2">
                                                    Admin Actions
                                                </h4>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products/create"
                                                    className="text-green hover:underline font-medium"
                                                >
                                                    Create New Product
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href="/admin/products"
                                                    className="text-green hover:underline font-medium"
                                                >
                                                    Manage Products
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the layout
Dashboard.layout = (page: React.ReactNode) => (
    <MainLayout title="Dashboard" children={page} />
);

export default Dashboard;
