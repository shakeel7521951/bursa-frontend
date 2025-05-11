import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {useCreateServiceMutation} from "../../redux/slices/ServiceApi";
import { toast } from "react-toastify";

const AddNewService = ({ isOpen, onClose }) => {
  const [createService, { isLoading }] = useCreateServiceMutation();
  const [product, setProduct] = useState({
    serviceName: "",
    serviceCategory: "",
    price: "",
    passengers: "",
    doors: "",
    servicePic: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      setProduct((prev) => ({
        ...prev,
        servicePic: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("serviceName", product.serviceName);
      formData.append("serviceCategory", product.serviceCategory);
      formData.append("price", product.price);
      formData.append("passengers", product.passengers);
      formData.append("doors", product.doors);
      if (product.servicePic) {
        formData.append("servicePic", product.servicePic);
      }
      const response = await createService(formData).unwrap();
      if (response.error) {
        toast.error(response.error?.message, { position: "top-center" });
      } else {
        toast.success(response.message, { position: "top-center" });
      }
      onClose();
    } catch (err) {
      console.error("Error adding service:", err);
    }
  };

  return (
    <div className="fixed inset-0 min-h-[100vh] flex items-center justify-center bg-[#00000098] bg-opacity-50 z-[999]">
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
          className="absolute top-2 cursor-pointer right-2 text-gray-600 hover:text-gray-800 transition"
          onClick={onClose}
        >
          ❌
        </button>

        <h2 className="text-2xl font-semibold cursor-pointer mb-4 text-gray-800">
          Add New Service
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Service Name", name: "serviceName", type: "text" },
              { label: "Category", name: "serviceCategory", type: "text" },
              { label: "Price", name: "price", type: "number" },
              { label: "Passengers", name: "passengers", type: "number" },
              { label: "Doors", name: "doors", type: "number" },
            ].map((field, index) => (
              <div key={index} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 capitalize">
                  {field.label}:
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={product[field.name]}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>
            ))}
          </div>

          {/* Image Upload Section */}
          <div className="flex items-center gap-4 mt-4">
            <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Car Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                Car Image:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border cursor-pointer border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-pointer hover:bg-gray-500 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Service"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddNewService;
