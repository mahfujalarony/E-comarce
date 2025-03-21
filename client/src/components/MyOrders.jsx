import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaClock, FaTruck, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

 
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://e-comarce-iuno.vercel.app/api/myOrders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        setOrders([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  
  const markCancel = async (orderId) => {
    try {
      await axios.put(
        `https://e-comarce-iuno.vercel.app/api/myOrders/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
      alert('Order cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  
  const filteredOrders = filter === 'All' ? orders : orders.filter((order) => order.status === filter);

 
  const handleShopNow = () => {
    navigate('/products');
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">My Orders</h2>

     
      <div className="flex flex-wrap justify-center space-x-2 sm:space-x-4 mb-6">
        {['All', 'Active', 'Pending', 'Cancelled'].map((status) => (
          <button
            key={status}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${
              filter === status ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } transition duration-200`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white p-6 rounded-lg shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/102/102661.png"
            alt="No Orders"
            className="w-20 h-20 sm:w-24 sm:h-24 mb-4 opacity-70"
          />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
          <p className="text-gray-500 text-center mb-6 max-w-md text-sm sm:text-base">
            It looks like you haven’t placed any orders yet. Start shopping to see your orders here!
          </p>
          <button
            onClick={handleShopNow}
            className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Shop Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{order.product_name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Quantity: {order.quantity} | Total: ৳{order.price}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Order Date: {order.order_date}
                </p>
                <p className="text-gray-600 text-sm sm:text-base">
                  Delivery Date: {order.delivery_date}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {order.status === 'Delivered' ? (
                    <FaCheckCircle className="text-green-500" />
                  ) : order.status === 'Active' ? (
                    <FaTruck className="text-blue-500" />
                  ) : order.status === 'Cancelled' ? (
                    <FaTimesCircle className="text-red-500" />
                  ) : (
                    <FaClock className="text-yellow-500" />
                  )}
                  <span
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Active'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              {order.status === 'Active' && (
                <button
                  onClick={() => markCancel(order.id)}
                  className="mt-4 bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-600 transition duration-200 text-sm sm:text-base"
                >
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
