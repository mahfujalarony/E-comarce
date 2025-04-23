import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const imageCache = {};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [imageDataMap, setImageDataMap] = useState(imageCache);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const imageRef = useRef(null);
  const observerRefs = useRef({});
  const { user } = useContext(AuthContext); 
  const userId = user?._id || JSON.parse(localStorage.getItem("user"))?._id || "";
  const API_URL = 'https://e-comarce-8gj0.onrender.com';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const productResponse = await axios.get(`${API_URL}/api/products/${id}`);
        const fetchedProduct = productResponse.data;
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images && fetchedProduct.images.length > 0 ? fetchedProduct.images[0] : null);

        const relatedResponse = await axios.get(`${API_URL}/api/products`, {
          params: { category: fetchedProduct.category, limit: 4 },
        });
        const relatedData = Array.isArray(relatedResponse.data) ? relatedResponse.data : relatedResponse.data.products || [];
        setRelatedProducts(relatedData.filter((p) => p._id !== fetchedProduct._id));
      } catch (error) {
        console.error('Error fetching data:', error.response?.data || error.message);
      } finally {
        setIsLoading(false);
      }
    };

    setProduct(null);
    setRelatedProducts([]);
    fetchData();
  }, [id, API_URL]);

  const loadImage = async (url) => {
    if (!url || imageCache[url]) {
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
    if (!product) return;

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

  const handleImageSelect = (img) => {
    setSelectedImage(img);
  };

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 150; 
    const zoomLevel = 2;

    let lensX = x - lensSize / 2;
    let lensY = y - lensSize / 2;

    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > rect.width - lensSize) lensX = rect.width - lensSize;
    if (lensY > rect.height - lensSize) lensY = rect.height - lensSize;

    const zoomX = -lensX * zoomLevel;
    const zoomY = -lensY * zoomLevel;

    setZoomStyle({
      display: 'block',
      left: `${lensX}px`,
      top: `${lensY}px`,
      backgroundImage: `url(${imageDataMap[selectedImage]})`,
      backgroundSize: `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`,
      backgroundPosition: `${zoomX}px ${zoomY}px`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleLoginRedirect = () => {
    setIsLoginModalOpen(false);
    navigate('/login');
  };

  const handleLoginCancel = () => {
    setIsLoginModalOpen(false);
  };

  const handleRelatedProductClick = (productId) => {
    navigate(`/get/${productId}`);
  };

  return (
    <div className="container mx-auto px-4 bg-gray-100 min-h-screen pt-[calc(60px+1rem)] md:pt-6">
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
          .zoom-lens {
            position: absolute;
            width: 150px; 
            height: 150px;
            border: 2px solid #ccc;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
          }
          .image-container {
            position: relative;
            overflow: hidden;
          }
        `}
      </style>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      ) : !product ? (
        <div className="text-center text-lg font-semibold py-10">No Product Found</div>
      ) : (
        <div className="opacity-0 animate-fadeIn">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/2 bg-white p-4 rounded-lg shadow-md">
              <div
                className="image-container w-full h-64 sm:h-80 md:h-96 bg-gray-200 flex items-center justify-center rounded-lg"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {imageDataMap[selectedImage] ? (
                  <img
                    ref={imageRef}
                    src={imageDataMap[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full shimmer" />
                )}
                <div className="zoom-lens" style={zoomStyle}></div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="mt-4">
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((img, index) => (
                      <div
                        key={index}
                        ref={(el) => (observerRefs.current[`main-${index}`] = el)}
                        data-url={img}
                        className={`w-full h-16 bg-gray-200 flex items-center justify-center rounded-md cursor-pointer border-2 ${
                          selectedImage === img ? 'border-blue-600' : 'border-transparent'
                        }`}
                        onClick={() => handleImageSelect(img)}
                      >
                        {imageDataMap[img] ? (
                          <img
                            src={imageDataMap[img]}
                            alt={`${product.name} - Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full shimmer" />
                        )}
                      </div>
                    ))}
                  </div>
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
                  onClick={() => handleAddToCart(product._id)}
                  disabled={product.stock <= 0}
                  className={`w-full py-2 sm:py-3 rounded-md text-white transition-colors duration-300 ${
                    product.stock <= 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
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
                    className="border rounded-lg p-4 hover:shadow-lg transition duration-300 cursor-pointer opacity-0 animate-fadeIn"
                    onClick={() => handleRelatedProductClick(relatedProduct._id)}
                  >
                    <div
                      ref={(el) => (observerRefs.current[`related-${relatedProduct._id}`] = el)}
                      data-url={relatedProduct.images && relatedProduct.images[0]}
                      className="w-full h-32 sm:h-40 bg-gray-200 flex items-center justify-center rounded-md mb-2"
                    >
                      {imageDataMap[relatedProduct.images && relatedProduct.images[0]] ? (
                        <img
                          src={imageDataMap[relatedProduct.images[0]]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain rounded-md"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full shimmer" />
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

          <ToastContainer /> 
        </div>
      )}
    </div>
  );
};

export default ProductDetails;