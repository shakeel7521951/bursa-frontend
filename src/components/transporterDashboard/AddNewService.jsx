import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCreateServiceMutation } from "../../redux/slices/ServiceApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiUpload,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiTruck,
  FiPackage,
  // FiCar,
  FiHome,
  FiGitMerge,
} from "react-icons/fi";

const AddNewService = ({ isOpen, onClose, userId }) => {
  const [createService, { isLoading }] = useCreateServiceMutation();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    serviceName: "",
    serviceCategory: "",
    destinationFrom: "",
    destinationTo: "",
    routeCities: "",
    travelDate: "",
    departureTime: "",
    arrivalDate: "",
    availabilityDaysRomania: "",
    availabilityDaysItaly: "",
    totalSeats: "",
    availableSeats: "",
    parcelLoadCapacity: "",
    vehicleType: "",
    trailerType: "",
    furnitureDetails: "",
    animalType: "",
    pickupOption: "no",
    price: "",
    servicePic: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Category options
  const categories = [
    { value: "passenger", label: "Passenger Transport", icon: <FiUsers /> },
    { value: "parcel", label: "Parcel Transport", icon: <FiPackage /> },
    // { value: "car_towing", label: "Car Towing", icon: <FiCar /> },
    {
      value: "vehicle_trailer",
      label: "Vehicle Transport on Trailer",
      icon: <FiTruck />,
    },
    {
      value: "furniture",
      label: "Furniture Transport / Relocation",
      icon: <FiHome />,
    },
    { value: "animal", label: "Animal Transport", icon: <FiGitMerge /> },
  ];

  // Close modal on Escape key press
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
      // Convert comma-separated days to arrays
      const romaniaDaysArray = product.availabilityDaysRomania
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);

      const italyDaysArray = product.availabilityDaysItaly
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);

      if (romaniaDaysArray.length === 0 || italyDaysArray.length === 0) {
        toast.error("Availability days for Romania and Italy are required.", {
          position: "top-center",
        });
        return;
      }

      const formData = new FormData();

      // Append basic service information
      formData.append("serviceName", product.serviceName);
      formData.append("serviceCategory", product.serviceCategory);
      formData.append("destinationFrom", product.destinationFrom);
      formData.append("destinationTo", product.destinationTo);
      formData.append("travelDate", product.travelDate);
      formData.append("departureTime", product.departureTime);
      formData.append("arrivalDate", product.arrivalDate);
      formData.append("pickupOption", product.pickupOption);
      formData.append("price", product.price);

      // Append route cities as individual array elements
      const routeCitiesArray = product.routeCities
        .split(",")
        .map((city) => city.trim())
        .filter(Boolean);
      routeCitiesArray.forEach((city) => {
        formData.append("routeCities", city);
      });

      // Append availability days as separate fields
      romaniaDaysArray.forEach((day) => {
        formData.append("availabilityDaysRomania", day);
      });

      italyDaysArray.forEach((day) => {
        formData.append("availabilityDaysItaly", day);
      });

      // Append category-specific fields
      switch (product.serviceCategory) {
        case "passenger":
          formData.append("totalSeats", product.totalSeats);
          formData.append("availableSeats", product.availableSeats);
          break;
        case "parcel":
          formData.append("parcelLoadCapacity", product.parcelLoadCapacity);
          break;
        case "car_towing":
          formData.append("vehicleType", product.vehicleType);
          break;
        case "vehicle_trailer": // Fixed typo from "vehicle_trailer"
          formData.append("trailerType", product.trailerType);
          break;
        case "furniture":
          formData.append("furnitureDetails", product.furnitureDetails);
          break;
        case "animal":
          formData.append("animalType", product.animalType);
          break;
      }

      // Append user and image data
      if (userId) {
        formData.append("transporter", userId);
      }

      if (product.servicePic) {
        formData.append("servicePic", product.servicePic);
      }

      // Make the API call
      const response = await createService(formData).unwrap();

      if (response.error) {
        toast.error(response.error?.message || "Error adding service", {
          position: "top-center",
        });
      } else {
        toast.success(response.message || "Service added successfully", {
          position: "top-center",
        });
        navigate("/transporter-dashboard");
        onClose();
      }
    } catch (err) {
      console.error("Error adding service:", err);
      toast.error(err.data?.message || "Failed to add service", {
        position: "top-center",
      });
    }
  };
  // Render category-specific fields
  const renderCategoryFields = () => {
    switch (product.serviceCategory) {
      case "passenger":
        return (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiUsers className="text-gray-500" />
                Total Seats
              </label>
              <input
                type="number"
                name="totalSeats"
                value={product.totalSeats}
                onChange={handleChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiUsers className="text-gray-500" />
                Available Seats
              </label>
              <input
                type="number"
                name="availableSeats"
                value={product.availableSeats}
                onChange={handleChange}
                min="0"
                max={product.totalSeats || undefined}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
          </>
        );
      case "parcel":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiPackage className="text-gray-500" />
              Parcel Load Capacity (kg)
            </label>
            <input
              type="number"
              name="parcelLoadCapacity"
              value={product.parcelLoadCapacity}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>
        );
      case "car_towing":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              {/* <FiCar className="text-gray-500" /> */}
              Vehicle Type
            </label>
            <select
              name="vehicleType"
              value={product.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Select vehicle type</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="van">Van</option>
            </select>
          </div>
        );
      case "vehicle_trailer":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiTruck className="text-gray-500" />
              Trailer Type
            </label>
            <select
              name="trailerType"
              value={product.trailerType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Select trailer type</option>
              <option value="flatbed">Flatbed</option>
              <option value="enclosed">Enclosed</option>
              <option value="lowboy">Lowboy</option>
            </select>
          </div>
        );
      case "furniture":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiHome className="text-gray-500" />
              Furniture Details
            </label>
            <textarea
              name="furnitureDetails"
              value={product.furnitureDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Describe the furniture items and dimensions"
              required
            />
          </div>
        );
      case "animal":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiGitMerge className="text-gray-500" />
              Animal Type
            </label>
            <select
              name="animalType"
              value={product.animalType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Select animal type</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="bird">Bird</option>
              <option value="livestock">Livestock</option>
              <option value="other">Other</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center overflow-y-auto p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Create New Service</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  Service Name
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={product.serviceName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder="e.g. Express Transport to Italy"
                />
              </div>

              {/* Service Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiTruck className="text-gray-500" />
                  Service Category
                </label>
                <select
                  name="serviceCategory"
                  value={product.serviceCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Common Fields */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  From (Romania)
                </label>
                <input
                  type="text"
                  name="destinationFrom"
                  value={product.destinationFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder="e.g. Bucharest"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  To (Italy)
                </label>
                <input
                  type="text"
                  name="destinationTo"
                  value={product.destinationTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder="e.g. Rome"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  Travel Date
                </label>
                <input
                  type="date"
                  name="travelDate"
                  value={product.travelDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiClock className="text-gray-500" />
                  Departure Time
                </label>
                <input
                  type="time"
                  name="departureTime"
                  value={product.departureTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  Arrival Date
                </label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={product.arrivalDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Route Cities (comma separated)
                </label>
                <input
                  type="text"
                  name="routeCities"
                  value={product.routeCities}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. Brasov, Sibiu, Timisoara"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Availability Days (Romania)
                </label>
                <input
                  type="text"
                  name="availabilityDaysRomania"
                  value={product.availabilityDaysRomania}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. Monday, Wednesday"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Availability Days (Italy)
                </label>
                <input
                  type="text"
                  name="availabilityDaysItaly"
                  value={product.availabilityDaysItaly}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="e.g. Tuesday, Thursday"
                  required
                />
              </div>

              {/* Category-specific fields */}
              {renderCategoryFields()}

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiDollarSign className="text-gray-500" />
                  Price (€)
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder={
                    product.serviceCategory === "passenger"
                      ? "Price per seat"
                      : "Total price"
                  }
                />
              </div>

              {/* Pickup Option */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Pickup Option
                </label>
                <select
                  name="pickupOption"
                  value={product.pickupOption}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  <option value="no">No Pickup Service</option>
                  <option value="yes">With Pickup Service</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiUpload className="text-gray-500" />
                  Service Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors">
                      <FiUpload className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload image
                      </p>
                      <input
                        type="file"
                        name="servicePic"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Service..." : "Create Service"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNewService;
