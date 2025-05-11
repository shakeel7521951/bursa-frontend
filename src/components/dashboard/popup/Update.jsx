import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PRODUCT_DATA = [
  {
    id: 1,
    name: "Tesla Model 3",
    category: "Electric",
    price: 99.99,
    stock: 143,
    sales: 1200,
    image:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww",
  },
  {
    id: 2,
    name: "Ford Mustang",
    category: "Sports",
    price: 149.99,
    stock: 89,
    sales: 800,
    image:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww",
  },
  {
    id: 3,
    name: "BMW X5",
    category: "SUV",
    price: 199.99,
    stock: 56,
    sales: 650,
    image:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww",
  },
  {
    id: 4,
    name: "Toyota Corolla",
    category: "Sedan",
    price: 59.99,
    stock: 210,
    sales: 950,
    image:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww",
  },
  {
    id: 5,
    name: "Mercedes-Benz E-Class",
    category: "Luxury",
    price: 179.99,
    stock: 78,
    sales: 720,
    image:
      "https://images.unsplash.com/photo-1627989580309-bfaf3e58af6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8d2lyZWxlc3MlMjBlYXJidWRzfGVufDB8fDB8fHww",
  },
];

const Update = ({ isOpen, onClose, productId, onUpdate }) => {
  const [product, setProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (productId) {
      const foundProduct = PRODUCT_DATA.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct({ ...foundProduct });
        setImagePreview(foundProduct.image);
      }
    }
  }, [productId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProduct((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="absolute inset-0"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white p-6 rounded-lg shadow-xl w-[700px] max-w-full relative z-10"
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition"
          onClick={onClose}
        >
          ❌
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Update Product
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Grid Layout for Form */}
          <div className="grid grid-cols-2 gap-4">
            {["name", "category", "price", "stock", "sales"].map(
              (field, index) => (
                <div key={index} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {field}:
                  </label>
                  <input
                    type={
                      field === "price" ||
                      field === "stock" ||
                      field === "sales"
                        ? "number"
                        : "text"
                    }
                    name={field}
                    value={product[field]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
              )
            )}
          </div>

          {/* Image Section */}
          <div className="flex items-center gap-4 mt-4">
            {/* Image Preview */}
            <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Car Preview"
                className="w-full h-full object-cover"
              />
            </div>
            {/* File Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Car Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Update
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Update;
