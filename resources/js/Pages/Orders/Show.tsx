import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";

interface OrderItem {
    id: number;
    product_name: string;
    price: number;
    quantity: number;
    size: string;
    image: string;
}

interface ShippingInfo {
    name: string;
    email: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    postal_code: string;
    country: string;
}

interface Order {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    shipping: ShippingInfo;
    items: OrderItem[];
}

interface Props {
    order: Order;
    errors?: Record<string, string>;
    success?: string;
}

const Show = ({ order, errors, success }: Props) => {
    const { user } = usePage().props.auth as any;
    const [isUpdating, setIsUpdating] = useState(false);
    const isAdmin = user && user.role === "admin";

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getNextStatus = (currentStatus: string) => {
        const statusFlow: Record<string, string> = {
            pending: "processing",
            processing: "shipped",
            shipped: "delivered",
        };

        return statusFlow[currentStatus.toLowerCase()] || null;
    };

    const handleUpdateStatus = () => {
        if (confirm("Are you sure you want to update the order status?")) {
            setIsUpdating(true);
            router.post(
                `/orders/${order.id}/update-status`,
                {},
                {
                    onSuccess: () => {
                        setIsUpdating(false);
                    },
                    onError: () => {
                        setIsUpdating(false);
                    },
                }
            );
        }
    };

    // Find next status
    const nextStatus = getNextStatus(order.status);

    return (
        <div className="md:w-full font-sans md:py-12 bg-cream min-h-screen">
            <Head title={`Order #${order.id}`} />

            <div className="mx-auto sm:px-6 lg:px-8 flex justify-center">
                <div className="w-full max-w-5xl">
                    {success && (
                        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    {errors && Object.keys(errors).length > 0 && (
                        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {Object.values(errors).map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    )}

                    <div className="mb-6">
                        <Link
                            href="/orders"
                            className="text-green hover:underline"
                        >
                            &larr; Back to Orders
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                                <h2 className="text-2xl font-semibold text-green">
                                    Order #{order.id}
                                </h2>
                                <div className="mt-2 md:mt-0 flex items-center">
                                    <span className="text-gray-600 mr-2">
                                        Status:
                                    </span>
                                    <span
                                        className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                                            order.status
                                        )}`}
                                    >
                                        {order.status}
                                    </span>

                                    {isAdmin && nextStatus && (
                                        <button
                                            onClick={handleUpdateStatus}
                                            disabled={isUpdating}
                                            className="ml-4 px-3 py-1 bg-green hover:bg-green-700 text-white text-sm rounded-md disabled:opacity-50"
                                        >
                                            {isUpdating
                                                ? "Updating..."
                                                : `Mark as ${nextStatus}`}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-lg font-medium mb-2 text-charcoal">
                                        Order Information
                                    </h3>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Date:
                                        </span>{" "}
                                        {order.created_at}
                                    </p>
                                    <p className="text-gray-600">
                                        <span className="font-medium">
                                            Total:
                                        </span>{" "}
                                        £
                                        {typeof order.total_amount === "number"
                                            ? order.total_amount.toFixed(2)
                                            : parseFloat(
                                                  order.total_amount
                                              ).toFixed(2)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium mb-2 text-charcoal">
                                        Shipping Information
                                    </h3>
                                    <p className="text-gray-600">
                                        {order.shipping.name}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shipping.address_line1}
                                    </p>
                                    {order.shipping.address_line2 && (
                                        <p className="text-gray-600">
                                            {order.shipping.address_line2}
                                        </p>
                                    )}
                                    <p className="text-gray-600">
                                        {order.shipping.city},{" "}
                                        {order.shipping.postal_code}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shipping.country}
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        {order.shipping.email}
                                    </p>
                                </div>
                            </div>

                            <h3 className="text-lg font-medium mb-4 text-charcoal">
                                Order Items
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Size
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <img
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={item.image}
                                                                alt={
                                                                    item.product_name
                                                                }
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    item.product_name
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.size}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    £
                                                    {typeof item.price ===
                                                    "number"
                                                        ? item.price.toFixed(2)
                                                        : parseFloat(
                                                              item.price
                                                          ).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    £
                                                    {(typeof item.price ===
                                                    "number"
                                                        ? item.price *
                                                          item.quantity
                                                        : parseFloat(
                                                              item.price
                                                          ) * item.quantity
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-4 text-right font-medium"
                                            >
                                                Total:
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green">
                                                £
                                                {typeof order.total_amount ===
                                                "number"
                                                    ? order.total_amount.toFixed(
                                                          2
                                                      )
                                                    : parseFloat(
                                                          order.total_amount
                                                      ).toFixed(2)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the layout
Show.layout = (page: React.ReactNode) => (
    <MainLayout title="Order Details" children={page} />
);

export default Show;
