import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RemoveProduct = () => {
  const [products, setProducts] = useState([]);
  const [imageDataMap, setImageDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useContext(AuthContext);
//  const API_URL = 'http://localhost:3001'; 
  const API_URL = 'https://e-comarce-8gj0.onrender.com'
  const PRODUCTS_PER_PAGE = 10;

  const isAdmin = user?.role === 'admin';
  const bottomSentinel = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
    fetchProducts(1, true);
  }, []);

  const fetchProducts = async (pageToFetch, reset = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        params: { page: pageToFetch, limit: PRODUCTS_PER_PAGE },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      console.log(`Fetching page ${pageToFetch} - Response:`, response.data);

      const fetchedProducts = response.data.products || response.data;
      const total = response.data.total || fetchedProducts.length;

      if (fetchedProducts.length === 0 && total === 0) {
        setProducts([]);
        setTotalPages(1);
      } else {
        setTotalPages(Math.ceil(total / PRODUCTS_PER_PAGE));
        setProducts(prev => {
          const newProducts = reset ? fetchedProducts : [...prev, ...fetchedProducts];
          const uniqueProducts = Array.from(
            new Map(newProducts.map(product => [product._id, product])).values()
          );
          return uniqueProducts;
        });

        if (!reset) setCurrentPage(pageToFetch);
      }
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          const nextPage = currentPage + 1;
          fetchProducts(nextPage);
        }
      },
      { root: scrollContainerRef.current, rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
    );

    if (bottomSentinel.current) observer.observe(bottomSentinel.current);
    return () => observer.disconnect();
  }, [currentPage, totalPages]);

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
    <div
      ref={scrollContainerRef}
      className="container mx-auto px-4 py-8 bg-gray-100 overflow-y-auto max-w-full"
      style={{ maxHeight: '100vh' }}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Remove Products</h2>
      {isLoading && products.length === 0 && (
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
      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product._id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              {product.images && product.images.length > 0 && (
                <div className="w-full sm:w-24 h-24 flex-shrink-0 bg-gray-200 flex items-center justify-center rounded-lg overflow-hidden">
                  {imageDataMap[product.images[0]] ? (
                    <img
                      src={imageDataMap[product.images[0]]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 animate-pulse" />
                  )}
                </div>
              )}
              <div className="flex-1">
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
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Removing...' : 'Remove'}
              </button>
            )}
          </li>
        ))}
      </ul>
      {isLoading && products.length > 0 && (
        <div className="flex justify-center mt-4">
          <svg
            className="animate-spin h-6 w-6 text-indigo-600"
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
      <div ref={bottomSentinel} style={{ height: '10px' }}></div>
      <ToastContainer />
    </div>
  );
};

export default RemoveProduct;