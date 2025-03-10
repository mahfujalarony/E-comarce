import React, { useEffect, useState, useContext, useRef } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [imageDataMap, setImageDataMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const userId = user?.userId || JSON.parse(localStorage.getItem("user"))?.userId || "";
  const location = useLocation();
  const API_URL = 'https://e-comarce-iuno.vercel.app/';
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const bottomSentinel = useRef(null);
  const scrollContainerRef = useRef(null);
  const productRefs = useRef({});
  const PRODUCTS_PER_PAGE = 10;

  useEffect(() => {
    setProducts([]);
    setCurrentPage(1);
    setTotalPages(1);
    fetchProducts(1, true);
  }, [searchQuery]);

  const fetchProducts = async (pageToFetch, reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        params: { page: pageToFetch, limit: PRODUCTS_PER_PAGE, search: searchQuery },
      });

      console.log(`Fetching page ${pageToFetch} - Response:`, response.data);

      let fetchedProducts, total;
      if (Array.isArray(response.data)) {
        fetchedProducts = response.data;
        total = fetchedProducts.length;
      } else {
        fetchedProducts = response.data.products || [];
        total = response.data.total || 0;
      }

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
          console.log(`Page ${pageToFetch} - Unique products:`, uniqueProducts);
          return uniqueProducts;
        });

        if (!reset) setCurrentPage(pageToFetch);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (reset) setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const loadImage = async (url) => {
    if (imageDataMap[url]) return;
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

    Object.values(productRefs.current).forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [products]);

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages && !loading) {
          const nextPage = currentPage + 1;
          console.log(`Triggering load for page ${nextPage}`);
          fetchProducts(nextPage);
        }
      },
      { root: scrollContainerRef.current, rootMargin: '0px 0px 200px 0px', threshold: 0.1 }
    );

    if (bottomSentinel.current) observer.observe(bottomSentinel.current);
    return () => observer.disconnect();
  }, [currentPage, totalPages, loading]);

  const handleAddToCart = async (productId) => {
    if (!userId) {
      toast.error("Please log in first!", { position: "top-right", autoClose: 2000 });
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/cart/add`, {
        userId,
        productId,
        quantity: 1,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success('Product added to cart!', { position: "top-right", autoClose: 2000 });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart.', { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="container mx-auto px-4 py-8 bg-gray-100 overflow-y-auto"
      style={{ maxHeight: '100vh' }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.length === 0 && !loading ? (
          <p className="col-span-full text-center">No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <Link to={`/get/${product._id}`} className="no-underline text-gray-800 cursor-pointer">
                {product.images && product.images.length > 0 && (
                  <div
                    ref={el => productRefs.current[product._id] = el}
                    data-url={product.images[0]}
                    className="w-full h-40 md:h-48 lg:h-56 bg-gray-200 flex items-center justify-center"
                  >
                    {imageDataMap[product.images[0]] ? (
                      <img
                        src={imageDataMap[product.images[0]]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
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
          ))
        )}
      </div>

      {loading && (
        <p className="text-center py-4">Loading more products...</p>
      )}
      <div ref={bottomSentinel} style={{ height: '10px' }}></div>

      <ToastContainer />
    </div>
  );
};

export default ProductPage;