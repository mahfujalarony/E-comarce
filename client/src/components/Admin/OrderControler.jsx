import { useEffect, useState } from "react";
import axios from "axios";

const OrderController = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [filter, setFilter] = useState("all"); // ডিফল্ট ফিল্টার

    // অর্ডার ফেচ করা
    useEffect(() => {
        axios
            .get("http://localhost:3001/api/admin/orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((response) => setOrders(response.data))
            .catch((error) => console.error("Order fetch error:", error));
    }, []);

    // অর্ডার কমপ্লিট হিসেবে মার্ক করা
    const markAsCompleted = (orderId) => {
        axios
            .put(
                `http://localhost:3001/api/admin/orders/${orderId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            )
            .then(() => {
                setOrders(
                    orders.map((order) =>
                        order._id === orderId
                            ? { ...order, status: "Completed" }
                            : order
                    )
                );
                if (selectedOrderId === orderId) {
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order._id === orderId
                                ? { ...order, status: "Completed" }
                                : order
                        )
                    );
                }
            })
            .catch((error) => console.error("Update error:", error));
    };

    // অর্ডার ডিটেইলস টগল করা
    const toggleDetails = (orderId) => {
        setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
    };

    // ফিল্টার করা অর্ডার
    const filteredOrders = orders.filter((order) => {
        if (filter === "all") return true;
        return order.status.toLowerCase() === filter;
    });

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100">
            {/* নেভিগেশন মেনু (নিচে রাখা হয়েছে) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg lg:relative lg:bottom-auto lg:shadow-none">
                <div className="flex justify-around lg:justify-start lg:gap-4 p-2">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            filter === "all"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        All Orders ({orders.length})
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            filter === "active"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Active Orders (
                        {orders.filter((o) => o.status === "Active").length})
                    </button>
                    <button
                        onClick={() => setFilter("completed")}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            filter === "completed"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Completed Orders (
                        {orders.filter((o) => o.status === "Completed").length})
                    </button>
                    <button
                        onClick={() => setFilter("cancelled")}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            filter === "cancelled"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        Cancelled Orders (
                        {orders.filter((o) => o.status === "Cancelled").length})
                    </button>
                </div>
            </div>

            {/* মূল কন্টেন্ট */}
            <div className="flex flex-col lg:flex-row gap-6 mt-16 lg:mt-0">
                {/* অর্ডার লিস্ট সেকশন */}
                <div className="w-full lg:w-2/3">
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-lg shadow-md"
                                >
                                    <div
                                        className={`p-4 hover:shadow-xl transition-shadow cursor-pointer border ${
                                            selectedOrderId === order._id
                                                ? "border-blue-600"
                                                : "border-gray-200"
                                        }`}
                                        onClick={() => toggleDetails(order._id)}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                            <div>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {order.product_name}
                                                </p>
                                                <p className="text-sm">
                                                    Status:{" "}
                                                    <span
                                                        className={
                                                            order.status ===
                                                            "Active"
                                                                ? "text-orange-500"
                                                                : order.status ===
                                                                  "Completed"
                                                                ? "text-green-500"
                                                                : "text-red-500"
                                                        }
                                                    >
                                                        {order.status}
                                                    </span>
                                                </p>
                                            </div>
                                            <span className="text-sm text-blue-600 hover:underline">
                                                {selectedOrderId === order._id
                                                    ? "Hide Details"
                                                    : "View Details"}
                                            </span>
                                        </div>
                                    </div>
                                    {/* ছোট ডিভাইসের জন্য ডিটেইলস */}
                                    {selectedOrderId === order._id && (
                                        <div className="p-4 border-t border-gray-200 lg:hidden">
                                            <div className="space-y-3 text-gray-700">
                                                <p>
                                                    <strong>Customer:</strong>{" "}
                                                    {order.name}
                                                </p>
                                                <p>
                                                    <strong>Product:</strong>{" "}
                                                    {order.product_name}
                                                </p>
                                                <p>
                                                    <strong>Price:</strong>{" "}
                                                    {order.product_price} BDT
                                                </p>
                                                <p>
                                                    <strong>Quantity:</strong>{" "}
                                                    {order.quantity}
                                                </p>
                                                <p>
                                                    <strong>City:</strong>{" "}
                                                    {order.city}
                                                </p>
                                                <p>
                                                    <strong>District:</strong>{" "}
                                                    {order.district}
                                                </p>
                                                <p>
                                                    <strong>Sub-district:</strong>{" "}
                                                    {order.sub_district}
                                                </p>
                                                <p>
                                                    <strong>Postal Code:</strong>{" "}
                                                    {order.postalCode}
                                                </p>
                                                {order.landmark && (
                                                    <p>
                                                        <strong>Landmark:</strong>{" "}
                                                        {order.landmark}
                                                    </p>
                                                )}
                                                <p>
                                                    <strong>Phone:</strong>{" "}
                                                    {order.phoneNumber}
                                                </p>
                                                <p>
                                                    <strong>Order Date:</strong>{" "}
                                                    {order.order_date}
                                                </p>
                                                <p>
                                                    <strong>Delivery Date:</strong>{" "}
                                                    {order.delivery_date}
                                                </p>
                                                {order.productImageUrl && (
                                                    <img
                                                        src={
                                                            order.productImageUrl
                                                        }
                                                        alt={order.product_name}
                                                        className="mt-4 w-full h-48 object-cover rounded-md"
                                                    />
                                                )}
                                                {order.status === "Active" && (
                                                    <button
                                                        onClick={() =>
                                                            markAsCompleted(
                                                                order._id
                                                            )
                                                        }
                                                        className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                                    >
                                                        Mark as Completed
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-6">
                                No orders found in this category.
                            </div>
                        )}
                    </div>
                </div>

                {/* অর্ডার ডিটেইলস সেকশন (বড় ডিভাইসের জন্য) */}
                <div className="hidden lg:block w-full lg:w-1/3">
                    {selectedOrderId ? (
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Order Details
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                <p>
                                    <strong>Customer:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.name
                                    }
                                </p>
                                <p>
                                    <strong>Product:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.product_name
                                    }
                                </p>
                                <p>
                                    <strong>Price:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.product_price
                                    }{" "}
                                    BDT
                                </p>
                                <p>
                                    <strong>Quantity:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.quantity
                                    }
                                </p>
                                <p>
                                    <strong>City:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.city
                                    }
                                </p>
                                <p>
                                    <strong>District:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.district
                                    }
                                </p>
                                <p>
                                    <strong>Sub-district:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.sub_district
                                    }
                                </p>
                                <p>
                                    <strong>Postal Code:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.postalCode
                                    }
                                </p>
                                {orders.find(
                                    (order) => order._id === selectedOrderId
                                )?.landmark && (
                                    <p>
                                        <strong>Landmark:</strong>{" "}
                                        {
                                            orders.find(
                                                (order) =>
                                                    order._id === selectedOrderId
                                            )?.landmark
                                        }
                                    </p>
                                )}
                                <p>
                                    <strong>Phone:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.phoneNumber
                                    }
                                </p>
                                <p>
                                    <strong>Order Date:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.order_date
                                    }
                                </p>
                                <p>
                                    <strong>Delivery Date:</strong>{" "}
                                    {
                                        orders.find(
                                            (order) =>
                                                order._id === selectedOrderId
                                        )?.delivery_date
                                    }
                                </p>
                                {orders.find(
                                    (order) => order._id === selectedOrderId
                                )?.productImageUrl && (
                                    <img
                                        src={
                                            orders.find(
                                                (order) =>
                                                    order._id === selectedOrderId
                                            )?.productImageUrl
                                        }
                                        alt={
                                            orders.find(
                                                (order) =>
                                                    order._id === selectedOrderId
                                            )?.product_name
                                        }
                                        className="mt-4 w-full h-48 object-cover rounded-md"
                                    />
                                )}
                                {orders.find(
                                    (order) => order._id === selectedOrderId
                                )?.status === "Active" && (
                                    <button
                                        onClick={() =>
                                            markAsCompleted(selectedOrderId)
                                        }
                                        className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                            <p>Select an order to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderController;