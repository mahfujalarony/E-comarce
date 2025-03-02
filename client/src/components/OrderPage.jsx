import React, { useState, useEffect } from 'react';
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
  const [sub_district, setsub_district] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [product, setProduct] = useState(null);

  // Load product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to load product details');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Place order function
  const placeOrder = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setMessage('Please login to place an order.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    
    const orderData = {
      productId: id,
      product_name: product.name,
      product_price: product.price,
      quantity,
      name,
      city,
      district,
      sub_district,
      postalCode,
      landmark,
      phoneNumber,
      productImageUrl: product.images && product.images.length > 0 
        ? `http://localhost:3001/uploads/products/${product.images[0].split('/').pop()}` 
        : null,
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/placeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong!');
      }

      const result = await response.json();
      setMessage(result.message || 'Order placed successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setMessage(error.message || 'Failed to place order.');
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

  if (!product) {
    return <div className="text-center py-10">Loading product details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Order Page</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8 max-w-lg mx-auto">
        {product.images && product.images.length > 0 ? (
          <img
            src={`http://localhost:3001/uploads/products/${product.images[0].split('/').pop()}`}
            alt={product.name}
            className="w-56 h-56 object-cover rounded-lg mx-auto mb-4"
          />
        ) : (
          <div className="w-56 h-56 bg-gray-200 flex items-center justify-center rounded-lg mx-auto mb-4">
            <span className="text-gray-500">No image</span>
          </div>
        )}
        <h2 className="text-2xl font-semibold text-center text-gray-800">{product.name}</h2>
        <p className="text-lg text-center text-gray-600">Price: ${product.price}</p>
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
              onChange={(e) => setsub_district(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder="Enter your sub_district"
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
              placeholder="e.g., Near Ullkzuggo Bazar"
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
  );
};

export default OrderPage;