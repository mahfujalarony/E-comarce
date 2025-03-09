import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';


const imageCache = {};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [imageDataMap, setImageDataMap] = useState(imageCache);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);
  const observerRefs = useRef({});
  const API_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(productResponse.data);

        const relatedResponse = await axios.get(
          `${API_URL}/api/products?category=${productResponse.data.category}&limit=4`
        );
        setRelatedProducts(relatedResponse.data.filter((p) => p._id !== productResponse.data._id));
      } catch (error) {
        console.error('Error fetching product details or related products:', error);
      }
    };
    fetchData();
  }, [id, API_URL]);

  const loadImage = async (url) => {
    if (imageCache[url]) {
      setImageDataMap((prev) => ({ ...prev, [url]: imageCache[url] }));
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/image-data`, { params: { url } });
      const imageData = res.data.imageData;
      imageCache[url] = imageData;
      setImageDataMap((prev) => ({ ...prev, [url]: imageData }));
    } catch (error) {
      console.error(`Error loading image for ${url}:`, error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const url = entry.target.dataset.url;
            loadImage(url);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    Object.values(observerRefs.current).forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [product, relatedProducts]);

  const checkToken = () => {
    return !!localStorage.getItem('token');
  };

  const handleOrderNow = () => {
    if (checkToken()) {
      navigate(`/order/${id}`);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleAddToCart = () => {
    setIsCartModalOpen(true);
  };

  const handleImageZoom = (img) => {
    setZoomedImage(img);
  };

  const handleZoomClose = () => {
    setZoomedImage(null);
  };

  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false);
    navigate('/login');
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
  };

  const handleCartCancel = () => {
    setIsCartModalOpen(false);
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/get/${productId}`);
  };

  if (!product) {
    return <div className="text-center text-lg font-semibold py-10">Loading...</div>;
  }

  return (
    <div 
      className="container mx-auto px-4 bg-gray-100 min-h-screen 
                 pt-[calc(60px+1rem)] md:pt-6" 
    >
      <div className="flex flex-col lg:flex-row gap-6">
       
        <div className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-md">
          {product.images && product.images.length > 0 ? (
            <Carousel showThumbs={true} infiniteLoop autoPlay className="rounded-lg">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  ref={(el) => (observerRefs.current[`main-${index}`] = el)}
                  data-url={img}
                  className="cursor-pointer"
                  onClick={() => handleImageZoom(imageDataMap[img] || img)}
                >
                  {imageDataMap[img] ? (
                    <img
                      src={imageDataMap[img]}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="object-contain h-64 sm:h-80 md:h-96 w-full rounded-lg hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg">
                      <div className="animate-pulse bg-gray-300 w-full h-full rounded-lg"></div>
                    </div>
                  )}
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-500 text-lg">No Image Available</span>
            </div>
          )}
        </div>

     
        <div className="w-full lg:w-1/2 bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <div className="flex items-center mb-3">
            <span className="text-yellow-500">★★★★☆</span>
            <span className="ml-2 text-gray-600 text-xs sm:text-sm">(4.5/5 based on 120 reviews)</span>
          </div>
          <hr className="my-3" />
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-green-600 mb-2">${product.price}</p>
          <p className="text-gray-500 text-sm mb-3">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </p>
          <p className="text-gray-700 text-sm sm:text-base mb-4">{product.description}</p>
          <div className="space-y-2 mb-4 sm:mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Category:</span> {product.category}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Brand:</span> {product.brand}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="w-full bg-yellow-500 text-white py-2 sm:py-3 rounded-md hover:bg-yellow-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button
              className="w-full bg-orange-500 text-white py-2 sm:py-3 rounded-md hover:bg-orange-600 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={product.stock === 0}
              onClick={handleOrderNow}
            >
              Order Now
            </button>
          </div>
        </div>
      </div>

    
      <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Product Details</h2>
        <ul className="list-disc pl-5 text-gray-700 text-sm sm:text-base space-y-2">
          <li>Category: {product.category}</li>
          <li>Brand: {product.brand}</li>
          <li>Price: ${product.price}</li>
          <li>Stock: {product.stock > 0 ? product.stock : 'Out of Stock'}</li>
          <li>Description: {product.description}</li>
        </ul>
      </div>

     
      <div className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
          Related Products
        </h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="border rounded-lg p-4 hover:shadow-lg transition duration-300 cursor-pointer"
                onClick={() => handleRelatedProductClick(relatedProduct._id)}
              >
                <div
                  ref={(el) => (observerRefs.current[`related-${relatedProduct._id}`] = el)}
                  data-url={relatedProduct.images[0]}
                  className="w-full h-32 sm:h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2"
                >
                  {imageDataMap[relatedProduct.images[0]] ? (
                    <img
                      src={imageDataMap[relatedProduct.images[0]]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="animate-pulse bg-gray-300 w-full h-full rounded-md"></div>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                  {relatedProduct.name}
                </h3>
                <p className="text-green-600 font-semibold">${relatedProduct.price}</p>
                <p className="text-xs text-gray-600">
                  {relatedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No related products available.</p>
        )}
      </div>

      
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4"
          onClick={handleZoomClose}
        >
          <div className="relative max-w-4xl w-full">
            <img
              src={zoomedImage}
              alt="Zoomed Product Image"
              className="object-contain w-full h-[80vh] rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition duration-300"
              onClick={handleZoomClose}
            >
              ✕
            </button>
          </div>
        </div>
      )}

     
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Login Required</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              You need to log in to place an order. Would you like to log in now?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLoginRedirect}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login
              </button>
              <button
                onClick={handleLoginCancel}
                className="w-full bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {isCartModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Feature Unavailable</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Sorry, the "Add to Cart" feature is currently unavailable. We are working to add it soon!
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCartCancel}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;