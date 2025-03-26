import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [imageDataMap, setImageDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(false); 
  const { user } = useContext(AuthContext);
  const userId = user?._id || JSON.parse(localStorage.getItem('user'))?._id || '';
  const navigate = useNavigate();
  const API_URL = 'https://e-comarce-iuno.vercel.app';
  const observerRefs = useRef({});

  const fetchCart = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart(response.data);
      console.log('data', response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const loadImage = async (url) => {
    if (!url || imageDataMap[url]) return;
    try {
      const res = await axios.get(`${API_URL}/api/image-data`, { params: { url } });
      setImageDataMap(prev => ({ ...prev, [url]: res.data.imageData }));
    } catch (error) {
      console.error(`Error loading image for ${url}:`, error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const url = entry.target.dataset.url;
            loadImage(url);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    Object.values(observerRefs.current).forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [cart.items]);

  const removeFromCart = async (productId) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/api/cart/remove`, { userId, productId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success('Removed from cart!', { autoClose: 1500 });
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item.productId._id !== productId);
        const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { items: newItems, total: newTotal };
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove product');
      fetchCart();
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/order/${productId}`);
  };

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
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

      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Shopping Cart</h2>

      {isLoading && cart.items.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      ) : (
        <div className="opacity-0 animate-fadeIn">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[60vh] bg-white p-6 rounded-lg shadow-md">
              <img
                src="https://cdn-icons-png.flaticon.com/512/891/891407.png"
                alt="Empty Cart"
                className="w-24 h-24 mb-4 opacity-70"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Looks like you haven’t added anything to your cart yet. Start shopping to fill it up!
              </p>
              <button
                onClick={handleShopNow}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.items.map((item) => (
                <div
                  key={item.productId._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                    {item.productId.images?.length > 0 && (
                      <div
                        ref={(el) => (observerRefs.current[item.productId._id] = el)}
                        data-url={item.productId.images[0]}
                        className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded mr-4"
                      >
                        {imageDataMap[item.productId.images[0]] ? (
                          <img
                            src={imageDataMap[item.productId.images[0]]}
                            alt={item.productId.name}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/80")}
                          />
                        ) : (
                          <div className="w-full h-full shimmer" />
                        )}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{item.productId.name}</h3>
                      <p className="text-gray-600">${item.price} x {item.quantity}</p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => removeFromCart(item.productId._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm transition duration-200"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => handleBuyNow(item.productId._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm transition duration-200"
                      disabled={isLoading}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6 text-right">
                <p className="text-xl md:text-2xl font-bold text-gray-800">
                  Total: ${cart.total.toFixed(2)}
                </p>
                <button
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-200"
                  disabled={isLoading}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;