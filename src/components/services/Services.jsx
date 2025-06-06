import { useState } from "react";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
import { FaSearch, FaUser, FaCarSide, FaDoorOpen } from "react-icons/fa";
import { MdMenuOpen, MdOutlineElectricBike } from "react-icons/md";
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
  const [selectedService, setSelectedService] = useState(null);
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

  // Generate categories with icons
  const categories = [
    { name: "All", icon: <MdMenuOpen className="text-lg" /> },
    ...[...new Set(services.map((s) => s.serviceCategory))].map((category) => ({
      name: category,
      icon:
        category === "Bike" ? (
          <MdOutlineElectricBike className="text-lg" />
        ) : category === "Taxi" ? (
          <FaDoorOpen className="text-lg" />
        ) : (
          <MdMenuOpen className="text-lg" />
        ),
    })),
  ];

  // Handler for selecting a service (to open modal)
  const handleBookClick = (service) => setSelectedService(service);

  // Handler to proceed to booking page
  const handleProceed = () => {
    navigate(`/booking/${selectedService._id}`, { state: { selectedService } });
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
            text="Add New Trip"
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
            <span>{name}</span>
          </button>
        ))}
      </div>

      {/* Service cards grid */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row transition-transform hover:scale-[1.02] cursor-pointer"
              onClick={() => handleBookClick(service)}
            >
              <div className="md:w-[40%] h-48 md:h-auto">
                <img
                  src={service.servicePic}
                  alt={service.serviceName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x200?text=Bus+Image";
                    e.target.className = "w-full h-full object-cover bg-gray-100";
                  }}
                />
              </div>
              <div className="md:w-[60%] px-4 py-5 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {service.serviceName}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <FaUser className="w-4 h-4 text-gray-500" />
                      <span>Seats: {service.availableSeats}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCarSide className="w-4 h-4 text-gray-500" />
                      <span>{service.serviceCategory}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDoorOpen className="w-4 h-4 text-gray-500" />
                      <span>From: {service.destinationFrom}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaDoorOpen className="w-4 h-4 text-gray-500" />
                      <span>To: {service.destinationTo}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Price per seat</p>
                    <h3 className="text-xl font-semibold text-gray-900">
                      ${service.pricePerSeat}
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClick(service);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-full text-sm font-semibold transition-colors"
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

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-[#000000c0] bg-opacity-70 flex items-center justify-center z-[999] px-4 py-10">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl relative max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-black text-yellow-400 px-6 py-4 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">
                  {selectedService.serviceName}
                </h2>
                <button
                  onClick={() => setSelectedService(null)}
                  className="text-yellow-400 hover:text-white text-3xl font-light transition-colors focus:outline-none"
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>
              <div className="flex items-center mt-1">
                <svg
                  className="w-5 h-5 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-white">
                  {selectedService.destinationFrom} →{" "}
                  {selectedService.destinationTo}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              <div className="mb-5 overflow-hidden rounded-lg border border-gray-200">
                <img
                  src={selectedService.servicePic}
                  alt={selectedService.serviceName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/800x400?text=Bus+Image";
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Transporter
                  </p>
                  <p className="font-semibold">
                    {selectedService.transporter?.name || "N/A"}
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Contact
                  </p>
                  <p className="font-semibold">
                    {selectedService.transporter?.email || "N/A"}
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Departure
                  </p>
                  <p className="font-semibold">
                    {new Date(selectedService.travelDate).toLocaleDateString()}{" "}
                    at {selectedService.departureTime}
                  </p>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                    Arrival
                  </p>
                  <p className="font-semibold">
                    {new Date(selectedService.arrivalDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Seats:</span>
                  <span className="font-medium">
                    {selectedService.availableSeats} /{" "}
                    {selectedService.totalSeats}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per Seat:</span>
                  <span className="font-bold text-yellow-600">
                    ${selectedService.pricePerSeat}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pickup Option:</span>
                  <span className="font-medium">
                    {selectedService.pickupOption || "N/A"}
                  </span>
                </div>
              </div>

              {selectedService.routeCities && (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-2">
                    Route Cities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.routeCities.map((city, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black text-white text-xs rounded-full"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                Close
              </button>
              <button
                onClick={handleProceed}
                className="px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurServices;