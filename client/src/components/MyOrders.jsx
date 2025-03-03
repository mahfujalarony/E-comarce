import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from "react-icons/fa";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/myOrders", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
                console.log(error);
            }
        };

        fetchOrders();
    }, []); 

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 font-semibold mt-10">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
                My Orders
            </h2>

            {orders.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No orders found
                </p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row items-start gap-6 hover:shadow-xl transition-shadow duration-300"
                        >

                            <img
                                src={order.productImageUrl}
                             
                                alt={order.product_name}
                                className="w-24 h-24 object-cover rounded-md border border-gray-200 hover:border-blue-500 transition-all duration-300"
                            />

                            <div className="flex-1">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    {order.product_name}
                                </h3>
                                <p className="text-gray-600">
                                    Quantity: {order.quantity} | Total Price: ৳{order.price}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Order Date: {order.order_date}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    Delivery Date: {order.delivery_date === "TBD" ? "To be determined" : order.delivery_date}
                                </p>
                                {/* <p className="text-gray-500 text-sm">
                                    Tracking ID: {order.tracking_id}
                                </p> */}

                        
                                <div className="mt-2 flex items-center gap-2">
                                    {order.status === "Delivered" ? (
                                        <FaCheckCircle className="text-green-500" />
                                    ) : order.status === "Active" ? (
                                        <FaTruck className="text-blue-500" />
                                    ) : (
                                        <FaClock className="text-yellow-500" />
                                    )}
                                    <span
                                        className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                                            order.status === "Delivered"
                                                ? "bg-green-100 text-green-700"
                                                : order.status === "Active"
                                                ? "bg-blue-100 text-blue-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2">
                                    <FaTruck />
                                    Track Order
                                </button>
                                {order.status !== "Delivered" && (
                                    <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition flex items-center gap-2">
                                        <FaTimesCircle />
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;