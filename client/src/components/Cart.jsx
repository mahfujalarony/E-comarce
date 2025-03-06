import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { user } = useContext(AuthContext);
  const userId = user?.userId || JSON.parse(localStorage.getItem('user'))?.userId || '';
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/cart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, [userId]);

  const updateCart = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post('http://localhost:3001/api/cart/remove', { userId, productId });
      toast.success('Removed from cart!', { autoClose: 1500 });
      updateCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove product');
    }
  };

  const handleBuyNow = (productId) => {
    navigate(`/order/${productId}`);
  };

  const handleShopNow = () => {
    navigate('/products'); // Redirect to products page
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-white p-6 rounded-lg shadow-md">
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891407.png" // Empty cart icon (you can replace with your own image)
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
                  <img
                    src={`http://localhost:3001/uploads/products/${item.productId.images[0].split('/').pop()}`}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded mr-4"
                  />
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
                >
                  Remove
                </button>
                <button
                  onClick={() => handleBuyNow(item.productId._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm transition duration-200"
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
            <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-200">
              Checkout
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;