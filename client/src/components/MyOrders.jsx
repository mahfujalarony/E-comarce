import { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from "react-icons/fa";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("All");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/myOrders", {
                    headers: { "Authorization": `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const markCancel = async (orderId) => {
        try {
            await axios.put(`http://localhost:3001/api/myOrders/${orderId}`, {}, {
                headers: { "Authorization": `Bearer ${token}` },
            });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: "Cancelled" } : order
                )
            );
            alert("Order cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling order:", error);
            alert("Failed to cancel order. Please try again.");
        }
    };

    const filteredOrders = filter === "All" ? orders : orders.filter(order => order.status === filter);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            {/* <h2 className="text-3xl font-bold text-center mb-6">My Orders</h2> */}

            <div className="flex justify-center space-x-4 mb-6">
                {["All", "Active", "Pending", "Cancelled"].map((status) => (
                    <button key={status}
                        className={`px-4 py-2 rounded ${filter === status ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
                        onClick={() => setFilter(status)}>
                        {status}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
                <p className="text-center text-gray-500">No orders found</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-xl font-semibold">{order.product_name}</h3>
                            <p>Quantity: {order.quantity} | Total: ৳{order.price}</p>
                            <p>Order Date: {order.order_date}</p>
                            <p>Delivery Date: {order.delivery_date}</p>
                            <div className="mt-2 flex items-center gap-2">
                                {order.status === "Delivered" ? <FaCheckCircle className="text-green-500" /> :
                                    order.status === "Active" ? <FaTruck className="text-blue-500" /> :
                                        order.status === "Cancelled" ? <FaTimesCircle className="text-red-500" /> :
                                            <FaClock className="text-yellow-500" />}
                                <span className={`px-3 py-1 text-sm rounded-full ${
                                    order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                        order.status === "Active" ? "bg-blue-100 text-blue-700" :
                                            order.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                            {order.status === "Active" && (
                                <button onClick={() => markCancel(order.id)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
