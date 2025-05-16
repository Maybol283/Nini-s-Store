import React from "react";
import { Head, Link } from "@inertiajs/react";
import ShopLayout from "@/Layouts/ShopLayout";

interface OrderItem {
    product_name: string;
    image: string;
}

interface Order {
    id: number;
    status: string;
    total_amount: number;
    created_at: string;
    items_count: number;
    first_item: OrderItem | null;
}

interface Props {
    orders: Order[];
}

const Index = ({ orders }: Props) => {
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

    return (
        <div className="w-full font-sans py-12 bg-cream min-h-screen">
            <Head title="Your Orders" />

            <div className="mx-auto px-2 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <h2 className="text-2xl font-semibold text-green mb-6">
                            Your Orders
                        </h2>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 mb-4">
                                    You haven't placed any orders yet.
                                </p>
                                <Link
                                    href="/shop"
                                    className="inline-flex items-center px-4 py-2 bg-green text-white rounded-md hover:bg-opacity-90"
                                >
                                    Go Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            {order.first_item ? (
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                    src={
                                                                        order
                                                                            .first_item
                                                                            .image
                                                                    }
                                                                    alt={
                                                                        order
                                                                            .first_item
                                                                            .product_name
                                                                    }
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                #{order.id}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    order.items_count
                                                                }{" "}
                                                                {order.items_count ===
                                                                1
                                                                    ? "item"
                                                                    : "items"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                                            order.status
                                                        )}`}
                                                    >
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={`/orders/${order.id}`}
                                                        className="text-green hover:text-green-900"
                                                    >
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Set the layout
Index.layout = (page: React.ReactNode) => <ShopLayout>{page}</ShopLayout>;

export default Index;
