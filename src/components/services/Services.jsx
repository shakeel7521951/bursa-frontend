import React, { useState } from "react";
import { MdMenuOpen, MdOutlineElectricBike } from "react-icons/md";
import { FaCar, FaTaxi, FaSearch, FaUser, FaCarSide, FaSnowflake, FaDoorOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";

const OurServices = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, error } = useGetAllServicesQuery();

  const services = data && Array.isArray(data.services) ? data.services : [];

  if (isLoading) return <p className="text-center text-gray-500">Loading services...</p>;
  if (error) return <p className="text-center text-red-500">Failed to load services.</p>;

  const filteredDeals = services.filter((service) =>
    (selectedCategory === "All" ||
      (service.serviceCategory && service.serviceCategory.toLowerCase() === selectedCategory.toLowerCase())) &&
    service.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [
    { name: "All", icon: <MdMenuOpen /> },
    { name: "Bike", icon: <MdOutlineElectricBike /> },
    { name: "Taxi", icon: <FaTaxi /> },
    { name: "Cars", icon: <FaCar /> },
  ];

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
          aria-label="Search services"
        />
      </div>

      {/* Category Buttons */}
      <div className="flex gap-4 mb-5">
        {categories.map(({ name, icon }) => (
          <button
            key={name}
            className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-md cursor-pointer ${
              selectedCategory === name ? "bg-[#FFEE02] text-black" : "bg-gray-200 text-gray-700"
            } transition-all duration-300`}
            onClick={() => setSelectedCategory(name)}
          >
            {icon} {name}
          </button>
        ))}
      </div>

      {/* Service Cards */}
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
                  className="w-full object-cover"
                />
              </div>
              <div className="md:w-[60%] px-4 py-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{service.serviceName}</h2>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <FaUser className="w-6 h-6" />
                      <p>Passengers: {service.passengers || "N/A"}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <FaCarSide className="w-6 h-6" />
                      <p>Auto</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <FaSnowflake className="w-6 h-6" />
                      <p>Air Conditioning</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 text-sm">
                      <FaDoorOpen className="w-6 h-6" />
                      <p>Doors: {service.doors || "N/A"}</p>
                    </div>
                  </div>
                </div>
                <hr className="mt-2" />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Price</p>
                    <h3 className="text-2xl font-semibold text-gray-900">${service.price}/day</h3>
                  </div>
                  <Link
                    to={`/booking/${service._id}`}
                    state={{ service }}
                    className="bg-[#FFEE02] text-black px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#ffee02d6] transition"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No services found.</p>
        )}
      </div>
    </div>
  );
};

export default OurServices;