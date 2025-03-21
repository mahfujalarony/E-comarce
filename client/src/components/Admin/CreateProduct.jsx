import { useState } from "react";
import axios from "axios";

const CreateProduct = () => {
    const [product, setProduct] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        brand: "",
    });
    const [imageFiles, setImageFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const categories = [
        "Electronics",
        "Mobiles",
        "Laptops",
        "Bykes",
        "Fashion",
        "Home & Kitchen",
        "Beauty",
        "Sports",
        "Books",
        "Toys",
        "Health",
        "Others",
    ];

    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prevFiles) => [...prevFiles, ...files]);
        const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
        setPreviews((prevPreviews) => [...prevPreviews, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            Object.keys(product).forEach((key) => {
                formData.append(key, product[key]);
            });
            imageFiles.forEach((file) => {
                formData.append("images", file);
            });

            const response = await axios.post(
                "http://localhost:3001/api/products",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

         
            setShowPopup(true);
            setProduct({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                brand: "",
            });
            setImageFiles([]);
            setPreviews([]);
            console.log(response.data);
        } catch (error) {
            console.error("Error creating product:", error);
            alert("Failed to create product: " + error.message); 
        } finally {
            setLoading(false); 
        }
    };

    const closePopup = () => {
        setShowPopup(false); 
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg relative">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Create New Product
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={product.description}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="number"
                            name="stock"
                            placeholder="Stock Quantity"
                            value={product.stock}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="" disabled>
                                Select Category
                            </option>
                            {categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <input
                            type="text"
                            name="brand"
                            placeholder="Brand"
                            value={product.brand}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="space-y-4">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {previews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`preview-${index}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading} 
                        className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${
                            loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                    />
                                </svg>
                                Creating...
                            </span>
                        ) : (
                            "Create Product"
                        )}
                    </button>
                </form>

                {/* পপআপ মডাল */}
                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                            <h3 className="text-lg font-semibold text-green-600">
                                Success!
                            </h3>
                            <p className="text-gray-700 mt-2">
                                Product created successfully!
                            </p>
                            <button
                                onClick={closePopup}
                                className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateProduct;