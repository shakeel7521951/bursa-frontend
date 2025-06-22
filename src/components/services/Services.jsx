import { useEffect, useState } from "react";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
import {
  FaSearch,
  FaUser,
  FaCarSide,
  FaDoorOpen,
  FaBox,
  FaTruck,
  FaHome,
  FaDog,
  FaMapMarkerAlt,
  FaRoute,
  FaFilter,
} from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Button";
import { selectUserProfile } from "../../redux/slices/UserSlice";
import { useSelector } from "react-redux";
import AddNewService from "../transporterDashboard/AddNewService";
import Loader from "../../Loader";

const OurServices = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const userProfile = useSelector(selectUserProfile);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || "Toate");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAllServicesQuery();
  const services = data?.services || [];

  const uniqueCategories = [...new Set(services.map(service => service.serviceCategory))].filter(Boolean);
  
  const getCategoryIcon = (category) => {
    switch (category) {
      case "passenger":
        return <FaUser className="text-lg" />;
      case "parcel":
        return <FaBox className="text-lg" />;
      case "car_towing":
        return <FaCarSide className="text-lg" />;
      case "vehicle_trailer":
        return <FaTruck className="text-lg" />;
      case "furniture":
        return <FaHome className="text-lg" />;
      case "animal":
        return <FaDog className="text-lg" />;
      default:
        return <MdMenuOpen className="text-lg" />;
    }
  };

  const categories = [
    { name: "Toate", icon: <MdMenuOpen className="text-lg" /> },
    ...uniqueCategories.map(category => ({
      name: category,
      icon: getCategoryIcon(category),
    })),
  ];

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const filteredServices = services.filter((service) => {
    const query = searchQuery.toLowerCase();
    return (
      (selectedCategory === "Toate" ||
        service.serviceCategory?.toLowerCase() === selectedCategory.toLowerCase()) &&
      [service.serviceName, service.serviceCategory, service.destinationFrom, service.destinationTo]
        .some((field) => field?.toLowerCase().includes(query))
    );
  });

  const handleBookNow = (service, e) => {
    e.stopPropagation();
    navigate(`/booking/${service._id}`, { state: { service } });
  };

  const renderServiceDetails = (service) => {
    switch (service.serviceCategory) {
      case "passenger":
        return (
          <>
            <div className="flex items-center gap-2">
              <FaUser className="w-4 h-4 text-gray-500" />
              <span>
                Locuri: {service.availableSeats}/{service.totalSeats}
              </span>
            </div>
            <div className="flex items-center gap-2 text-nowrap">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Preț per loc: ${service.price}</span>
            </div>
          </>
        );
      case "parcel":
        return (
          <>
            <div className="flex items-center gap-2">
              <FaBox className="w-4 h-4 text-gray-500" />
              <span>Capacitate: {service.parcelLoadCapacity} kg</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Preț: ${service.price}</span>
            </div>
          </>
        );
      case "car_towing":
        return (
          <>
            <div className="flex items-center gap-2">
              <FaCarSide className="w-4 h-4 text-gray-500" />
              <span>Vehicul: {service.vehicleType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Preț: ${service.price}</span>
            </div>
          </>
        );
      case "vehicle_trailer":
        return (
          <>
            <div className="flex items-center gap-2">
              <FaTruck className="w-4 h-4 text-gray-500" />
              <span>Remorcă: {service.trailerType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Preț: ${service.price}</span>
            </div>
          </>
        );
      case "furniture":
        return (
          <>
            <div className="flex items-center gap-2">
              <FaHome className="w-4 h-4 text-gray-500" />
              <span>Transport mobilă</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Preț: ${service.price}</span>
            </div>
          </>
        );
      case "animal":
        return (
          <>
            <div className="flex items-center gap-2">
              <FaDog className="w-4 h-4 text-gray-500" />
              <span>Animal: {service.animalType || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaDoorOpen className="w-4 h-4 text-gray-500" />
              <span>Preț: ${service.price}</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600">Eroare la încărcarea serviciilor</p>
      </div>
    );

  return (
    <div className="w-full my-7 flex flex-col items-center px-4 sm:px-6">
      <div className="container w-full max-w-6xl mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Caută servicii după nume, categorie sau rută..."
                className="block w-full pl-10 pr-12 py-3 border outline-none border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <FaFilter className="text-gray-400 hover:text-yellow-500 transition-colors" />
              </button>
            </div>

            {userProfile?.role === "Transporter" && (
              <Button
                onClick={() => setAddProductOpen(true)}
                text="Adaugă Serviciu Nou"
                bgHover="black"
                textHover="white"
                cutHover="white"
                className="w-full md:w-auto"
              />
            )}
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block mt-6 transition-all duration-200`}>
            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              FILTREAZĂ DUPĂ CATEGORIE
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map(({ name, icon }) => (
                <button
                  key={name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedCategory === name
                      ? "bg-yellow-400 text-black font-medium shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                  }`}
                  onClick={() => {
                    setSelectedCategory(name);
                    if (window.innerWidth < 768) {
                      setShowFilters(false);
                    }
                  }}
                >
                  <span className="text-lg">{icon}</span>
                  <span className="capitalize whitespace-nowrap">
                    {name.replace(/_/g, " ")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddNewService
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 w-full">
                <img
                  src={service.servicePic}
                  alt={service.serviceName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Transport+Image";
                    e.target.className =
                      "w-full h-full object-cover bg-gray-100";
                  }}
                />
                <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  {getCategoryIcon(service.serviceCategory)}
                  <span className="capitalize">
                    {service.serviceCategory.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-bold text-gray-900 line-clamp-1">
                    {service.serviceName}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Disponibil
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <FaMapMarkerAlt className="text-yellow-500" />
                  <span className="text-sm font-medium">
                    {service.destinationFrom} → {service.destinationTo}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {renderServiceDetails(service)}
                </div>

                {service.routeCities?.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                      <FaRoute className="text-sm" />
                      <span className="text-xs font-semibold">ORAȘE INTERMEDIARE</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.routeCities.map((city, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded-full border border-gray-200"
                        >
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={(e) => handleBookNow(service, e)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                  Rezervă acum
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
            <FaSearch className="text-gray-300 text-5xl mb-4" />
            <h3 className="text-gray-500 text-xl font-medium mb-2">Nu s-au găsit servicii</h3>
            <p className="text-gray-400 text-sm">
              Încearcă să ajustezi căutarea sau filtrele
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OurServices;
