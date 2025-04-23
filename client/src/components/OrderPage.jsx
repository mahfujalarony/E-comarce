import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const OrderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [sub_district, setSubDistrict] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pageState, setPageState] = useState({ isLoading: true, product: null, imageData: null });
  const imageRef = useRef(null);
  //const API_URL = 'https://e-comarce-iuno.vercel.app';
  const API_URL = 'http://localhost:5000';

const isFetched = useRef(false);

useEffect(() => {
  if (isFetched.current) return;
  isFetched.current = true;

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setPageState({ isLoading: false, product: response.data, imageData: null });
    } catch (error) {
      console.error('Error loading product:', error);
      setPageState({ isLoading: false, product: null, imageData: null });
      setMessage('Failed to load product.');
    }
  };

  setPageState({ isLoading: true, product: null, imageData: null });
  fetchProductDetails();
}, [id, API_URL]);


  const loadImage = async (url) => {
    if (pageState.imageData?.url === url) return;
    try {
      const res = await axios.get(`${API_URL}/api/image-data`, { params: { url } });
      setPageState((prev) => ({ ...prev, imageData: { url, data: res.data.imageData } }));
    } catch (error) {
      console.error(`Error loading image for ${url}:`, error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && pageState.product?.images?.[0]) {
            loadImage(pageState.product.images[0]);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '100px' }
    );

    if (imageRef.current) observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, [pageState.product]);

  const validateForm = () => {
    if (!name || !city || !district || !sub_district || !postalCode || !phoneNumber) {
      setMessage('All fields are required.');
      return false;
    }
    if (!/^\d{11}$/.test(phoneNumber)) {
      setMessage('Phone number must be 11 digits.');
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login to place an order.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    const orderData = {
      productId: id,
      product_name: pageState.product.name,
      product_price: pageState.product.price,
      quantity,
      name,
      city,
      district,
      sub_district,
      postalCode,
      landmark,
      phoneNumber,
      productImageUrl: pageState.product.images && pageState.product.images.length > 0 ? pageState.product.images[0] : null,
    };

    try {
      setLoading(true);
      // const response = await axios.post(`${API_URL}/api/placeOrder`, orderData, {
      //   headers: { 'Authorization': `Bearer ${token}` },
      // });
      const response = await axios.post(`${API_URL}/api/placeOrder`, orderData, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setMessage('Order placed successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to place order.');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantity(value);
  };

  const confirmOrder = () => {
    if (window.confirm('Are you sure you want to confirm this order?')) {
      placeOrder();
    }
  };

  const SkeletonLoader = () => (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-100">
      <div className="h-10 bg-gray-300 rounded mb-8 max-w-lg mx-auto animate-pulse" />
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-lg mx-auto">
        <div className="w-56 h-56 bg-gray-300 rounded-lg mx-auto mb-4 animate-pulse" />
        <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse mx-auto w-3/4" />
        <div className="h-4 bg-gray-300 rounded animate-pulse mx-auto w-1/2" />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index}>
              <div className="h-4 bg-gray-300 rounded mb-1 animate-pulse w-1/3" />
              <div className="h-10 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div className="h-4 bg-gray-300 rounded mb-1 animate-pulse w-1/4" />
          <div className="h-10 bg-gray-300 rounded animate-pulse" />
        </div>
        <div className="h-12 bg-gray-300 rounded mt-6 animate-pulse" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-100">
      <style>
        {`
          .animate-pulse { animation: pulse 1.5s infinite; }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}
      </style>

      {pageState.isLoading ? (
        <SkeletonLoader />
      ) : !pageState.product && !message ? (
        <div className="text-center py-10">No product details available.</div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Order Page</h1>

          <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-lg mx-auto">
            {pageState.product?.images && pageState.product.images.length > 0 ? (
              <div
                ref={imageRef}
                data-url={pageState.product.images[0]}
                className="w-56 h-56 bg-gray-200 flex items-center justify-center rounded-lg mx-auto mb-4"
              >
                {pageState.imageData?.data ? (
                  <img
                    src={pageState.imageData.data}
                    alt={pageState.product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg" />
                )}
              </div>
            ) : (
              <div className="w-56 h-56 bg-gray-200 flex items-center justify-center rounded-lg mx-auto mb-4">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            <h2 className="text-2xl font-semibold text-center text-gray-800">{pageState.product?.name || 'Unknown Product'}</h2>
            <p className="text-lg text-center text-gray-600">Price: ${pageState.product?.price || 'N/A'}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">City:</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Enter your city"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">District:</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Enter your district"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Sub District:</label>
                <input
                  type="text"
                  value={sub_district}
                  onChange={(e) => setSubDistrict(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Enter your sub district"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Postal Code:</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Enter your postal code"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Landmark (Optional):</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  placeholder="e.g., Near Market"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block font-medium text-gray-700 mb-1">Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>

            <p className="text-gray-600 mt-4">Delivery time: 3 days</p>

            <button
              className={`mt-6 w-full py-3 text-white font-semibold rounded-lg transition ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              }`}
              onClick={confirmOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Order'}
            </button>

            {message && (
              <p
                className={`mt-4 text-lg text-center ${
                  message.includes('success') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;