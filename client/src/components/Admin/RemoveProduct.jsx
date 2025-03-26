import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
// import { AuthContext } from './AuthContext';
import { AuthContext } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RemoveProduct = () => {
  const [products, setProducts] = useState([]);
  const [imageDataMap, setImageDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const API_URL = 'https://e-comarce-iuno.vercel.app';

 
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const fetchedProducts = response.data.products || response.data;
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products.', { position: 'top-right', autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  const loadImage = async (url) => {
    if (imageDataMap[url]) return;
    try {
      const res = await axios.get(`${API_URL}/api/image-data`, { params: { url } });
      setImageDataMap((prev) => ({ ...prev, [url]: res.data.imageData }));
    } catch (error) {
      console.error(`Error loading image for ${url}:`, error);
    }
  };

  useEffect(() => {
    products.forEach((product) => {
      if (product.images && product.images.length > 0) {
        loadImage(product.images[0]);
      }
    });
  }, [products]);

  const handleRemoveProduct = async (productId) => {
    if (!isAdmin) {
      toast.error('Only admins can remove products!', { position: 'top-right', autoClose: 2000 });
      return;
    }

    if (!window.confirm('Are you sure you want to remove this product?')) return;

    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log('productId', productId);
      setProducts((prev) => prev.filter((product) => product._id !== productId));
      toast.success('Product removed successfully!', { position: 'top-right', autoClose: 2000 });
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Failed to remove product.', { position: 'top-right', autoClose: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Remove Products</h2>
      {isLoading && (
        <div className="flex justify-center">
          <svg
            className="animate-spin h-8 w-8 text-indigo-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      {!isLoading && products.length === 0 && (
        <p className="text-center text-gray-600">No products available.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <div>
              {product.images && product.images.length > 0 && (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                  {imageDataMap[product.images[0]] ? (
                    <img
                      src={imageDataMap[product.images[0]]}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                  )}
                </div>
              )}
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                <p className="text-lg font-bold text-green-600 mt-1">${product.price}</p>
                <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => handleRemoveProduct(product._id)}
                disabled={isLoading}
                className="mt-4 w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default RemoveProduct;