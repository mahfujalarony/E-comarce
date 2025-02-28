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

    // Handle text input changes
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle multiple image selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Append new files to existing files
        setImageFiles(prevFiles => [...prevFiles, ...files]);

        // Generate previews for new files and append to existing previews
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviews(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
    };

    // Remove selected image
    const removeImage = (index) => {
        const newFiles = imageFiles.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);
        setImageFiles(newFiles);
        setPreviews(newPreviews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            // Append product details
            Object.keys(product).forEach(key => {
                formData.append(key, product[key]);
            });
            // Append images
            imageFiles.forEach(file => {
                formData.append('images', file);
            });

            const response = await axios.post("http://localhost:3001/api/products", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Product created successfully!");
            // Reset form
            setProduct({ name: "", description: "", price: "", stock: "", category: "", brand: "" });
            setImageFiles([]);
            setPreviews([]);
            console.log(response.data);
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    return (
        <div className="create-product">
            <h2>Create New Product</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
                <textarea name="description" placeholder="Description" value={product.description} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
                <input type="number" name="stock" placeholder="Stock Quantity" value={product.stock} onChange={handleChange} required />
                <input type="text" name="category" placeholder="Category" value={product.category} onChange={handleChange} required />
                <input type="text" name="brand" placeholder="Brand" value={product.brand} onChange={handleChange} required />
                
                <div className="image-upload">
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        onChange={handleImageChange}
                    />
                    <div className="preview-container">
                        {previews.map((preview, index) => (
                            <div key={index} className="image-preview">
                                <img src={preview} alt={`preview-${index}`} style={{ maxWidth: '100px' }} />
                                <button type="button" onClick={() => removeImage(index)}>X</button>
                            </div>
                        ))}
                    </div>
                </div>
                
                <button type="submit">Create Product</button>
            </form>
        </div>
    );
};

export default CreateProduct;