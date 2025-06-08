import { useState } from "react";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
import { 
  FaSearch, 
  FaUser, 
  FaCarSide, 
  FaDoorOpen,
  FaBox,
  FaTruck,
  FaHome,
  FaDog
} from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import { selectUserProfile } from "../../redux/slices/UserSlice";
import { useSelector } from "react-redux";
import AddNewService from "../transporterDashboard/AddNewService";

const OurServices = () => {
  const userProfile = useSelector(selectUserProfile);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch services data
  const { data, isLoading, error } = useGetAllServicesQuery();
  const services = data?.services || [];

  // Filter services based on category and search query
  const filteredServices = services.filter((service) => {
    const query = searchQuery.toLowerCase();
    return (
      (selectedCategory === "All" ||
        service.serviceCategory?.toLowerCase() ===
          selectedCategory.toLowerCase()) &&
      [
        service.serviceName,
        service.serviceCategory,
        service.destinationFrom,
        service.destinationTo,
      ].some((field) => field?.toLowerCase().includes(query))
    );
  });

  // Category icons mapping
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'passenger':
        return <FaUser className="text-lg" />;
      case 'parcel':
        return <FaBox className="text-lg" />;
      case 'car_towing':
        return <FaCarSide className="text-lg" />;
      case 'vehicle_trailer':
        return <FaTruck className="text-lg" />;
      case 'furniture':
        return <FaHome className="text-lg" />;
      case 'animal':
        return <FaDog className="text-lg" />;
      default:
        return <MdMenuOpen className="text-lg" />;
    }
  };

  // Generate categories with icons
  const categories = [
    { name: "All", icon: <MdMenuOpen className="text-lg" /> },
    ...['passenger', 'parcel', 'car_towing', 'vehicle_trailer', 'furniture', 'animal'].map((category) => ({
      name: category,
      icon: getCategoryIcon(category)
    })),
  ];

  // Handler to proceed to booking page
  const handleBookNow = (service, e) => {
    e.stopPropagation();
    navigate(`/booking/${service._id}`,{ state: { service } });
  };

  // Render service details based on category
  const renderServiceDetails = (service) => {
    switch(service.serviceCategory) {
      case 'passenger':
        return (
          <>
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4 text-gray-500" />
              <span>Seats: {service.availableSeats}/{service.totalSeats}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Price per seat: ${service.price}</span>
            </div>
          </>
        );
      case 'parcel':
        return (
          <>
            <div className="flex items-center gap-2">
              <FaBox className="w-4 h-4 text-gray-500" />
              <span>Capacity: {service.parcelLoadCapacity} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Price: ${service.price}</span>
            </div>
          </>
        );
      case 'car_towing':
        return (
          <>
            <div className="flex items-center gap-2">
              <FaCarSide className="w-4 h-4 text-gray-500" />
              <span>Vehicle: {service.vehicleType || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Price: ${service.price}</span>
            </div>
          </>
        );
      case 'vehicle_trailer':
        return (
          <>
            <div className="flex items-center gap-2">
              <FaTruck className="w-4 h-4 text-gray-500" />
              <span>Trailer: {service.trailerType || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Price: ${service.price}</span>
            </div>
          </>
        );
      case 'furniture':
        return (
          <>
            <div className="flex items-center gap-2">
              <FaHome className="w-4 h-4 text-gray-500" />
              <span>Furniture transport</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Price: ${service.price}</span>
            </div>
          </>
        );
      case 'animal':
        return (
          <>
            <div className="flex items-center gap-2">
              <FaDog className="w-4 h-4 text-gray-500" />
              <span>Animal: {service.animalType || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Price: ${service.price}</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Loading and error states
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading services...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">Error loading services</p>
      </div>
    );

  return (
    <div className="w-full my-7 flex flex-col items-center px-4 sm:px-6">
      {/* Search bar and add trip button */}
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 mb-6 w-full">
        <div className="flex items-center w-full md:max-w-md bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-transparent">
          <FaSearch className="text-gray-400 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Search for a service..."
            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {userProfile?.role === "Transporter" && (
          <Button
            onClick={() => setAddProductOpen(true)}
            text="Add New Service"
            bgHover="black"
            textHover="white"
            cutHover="white"
          />
        )}
      </div>

      <AddNewService
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      {/* Category filter buttons */}
      <div className="flex gap-3 mb-6 flex-wrap justify-center">
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all duration-200 ${
              selectedCategory === name
                ? "bg-yellow-400 text-black font-medium"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(name)}
          >
            <span className="text-lg">{icon}</span>
            <span className="capitalize">{name.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Service cards grid */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row transition-transform hover:scale-[1.02]"
            >
              <div className="md:w-[40%] h-48 md:h-auto">
                <img
                  src={service.servicePic}
                  alt={service.serviceName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Transport+Image";
                    e.target.className = "w-full h-full object-cover bg-gray-100";
                  }}
                />
              </div>
              <div className="md:w-[60%] px-4 py-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {service.serviceName}
                  </h2>
                  <div className="grid grid-cols-1 gap-2 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(service.serviceCategory)}
                      <span className="capitalize">
                        {service.serviceCategory.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDoorOpen className="w-4 h-4 text-gray-500" />
                      <span>From: {service.destinationFrom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDoorOpen className="w-4 h-4 text-gray-500" />
                      <span>To: {service.destinationTo}</span>
                    </div>
                    {renderServiceDetails(service)}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleBookNow(service, e)}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center py-12">
            <FaSearch className="text-gray-400 text-4xl mb-4" />
            <p className="text-gray-500 text-lg">No services found</p>
            <p className="text-gray-400 text-sm mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurServices;