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
    { value: "passenger", label: "Transport pasageri", icon: <FiUsers /> },
    { value: "parcel", label: "Transport colete", icon: <FiPackage /> },
    // { value: "car_towing", label: "Remorcare auto", icon: <FiCar /> },
    {
      value: "vehicle_trailer",
      label: "Transport vehicule pe remorcă",
      icon: <FiTruck />,
    },
    {
      value: "furniture",
      label: "Transport mobilă / Relocare",
      icon: <FiHome />,
    },
    { value: "animal", label: "Transport animale", icon: <FiGitMerge /> },
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
        toast.error("Zilele de disponibilitate pentru România și Italia sunt obligatorii.", {
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
        toast.error(response.error?.message || "Eroare la adăugarea serviciului", {
          position: "top-center",
        });
      } else {
        toast.success(response.message || "Serviciu adăugat cu succes", {
          position: "top-center",
        });
        navigate("/transporter-dashboard");
        onClose();
      }
    } catch (err) {
      console.error("Error adding service:", err);
      toast.error(err.data?.message || "Nu s-a putut adăuga serviciul", {
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
                Locuri totale
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
                Locuri disponibile
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
              Capacitate încărcare colete (kg)
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
              Tip vehicul
            </label>
            <select
              name="vehicleType"
              value={product.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Selectați tipul vehiculului</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Camion</option>
              <option value="van">Dubă</option>
            </select>
          </div>
        );
      case "vehicle_trailer":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiTruck className="text-gray-500" />
              Tip remorcă
            </label>
            <select
              name="trailerType"
              value={product.trailerType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Selectați tipul remorcii</option>
              <option value="flatbed">Platformă</option>
              <option value="enclosed">Închisă</option>
              <option value="lowboy">Lowboy</option>
            </select>
          </div>
        );
      case "furniture":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiHome className="text-gray-500" />
              Detalii mobilă
            </label>
            <textarea
              name="furnitureDetails"
              value={product.furnitureDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              placeholder="Descrieți articolele de mobilier și dimensiunile"
              required
            />
          </div>
        );
      case "animal":
        return (
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FiGitMerge className="text-gray-500" />
              Tip animal
            </label>
            <select
              name="animalType"
              value={product.animalType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="">Selectați tipul animalului</option>
              <option value="dog">Câine</option>
              <option value="cat">Pisică</option>
              <option value="bird">Pasăre</option>
              <option value="livestock">Animal de fermă</option>
              <option value="other">Altul</option>
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
          <h2 className="text-2xl font-bold">Creează serviciu nou</h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Închide"
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
                  Nume serviciu
                </label>
                <input
                  type="text"
                  name="serviceName"
                  value={product.serviceName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder="ex. Transport rapid în Italia"
                />
              </div>

              {/* Service Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiTruck className="text-gray-500" />
                  Categorie serviciu
                </label>
                <select
                  name="serviceCategory"
                  value={product.serviceCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  <option value="">Selectați o categorie</option>
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
                  Plecare (România)
                </label>
                <input
                  type="text"
                  name="destinationFrom"
                  value={product.destinationFrom}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder="ex. București"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiMapPin className="text-gray-500" />
                  Sosire (Italia)
                </label>
                <input
                  type="text"
                  name="destinationTo"
                  value={product.destinationTo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                  placeholder="ex. Roma"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiCalendar className="text-gray-500" />
                  Data călătoriei
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
                  Ora plecării
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
                  Data sosirii
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
                  Orașe pe traseu (separate prin virgulă)
                </label>
                <input
                  type="text"
                  name="routeCities"
                  value={product.routeCities}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="ex. Brașov, Sibiu, Timișoara"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Zile disponibile (România)
                </label>
                <input
                  type="text"
                  name="availabilityDaysRomania"
                  value={product.availabilityDaysRomania}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="ex. Luni, Miercuri"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Zile disponibile (Italia)
                </label>
                <input
                  type="text"
                  name="availabilityDaysItaly"
                  value={product.availabilityDaysItaly}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="ex. Marți, Joi"
                  required
                />
              </div>

              {/* Category-specific fields */}
              {renderCategoryFields()}

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiDollarSign className="text-gray-500" />
                  Preț (€)
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
                      ? "Preț pe loc"
                      : "Preț total"
                  }
                />
              </div>

              {/* Pickup Option */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Opțiune ridicare
                </label>
                <select
                  name="pickupOption"
                  value={product.pickupOption}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                >
                  <option value="no">Fără serviciu de ridicare</option>
                  <option value="yes">Cu serviciu de ridicare</option>
                </select>
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <FiUpload className="text-gray-500" />
                  Imagine serviciu
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-yellow-400 transition-colors">
                      <FiUpload className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Faceți clic pentru a încărca imaginea
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
                        alt="Previzualizare"
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
                {isLoading ? "Se creează serviciul..." : "Creează serviciu"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddNewService;