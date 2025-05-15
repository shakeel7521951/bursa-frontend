import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCreateServiceMutation } from "../../redux/slices/ServiceApi";
import { toast } from "react-toastify";

const AddNewService = ({ isOpen, onClose }) => {
  const [createService, { isLoading }] = useCreateServiceMutation();

  const [product, setProduct] = useState({
    serviceName: "",
    serviceCategory: "",
    destinationFrom: "",
    destinationTo: "",
    totalSeats: "",
    availableSeats: "",
    price: "",
    servicePic: null,
    departureTime: "",
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
      formData.append("destinationFrom", product.destinationFrom);
      formData.append("destinationTo", product.destinationTo);
      formData.append("totalSeats", product.totalSeats);
      formData.append("availableSeats", product.availableSeats);
      formData.append("price", product.price);
      formData.append("departureTime", product.departureTime);
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
      toast.error("Failed to add service", { position: "top-center" });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#00000098] flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto mt-100 sm:mt-20 px-4">
        <motion.div
          className="absolute inset-0"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white p-6 rounded-lg shadow-xl relative z-10"
        >
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            ❌
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Add New Service
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Name:
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={product.serviceName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category:
                </label>
                <select
                  name="serviceCategory"
                  value={product.serviceCategory}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Bus">Bus</option>
                  <option value="Taxi">Taxi</option>
                  <option value="Shared Ride">Shared Ride</option>
                  <option value="Rental">Rental</option>
                  <option value="Cargo">Cargo</option>
                </select>
              </div>

              {/* Other Fields */}
              {[
                { label: "From (City)", name: "destinationFrom", type: "text" },
                { label: "To (City)", name: "destinationTo", type: "text" },
                { label: "Total Seats", name: "totalSeats", type: "number" },
                { label: "Available Seats", name: "availableSeats", type: "number" },
                { label: "Price", name: "price", type: "number" },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}:
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={product[field.name]}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              ))}

              {/* Departure Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Departure Time:
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={product.departureTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <div className="w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400 bg-gray-100">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700">
                  Service Image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-2 mt-6">
              <motion.button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? "Adding..." : "Add Service"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddNewService;
