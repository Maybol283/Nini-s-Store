import React, { FormEvent, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import ShopLayout from "@/Layouts/ShopLayout";

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
    user_id: number | null;
    customer_name: string;
    customer_email: string;
    status: string;
    total_amount: number;
    created_at: string;
    items_count: number;
    first_item: OrderItem | null;
    items?: OrderItem[];
    shipping?: ShippingInfo;
}

interface Props {
    orders: Order[];
    filters: {
        status: string;
    };
    statuses: string[];
    success?: string;
    error?: string;
}

const Index = ({ orders, filters, statuses, success, error }: Props) => {
    const [filterStatus, setFilterStatus] = useState(filters.status);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

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

    const handleFilterSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.get(
            "/admin/orders",
            {
                status: filterStatus,
            },
            {
                preserveState: true,
            }
        );
    };

    const handleClearFilters = () => {
        setFilterStatus("");
        router.get(
            "/admin/orders",
            {},
            {
                preserveState: true,
            }
        );
    };

    const viewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailsDialog(true);
        // All data is now included in the initial load, no need to fetch additional details
    };

    const closeDetailsDialog = () => {
        setShowDetailsDialog(false);
        setSelectedOrder(null);
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
        if (!selectedOrder) return;

        if (confirm("Are you sure you want to update the order status?")) {
            setIsUpdating(true);
            router.post(
                `/orders/${selectedOrder.id}/update-status`,
                {},
                {
                    onSuccess: (page) => {
                        setIsUpdating(false);
                        // Update the order in the local state
                        const updatedOrders = orders.map((order) =>
                            order.id === selectedOrder.id
                                ? {
                                      ...order,
                                      status:
                                          getNextStatus(order.status) ||
                                          order.status,
                                  }
                                : order
                        );

                        // Close dialog after update
                        closeDetailsDialog();
                    },
                    onError: () => {
                        setIsUpdating(false);
                    },
                }
            );
        }
    };

    return (
        <div className="font-sans py-12 bg-cream">
            <Head title="Manage Orders" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                {success && (
                    <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200 min-w-[90vw]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-green">
                                Manage Orders
                            </h2>
                            <Link
                                href="/admin/products"
                                className="text-sm text-green hover:underline"
                            >
                                ← Back to Products
                            </Link>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h3 className="text-lg font-medium mb-2">
                                Filters
                            </h3>
                            <form
                                onSubmit={handleFilterSubmit}
                                className="md:flex items-end space-y-4 md:space-y-0 md:space-x-4"
                            >
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={filterStatus}
                                        onChange={(e) =>
                                            setFilterStatus(e.target.value)
                                        }
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green focus:border-green rounded-md"
                                    >
                                        <option value="">All Statuses</option>
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        type="submit"
                                        className="bg-green text-white px-4 py-2 rounded-md hover:bg-opacity-90"
                                    >
                                        Filter
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </form>
                        </div>

                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 mb-4">
                                    No orders found.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow max-h-[60vh] overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
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
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.customer_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {order.customer_email}
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
                                                    <button
                                                        onClick={() =>
                                                            viewOrderDetails(
                                                                order
                                                            )
                                                        }
                                                        className="text-green hover:text-green-900 mr-3"
                                                    >
                                                        View Details
                                                    </button>
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

            {/* Order Details Dialog */}
            {showDetailsDialog && selectedOrder && (
                <div
                    className="fixed inset-0 z-50 overflow-y-auto"
                    aria-labelledby="modal-title"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            aria-hidden="true"
                            onClick={closeDetailsDialog}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-start">
                                    <h3
                                        className="text-2xl font-semibold text-green"
                                        id="modal-title"
                                    >
                                        Order #{selectedOrder.id}
                                    </h3>
                                    <button
                                        onClick={closeDetailsDialog}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <span className="sr-only">Close</span>
                                        <svg
                                            className="h-6 w-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center mb-4">
                                        <span className="text-gray-600 mr-2">
                                            Status:
                                        </span>
                                        <span
                                            className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                                                selectedOrder.status
                                            )}`}
                                        >
                                            {selectedOrder.status}
                                        </span>

                                        {getNextStatus(
                                            selectedOrder.status
                                        ) && (
                                            <button
                                                onClick={handleUpdateStatus}
                                                disabled={isUpdating}
                                                className="ml-4 px-3 py-1 bg-green hover:bg-green-700 text-white text-sm rounded-md disabled:opacity-50"
                                            >
                                                {isUpdating
                                                    ? "Updating..."
                                                    : `Mark as ${getNextStatus(
                                                          selectedOrder.status
                                                      )}`}
                                            </button>
                                        )}
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
                                                {selectedOrder.created_at}
                                            </p>
                                            <p className="text-gray-600">
                                                <span className="font-medium">
                                                    Total:
                                                </span>{" "}
                                                £
                                                {typeof selectedOrder.total_amount ===
                                                "number"
                                                    ? selectedOrder.total_amount.toFixed(
                                                          2
                                                      )
                                                    : parseFloat(
                                                          selectedOrder.total_amount
                                                      ).toFixed(2)}
                                            </p>
                                        </div>

                                        {selectedOrder.shipping && (
                                            <div>
                                                <h3 className="text-lg font-medium mb-2 text-charcoal">
                                                    Shipping Information
                                                </h3>
                                                <p className="text-gray-600">
                                                    {
                                                        selectedOrder.shipping
                                                            .name
                                                    }
                                                </p>
                                                <p className="text-gray-600">
                                                    {
                                                        selectedOrder.shipping
                                                            .address_line1
                                                    }
                                                </p>
                                                {selectedOrder.shipping
                                                    .address_line2 && (
                                                    <p className="text-gray-600">
                                                        {
                                                            selectedOrder
                                                                .shipping
                                                                .address_line2
                                                        }
                                                    </p>
                                                )}
                                                <p className="text-gray-600">
                                                    {
                                                        selectedOrder.shipping
                                                            .city
                                                    }
                                                    ,{" "}
                                                    {
                                                        selectedOrder.shipping
                                                            .postal_code
                                                    }
                                                </p>
                                                <p className="text-gray-600">
                                                    {
                                                        selectedOrder.shipping
                                                            .country
                                                    }
                                                </p>
                                                <p className="text-gray-600 mt-2">
                                                    {
                                                        selectedOrder.shipping
                                                            .email
                                                    }
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {selectedOrder.items &&
                                        selectedOrder.items.length > 0 && (
                                            <>
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
                                                            {selectedOrder.items.map(
                                                                (item) => (
                                                                    <tr
                                                                        key={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                                            <div className="flex items-center">
                                                                                <div className="flex-shrink-0 h-10 w-10">
                                                                                    <img
                                                                                        className="h-10 w-10 rounded-full object-cover"
                                                                                        src={
                                                                                            item.image
                                                                                        }
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
                                                                            {
                                                                                item.size
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                            £
                                                                            {typeof item.price ===
                                                                            "number"
                                                                                ? item.price.toFixed(
                                                                                      2
                                                                                  )
                                                                                : parseFloat(
                                                                                      item.price
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )}
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                            {
                                                                                item.quantity
                                                                            }
                                                                        </td>
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                            £
                                                                            {(typeof item.price ===
                                                                            "number"
                                                                                ? item.price *
                                                                                  item.quantity
                                                                                : parseFloat(
                                                                                      item.price
                                                                                  ) *
                                                                                  item.quantity
                                                                            ).toFixed(
                                                                                2
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
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
                                                                    {typeof selectedOrder.total_amount ===
                                                                    "number"
                                                                        ? selectedOrder.total_amount.toFixed(
                                                                              2
                                                                          )
                                                                        : parseFloat(
                                                                              selectedOrder.total_amount
                                                                          ).toFixed(
                                                                              2
                                                                          )}
                                                                </td>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </>
                                        )}
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={closeDetailsDialog}
                                >
                                    Close
                                </button>
                                <Link
                                    href={`/orders/${selectedOrder.id}`}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    View Full Page
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Set the layout
Index.layout = (page: React.ReactNode) => <ShopLayout children={page} />;

export default Index;
