import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { user } = useContext(AuthContext);
  const userId = user?.userId || JSON.parse(localStorage.getItem("user"))?.userId || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCart = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:3001/api/cart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchProducts();
    fetchCart();
  }, [userId]);

  const handleAddToCart = async (productId) => {
    if (!userId) {
      alert("Please log in first!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/cart/add', {
        userId,
        productId,
        quantity: 1,
      });
      setCart(response.data);
      toast.success('Product added to cart!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      {/* <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Our Products</h1> */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <div key={product._id} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <Link to={`/get/${product._id}`} className="no-underline text-gray-800 cursor-pointer">
              {product.images && product.images.length > 0 && (
                <img
                  src={`http://localhost:3001/uploads/products/${product.images[0].split('/').pop()}`}
                  alt={product.name}
                  className="w-full h-40 md:h-48 lg:h-56 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 overflow-hidden">{product.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg font-bold text-green-600">${product.price}</p>
                  <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                </div>
                <p className="text-sm text-gray-700"><span className="font-medium">Category:</span> {product.category}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Brand:</span> {product.brand}</p>
              </div>
            </Link>
            <button
              onClick={() => handleAddToCart(product._id)}
              disabled={product.stock <= 0}
              className={`mt-4 w-full py-2 rounded-md text-white transition-colors duration-300 ${
                product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        ))}
      </div>

      {/* কার্ট প্রিভিউ */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Cart Preview</h2>
        {cart.items.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cart.items.map((item) => (
            <div key={item.productId._id} className="flex justify-between mb-2">
              <span>{item.productId.name} (x{item.quantity})</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        )}
        <p className="font-bold">Total: ${cart.total.toFixed(2)}</p>
      </div>

      {/* টোস্ট নোটিফিকেশন */}
      <ToastContainer />
    </div>
  );
};

export default ProductPage;