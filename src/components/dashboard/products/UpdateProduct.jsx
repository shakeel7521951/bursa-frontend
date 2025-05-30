import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useUpdateServiceMutation } from "../../../redux/slices/ServiceApi";

const UpdateService = ({ isOpen, onClose, serviceData, userId }) => {
  const [updateService, { isLoading }] = useUpdateServiceMutation();
console.log(updateService)
  // Initialize form with existing service data
  const [product, setProduct] = useState({
    serviceName: "",
    serviceCategory: "",
    destinationFrom: "",
    destinationTo: "",
    routeCities: "", // comma separated string
    travelDate: "",
    departureTime: "",
    arrivalDate: "",
    availabilityDaysRomania: "", // comma separated string
    availabilityDaysItaly: "", // comma separated string
    totalSeats: "",
    availableSeats: "",
    parcelLoadCapacity: "",
    pickupOption: "",
    pricePerSeat: "",
    servicePic: null, // for new image upload
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Load serviceData into form state when component mounts or serviceData changes
  useEffect(() => {
    if (serviceData) {
      setProduct({
        serviceName: serviceData.serviceName || "",
        serviceCategory: serviceData.serviceCategory || "",
        destinationFrom: serviceData.destinationFrom || "",
        destinationTo: serviceData.destinationTo || "",
        routeCities: Array.isArray(serviceData.routeCities)
          ? serviceData.routeCities.join(", ")
          : "",
        travelDate: serviceData.travelDate ? serviceData.travelDate.split("T")[0] : "",
        departureTime: serviceData.departureTime || "",
        arrivalDate: serviceData.arrivalDate ? serviceData.arrivalDate.split("T")[0] : "",
        availabilityDaysRomania: serviceData.availabilityDays?.romania
          ? serviceData.availabilityDays.romania.join(", ")
          : "",
        availabilityDaysItaly: serviceData.availabilityDays?.italy
          ? serviceData.availabilityDays.italy.join(", ")
          : "",
        totalSeats: serviceData.totalSeats || "",
        availableSeats: serviceData.availableSeats || "",
        parcelLoadCapacity: serviceData.parcelLoadCapacity || "",
        pickupOption: serviceData.pickupOption || "",
        pricePerSeat: serviceData.pricePerSeat || "",
        servicePic: null, // reset file input for update
      });

      // Set preview to existing image URL if available
      setImagePreview(serviceData.servicePicUrl || null);
    }
  }, [serviceData]);

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
      // Convert availability days inputs
      const romaniaDaysArray = product.availabilityDaysRomania
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);

      const italyDaysArray = product.availabilityDaysItaly
        .split(",")
        .map((day) => day.trim())
        .filter(Boolean);

      if (romaniaDaysArray.length === 0 || italyDaysArray.length === 0) {
        toast.error(
          "Availability days for Romania and Italy are required as arrays.",
          { position: "top-center" }
        );
        return;
      }

      const formData = new FormData();

      formData.append("serviceName", product.serviceName);
      formData.append("serviceCategory", product.serviceCategory);
      formData.append("destinationFrom", product.destinationFrom);
      formData.append("destinationTo", product.destinationTo);

      const routeCitiesArray = product.routeCities
        .split(",")
        .map((city) => city.trim())
        .filter(Boolean);
      routeCitiesArray.forEach((city) =>
        formData.append("routeCities[]", city)
      );

      formData.append("travelDate", product.travelDate);
      formData.append("departureTime", product.departureTime);
      formData.append("arrivalDate", product.arrivalDate);

      const availabilityDays = {
        romania: romaniaDaysArray,
        italy: italyDaysArray,
      };
      formData.append("availabilityDays", JSON.stringify(availabilityDays));

      if (product.serviceCategory === "people") {
        formData.append("totalSeats", product.totalSeats);
        formData.append("availableSeats", product.availableSeats);
      } else {
        formData.append("totalSeats", "");
        formData.append("availableSeats", "");
      }

      if (product.serviceCategory === "parcels") {
        formData.append("parcelLoadCapacity", product.parcelLoadCapacity);
      } else {
        formData.append("parcelLoadCapacity", "");
      }

      formData.append("pickupOption", product.pickupOption);
      formData.append("pricePerSeat", product.pricePerSeat);

      if (userId) {
        formData.append("transporter", userId);
      }

      // Append image only if new file selected
      if (product.servicePic) {
        formData.append("servicePic", product.servicePic);
      }

      // Include the service id for update
      const serviceId = serviceData._id;
      const response = await updateService({id:serviceId,data:formData}).unwrap();
      if (response.error) {
        toast.error(response.error?.message || "Error updating service", {
          position: "top-center",
        });
      } else {
        toast.success(response.message || "Service updated successfully", {
          position: "top-center",
        });
        onClose();
      }
    } catch (err) {
      console.error("Error updating service:", err);
      toast.error("Failed to update service", { position: "top-center" });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-[#00000098] flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-3xl mx-auto px-4 relative">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="bg-white p-6 rounded-lg shadow-xl relative z-10 max-h-[90vh] overflow-y-auto"
        >
          <button
            type="button"
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            onClick={onClose}
            aria-label="Close modal"
          >
            ❌
          </button>

          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Update Service
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Service Name */}
              <div>
                <label
                  htmlFor="serviceName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Name:
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={product.serviceName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Service Category */}
              <div>
                <label
                  htmlFor="serviceCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category:
                </label>
                <select
                  id="serviceCategory"
                  name="serviceCategory"
                  value={product.serviceCategory}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="people">People</option>
                  <option value="parcels">Parcels</option>
                  <option value="vehicles">Vehicles</option>
                </select>
              </div>

              {/* Destination From */}
              <div>
                <label
                  htmlFor="destinationFrom"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination From:
                </label>
                <input
                  type="text"
                  id="destinationFrom"
                  name="destinationFrom"
                  value={product.destinationFrom}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Destination To */}
              <div>
                <label
                  htmlFor="destinationTo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Destination To:
                </label>
                <input
                  type="text"
                  id="destinationTo"
                  name="destinationTo"
                  value={product.destinationTo}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Route Cities */}
              <div className="md:col-span-2">
                <label
                  htmlFor="routeCities"
                  className="block text-sm font-medium text-gray-700"
                >
                  Route Cities (comma separated):
                </label>
                <input
                  type="text"
                  id="routeCities"
                  name="routeCities"
                  value={product.routeCities}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. City1, City2, City3"
                />
              </div>

              {/* Travel Date */}
              <div>
                <label
                  htmlFor="travelDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Travel Date:
                </label>
                <input
                  type="date"
                  id="travelDate"
                  name="travelDate"
                  value={product.travelDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Departure Time */}
              <div>
                <label
                  htmlFor="departureTime"
                  className="block text-sm font-medium text-gray-700"
                >
                  Departure Time:
                </label>
                <input
                  type="time"
                  id="departureTime"
                  name="departureTime"
                  value={product.departureTime}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Arrival Date */}
              <div>
                <label
                  htmlFor="arrivalDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Arrival Date:
                </label>
                <input
                  type="date"
                  id="arrivalDate"
                  name="arrivalDate"
                  value={product.arrivalDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Availability Days Romania */}
              <div>
                <label
                  htmlFor="availabilityDaysRomania"
                  className="block text-sm font-medium text-gray-700"
                >
                  Availability Days Romania (comma separated):
                </label>
                <input
                  type="text"
                  id="availabilityDaysRomania"
                  name="availabilityDaysRomania"
                  value={product.availabilityDaysRomania}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Monday, Wednesday, Friday"
                  required
                />
              </div>

              {/* Availability Days Italy */}
              <div>
                <label
                  htmlFor="availabilityDaysItaly"
                  className="block text-sm font-medium text-gray-700"
                >
                  Availability Days Italy (comma separated):
                </label>
                <input
                  type="text"
                  id="availabilityDaysItaly"
                  name="availabilityDaysItaly"
                  value={product.availabilityDaysItaly}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Tuesday, Thursday, Saturday"
                  required
                />
              </div>

              {/* Conditionally show seats for people */}
              {product.serviceCategory === "people" && (
                <>
                  <div>
                    <label
                      htmlFor="totalSeats"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Total Seats:
                    </label>
                    <input
                      type="number"
                      id="totalSeats"
                      name="totalSeats"
                      value={product.totalSeats}
                      onChange={handleChange}
                      min={1}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="availableSeats"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Available Seats:
                    </label>
                    <input
                      type="number"
                      id="availableSeats"
                      name="availableSeats"
                      value={product.availableSeats}
                      onChange={handleChange}
                      min={0}
                      max={Number(product.totalSeats) || undefined}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </>
              )}

              {/* Conditionally show parcel load capacity */}
              {product.serviceCategory === "parcels" && (
                <div className="md:col-span-2">
                  <label
                    htmlFor="parcelLoadCapacity"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Parcel Load Capacity:
                  </label>
                  <input
                    type="number"
                    id="parcelLoadCapacity"
                    name="parcelLoadCapacity"
                    value={product.parcelLoadCapacity}
                    onChange={handleChange}
                    min={0}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              )}

              {/* Pickup Option */}
              <div>
                <label
                  htmlFor="pickupOption"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pickup Option:
                </label>
                <select
                  id="pickupOption"
                  name="pickupOption"
                  value={product.pickupOption}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Price per Seat */}
              <div>
                <label
                  htmlFor="pricePerSeat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price per Seat:
                </label>
                <input
                  type="number"
                  id="pricePerSeat"
                  name="pricePerSeat"
                  value={product.pricePerSeat}
                  onChange={handleChange}
                  min={0}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              {/* Service Picture */}
              <div className="md:col-span-2">
                <label
                  htmlFor="servicePic"
                  className="block text-sm font-medium text-gray-700"
                >
                  Service Picture:
                </label>
                <input
                  type="file"
                  id="servicePic"
                  name="servicePic"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 max-h-40 object-contain rounded-md"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold text-white ${
                isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {isLoading ? "Updating..." : "Update Service"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateService;
