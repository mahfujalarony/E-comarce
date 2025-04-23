import { useEffect, useState } from "react";
import axios from "axios";

const OrderController = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [imageDataMap, setImageDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = "https://e-comarce-iuno.vercel.app";

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); 
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${API_URL}/api/admin/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);

        response.data.forEach((order) => {
          if (order.productImageUrl) {
            loadImage(order.productImageUrl);
          }
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoading(false); 
      }
    };
    fetchOrders();
  }, [API_URL]);

  const loadImage = async (url) => {
    if (imageDataMap[url]) return;
    try {
      const res = await axios.get(`${API_URL}/api/image-data`, { params: { url } });
      setImageDataMap((prev) => ({ ...prev, [url]: res.data.imageData }));
    } catch (error) {
      console.error("Error loading image for", url, ":", error.message, error.response?.data);
    }
  };

  const markAsCompleted = async (orderId) => {
    setIsLoading(true); 
    try {
      await axios.put(
        `${API_URL}/api/admin/orders/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Completed" } : order
        )
      );
    } catch (error) {
      console.error("Update error:", error.message, error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDetails = (orderId) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status.toLowerCase() === filter;
  });

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-gray-100">
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out forwards;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .shimmer {
            background: linear-gradient(to right, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
        `}
      </style>

      {isLoading && orders.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <div className="opacity-0 animate-fadeIn">
        
          {/* <div className="sticky  left-0 right-0 bg-white shadow-lg lg:relative lg:bottom-auto lg:shadow-none">
            <div className="flex justify-around lg:justify-start lg:gap-4 p-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
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
                disabled={isLoading}
              >
                Active Orders ({orders.filter((o) => o.status === "Active").length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
              >
                Completed Orders ({orders.filter((o) => o.status === "Completed").length})
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
              >
                Cancelled Orders ({orders.filter((o) => o.status === "Cancelled").length})
              </button>
            </div>
          </div> */}

          <div className="flex flex-col lg:flex-row gap-6 mt-16 lg:mt-0">
            
            <div className="w-full lg:w-2/3">
            
              <div className="space-y-4 max-h-[100vh] overflow-y-auto pr-2">

                <div className="fixed  top-[-100px] md:top-[-60px] lg:top-0 left-0 right-0 bg-white shadow-lg lg:relative  lg:shadow-none">
            <div className="flex justify-around lg:justify-start lg:gap-4 p-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
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
                disabled={isLoading}
              >
                Active Orders ({orders.filter((o) => o.status === "Active").length})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
              >
                Completed Orders ({orders.filter((o) => o.status === "Completed").length})
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  filter === "cancelled"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isLoading}
              >
                Cancelled Orders ({orders.filter((o) => o.status === "Cancelled").length})
              </button>
            </div>
          </div>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div key={order._id} className="bg-white rounded-lg shadow-md">
                      <div
                        className={`p-4 hover:shadow-xl transition-shadow cursor-pointer border ${
                          selectedOrderId === order._id ? "border-blue-600" : "border-gray-200"
                        }`}
                        onClick={() => toggleDetails(order._id)}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{order.product_name}</p>
                            <p className="text-sm">
                              Status:{" "}
                              <span
                                className={
                                  order.status === "Active"
                                    ? "text-orange-500"
                                    : order.status === "Completed"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                              >
                                {order.status}
                              </span>
                            </p>
                          </div>
                          <span className="text-sm text-blue-600 hover:underline">
                            {selectedOrderId === order._id ? "Hide Details" : "View Details"}
                          </span>
                        </div>
                      </div>
                      {selectedOrderId === order._id && (
                        <div className="p-4 border-t border-gray-200 lg:hidden">
                          <div className="space-y-3 text-gray-700">
                            <p><strong>Customer:</strong> {order.name}</p>
                            <p><strong>Product:</strong> {order.product_name}</p>
                            <p><strong>Price:</strong> {order.product_price} BDT</p>
                            <p><strong>Quantity:</strong> {order.quantity}</p>
                            <p><strong>City:</strong> {order.city}</p>
                            <p><strong>District:</strong> {order.district}</p>
                            <p><strong>Sub-district:</strong> {order.sub_district}</p>
                            <p><strong>Postal Code:</strong> {order.postalCode}</p>
                            {order.landmark && <p><strong>Landmark:</strong> {order.landmark}</p>}
                            <p><strong>Phone:</strong> {order.phoneNumber}</p>
                            <p><strong>Order Date:</strong> {order.order_date}</p>
                            <p><strong>Delivery Date:</strong> {order.delivery_date}</p>
                            {order.productImageUrl && (
                              <div className="mt-4 w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                                {imageDataMap[order.productImageUrl] ? (
                                  <img
                                    src={imageDataMap[order.productImageUrl]}
                                    alt={order.product_name}
                                    className="w-full h-full object-cover rounded-md"
                                    onLoad={() =>
                                      console.log("Image loaded successfully for:", order.productImageUrl)
                                    }
                                    onError={() =>
                                      console.error("Image failed to load:", order.productImageUrl)
                                    }
                                  />
                                ) : (
                                  <div className="w-full h-full shimmer rounded-md" />
                                )}
                              </div>
                            )}
                            {order.status === "Active" && (
                              <button
                                onClick={() => markAsCompleted(order._id)}
                                className="mt-4 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                disabled={isLoading}
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

            <div className="hidden lg:block w-full lg:w-1/3">
              {selectedOrderId ? (
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>Customer:</strong> {orders.find((o) => o._id === selectedOrderId)?.name}</p>
                    <p><strong>Product:</strong> {orders.find((o) => o._id === selectedOrderId)?.product_name}</p>
                    <p><strong>Price:</strong> {orders.find((o) => o._id === selectedOrderId)?.product_price} BDT</p>
                    <p><strong>Quantity:</strong> {orders.find((o) => o._id === selectedOrderId)?.quantity}</p>
                    <p><strong>City:</strong> {orders.find((o) => o._id === selectedOrderId)?.city}</p>
                    <p><strong>District:</strong> {orders.find((o) => o._id === selectedOrderId)?.district}</p>
                    <p><strong>Sub-district:</strong> {orders.find((o) => o._id === selectedOrderId)?.sub_district}</p>
                    <p><strong>Postal Code:</strong> {orders.find((o) => o._id === selectedOrderId)?.postalCode}</p>
                    {orders.find((o) => o._id === selectedOrderId)?.landmark && (
                      <p><strong>Landmark:</strong> {orders.find((o) => o._id === selectedOrderId)?.landmark}</p>
                    )}
                    <p><strong>Phone:</strong> {orders.find((o) => o._id === selectedOrderId)?.phoneNumber}</p>
                    <p><strong>Order Date:</strong> {orders.find((o) => o._id === selectedOrderId)?.order_date}</p>
                    <p><strong>Delivery Date:</strong> {orders.find((o) => o._id === selectedOrderId)?.delivery_date}</p>
                    {orders.find((o) => o._id === selectedOrderId)?.productImageUrl && (
                      <div className="mt-4 w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
                        {imageDataMap[orders.find((o) => o._id === selectedOrderId)?.productImageUrl] ? (
                          <img
                            src={imageDataMap[orders.find((o) => o._id === selectedOrderId)?.productImageUrl]}
                            alt={orders.find((o) => o._id === selectedOrderId)?.product_name}
                            className="w-full h-full object-cover rounded-md"
                            onLoad={() =>
                              console.log(
                                "Image loaded successfully for:",
                                orders.find((o) => o._id === selectedOrderId)?.productImageUrl
                              )
                            }
                            onError={() =>
                              console.error(
                                "Image failed to load:",
                                orders.find((o) => o._id === selectedOrderId)?.productImageUrl
                              )
                            }
                          />
                        ) : (
                          <div className="w-full h-full shimmer rounded-md" />
                        )}
                      </div>
                    )}
                    {orders.find((o) => o._id === selectedOrderId)?.status === "Active" && (
                      <button
                        onClick={() => markAsCompleted(selectedOrderId)}
                        className="mt-6 w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        disabled={isLoading}
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
      )}
    </div>
  );
};

export default OrderController;