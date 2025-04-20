import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

interface User {
    id: number;
    name: string;
    email: string;
}

interface Props {
    user: User;
}

const Dashboard = ({ user }: Props) => {
    const handleLogout = () => {
        router.post("/logout");
    };

    return (
        <div className="py-12 bg-cream min-h-screen">
            <Head title="Dashboard" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-green">
                                Dashboard
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
