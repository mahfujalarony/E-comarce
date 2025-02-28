import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Our Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            {/* Show only the first image */}
            {product.images && product.images.length > 0 && (
              <img
                src={`http://localhost:3001/uploads/products/${product.images[0].split("/").pop()}`}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                {product.name}
              </h2>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-bold text-green-600">
                  ${product.price}
                </p>
                <p className="text-sm text-gray-500">
                  Stock: {product.stock}
                </p>
              </div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Category:</span> {product.category}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-300">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;