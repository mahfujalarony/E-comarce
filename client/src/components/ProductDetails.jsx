import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div className="text-center text-lg font-semibold py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">{product.name}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 md:flex md:items-start">
        <div className="md:w-1/2">
          {product.images && product.images.length > 0 ? (
            <Carousel showThumbs={false} infiniteLoop autoPlay>
              {product.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={`http://localhost:3001/uploads/products/${img.split('/').pop()}`}
                    alt={product.name}
                    className="rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}
        </div>

        <div className="md:w-1/2 md:pl-6 mt-6 md:mt-0">
          <p className="text-gray-600 text-lg mb-4">{product.description}</p>
          <div className="text-xl font-bold text-green-600 mb-2">${product.price}</div>
          <p className="text-gray-500">Stock: {product.stock > 0 ? product.stock : 'Out of stock'}</p>
          <p className="text-sm text-gray-700 mt-2">
            <span className="font-medium">Category:</span> {product.category}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-medium">Brand:</span> {product.brand}
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="w-1/2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={product.stock === 0}
              onClick={() => navigate(`/pyment/${id}`)}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              className="w-1/2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
              disabled={product.stock === 0}
              onClick={() => navigate(`/order/${id}`)}  // 🔥 Order Now ক্লিক করলে রিডাইরেক্ট হবে
            >
              {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;