import { useState } from "react";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
import { FaSearch, FaUser, FaCarSide, FaDoorOpen } from "react-icons/fa";
import { MdMenuOpen, MdOutlineElectricBike } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
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
    { name: "All", icon: <MdMenuOpen /> },
    ...[...new Set(services.map((s) => s.serviceCategory))].map((category) => ({
      name: category,
      icon:
        category === "Bike" ? (
          <MdOutlineElectricBike />
        ) : category === "Taxi" ? (
          <FaDoorOpen />
        ) : (
          <MdMenuOpen />
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
    return <p className="text-center mt-10">Loading services...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600">Error loading services</p>
    );

  return (
    <div className="w-full my-7 flex flex-col items-center px-6 md:px-0">
      {/* Search bar */}
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 mb-6 w-full">
        {/* Search Input */}
        <div className="flex mx-auto items-center w-full md:max-w-md bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
          <FaSearch className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search for a service..."
            className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add New Trip Button */}
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
      <div className="flex gap-4 mb-5 flex-wrap justify-center">
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md cursor-pointer ${
              selectedCategory === name
                ? "bg-[#FFEE02] text-black"
                : "bg-gray-200 text-gray-700"
            } transition-all duration-300`}
            onClick={() => setSelectedCategory(name)}
          >
            {icon} {name}
          </button>
        ))}
      </div>

      {/* Service cards grid */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row transform transition hover:scale-105 cursor-pointer"
              onClick={() => handleBookClick(service)}
            >
              <div className="md:w-[40%] my-auto">
                <img
                  src={service.servicePic}
                  alt={service.serviceName}
                  className="w-full object-cover h-full max-h-[200px]"
                />
              </div>
              <div className="md:w-[60%] px-4 py-6 flex flex-col justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {service.serviceName}
                </h2>
                <div className="grid grid-cols-2 gap-2 mt-3 text-gray-700 text-sm">
                  <div className="flex items-center gap-2">
                    <FaUser className="w-5 h-5" />
                    <p>Available Seats: {service.availableSeats}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCarSide className="w-5 h-5" />
                    <p>Category: {service.serviceCategory}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDoorOpen className="w-5 h-5" />
                    <p>From: {service.destinationFrom}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaDoorOpen className="w-5 h-5" />
                    <p>To: {service.destinationTo}</p>
                  </div>
                </div>
                <hr className="mt-2" />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      ${service.pricePerSeat}/trip
                    </h3>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookClick(service);
                    }}
                    className="bg-[#FFEE02] cursor-pointer text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#ffee02d6] transition"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No services found.</p>
        )}
      </div>

      {/* Modal for selected service details */}
      {selectedService && (
        <div className="fixed pt-10 inset-0 bg-[#0000008a] flex items-center justify-center overflow-y-auto z-[999] px-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-3xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedService.serviceName}
            </h2>
            <img
              src={selectedService.servicePic}
              alt={selectedService.serviceName}
              className="w-full h-52 object-cover rounded mb-4"
            />

            <p>
              <strong>Transporter:</strong>{" "}
              {selectedService.transporter?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedService.transporter?.email || "N/A"}
            </p>
            <p>
              <strong>From:</strong> {selectedService.destinationFrom}
            </p>
            <p>
              <strong>To:</strong> {selectedService.destinationTo}
            </p>
            <p>
              <strong>Departure Time:</strong> {selectedService.departureTime}
            </p>
            <p>
              <strong>Travel Date:</strong>{" "}
              {new Date(selectedService.travelDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Arrival Date:</strong>{" "}
              {new Date(selectedService.arrivalDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Available Seats:</strong> {selectedService.availableSeats}{" "}
              / {selectedService.totalSeats}
            </p>
            <p>
              <strong>Price per Seat:</strong> ${selectedService.pricePerSeat}
            </p>
            <p>
              <strong>Route Cities:</strong>{" "}
              {selectedService.routeCities?.join(", ") || "N/A"}
            </p>
            <p>
              <strong>Pickup Option:</strong>{" "}
              {selectedService.pickupOption || "N/A"}
            </p>

            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={handleProceed}
                className="px-4 py-2 bg-[#FFEE02] text-black font-semibold rounded hover:bg-[#e6d902]"
              >
                Proceed to Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurServices;
