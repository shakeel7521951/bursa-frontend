  import { useState } from "react";
  import { MdMenuOpen, MdOutlineElectricBike } from "react-icons/md";
  import {
    FaCar,
    FaTaxi,
    FaSearch,
    FaUser,
    FaCarSide,
    FaSnowflake,
    FaDoorOpen,
  } from "react-icons/fa";
  import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
  import { Link } from "react-router-dom";

  const OurServices = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const { data, isLoading, error } = useGetAllServicesQuery();

    const services = data?.services || [];
    console.log(services);

    const filteredDeals = services.filter((service) => {
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

    const categories = [
      { name: "All", icon: <MdMenuOpen /> },
      ...[...new Set(services.map((service) => service.serviceCategory))].map(
        (category) => ({
          name: category,
          icon:
            category === "Bike" ? (
              <MdOutlineElectricBike />
            ) : category === "Taxi" ? (
              <FaTaxi />
            ) : category === "Cars" ? (
              <FaCar />
            ) : (
              <MdMenuOpen />
            ),
        })
      ),
    ];

    const closeModal = () => setSelectedService(null);

    return (
      <div className="w-full my-7 flex flex-col items-center">
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 p-3 rounded-lg shadow-md w-[80%] mb-5">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search for a service..."
            className="w-full bg-transparent outline-none text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-4 mb-5">
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

        {/* Services Grid */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDeals.length > 0 ? (
            filteredDeals.map((service) => (
              <div
                key={service._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row transform transition hover:scale-105"
              >
                <div className="md:w-[40%] my-auto">
                  <img
                    src={service.servicePic || "https://via.placeholder.com/150"}
                    alt={service.serviceName}
                    className="w-full object-cover h-full max-h-[200px]"
                  />
                </div>
                <div className="md:w-[60%] px-4 py-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {service.serviceName}
                    </h2>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FaUser className="w-5 h-5" />
                        <p>Available: {service.availableSeats}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FaCarSide className="w-5 h-5" />
                        <p>Category: {service.serviceCategory}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FaDoorOpen className="w-5 h-5" />
                        <p>From: {service.destinationFrom}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <FaDoorOpen className="w-5 h-5" />
                        <p>To: {service.destinationTo}</p>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-2" />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Price</p>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        ${service.price}/trip
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedService(service)}
                      className="bg-[#FFEE02] cursor-pointer text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#ffee02d6] transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No services found.</p>
          )}
        </div>

        {/* Custom Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-[#00000064] bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto pt-28 md:pt-40">
            <div className="bg-white rounded-xl p-6 max-w-lg w-full mt-5">
              {/* Title */}
              <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                {selectedService.serviceName}
              </h2>

              {/* Image */}
              <img
                src={selectedService.servicePic}
                alt={selectedService.serviceName}
                className="w-full h-60 object-cover rounded-xl mb-4"
              />

              {/* Service Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm md:text-base">
                <div>
                  <strong>Category:</strong> {selectedService.serviceCategory}
                </div>
                <div>
                  <strong>From:</strong> {selectedService.destinationFrom}
                </div>
                <div>
                  <strong>To:</strong> {selectedService.destinationTo}
                </div>
                <div>
                  <strong>Seats:</strong> {selectedService.availableSeats} /{" "}
                  {selectedService.totalSeats}
                </div>
                <div>
                  <strong>Departure:</strong> {selectedService.departureTime}
                </div>
                <div>
                  <strong>Price:</strong> ${selectedService.price}
                </div>
                <div className="text-nowrap">
                  <strong>Transporter:</strong> {selectedService.transporter.name}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={closeModal}
                  className="px-5 py-2 cursor-pointer bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                  Close
                </button>
                <Link to={`booking/${selectedService._id}`}
                  onClick={() => alert("Booking coming soon...")}
                  className="px-6 py-2 cursor-pointer bg-yellow-400 text-black rounded hover:bg-yellow-300 transition font-medium"
                >
                  Book Seat
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  export default OurServices;
