import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetAllTransportRequestsQuery } from "../redux/slices/TransportRequestApi";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUsers,
  FiTruck,
  FiClock,
  FiMapPin,
  FiAlertCircle,
  FiInfo,
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useAcceptTransportRequestMutation } from "../redux/slices/RequestBooking";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const AllTransportRequests = () => {
  const { data, isLoading, isError, refetch } = useGetAllTransportRequestsQuery();
  const [acceptTransportRequest] = useAcceptTransportRequestMutation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const handleAcceptRequest = async (requestId) => {
    try {
      const res = await acceptTransportRequest({ requestId }).unwrap();
      refetch();
      toast.success(res.message || "Cererea a fost acceptată cu succes!");
      navigate("/transporter-accepted-requests");
    } catch (error) {
      toast.error(error?.data?.message || "Nu s-a putut accepta cererea");
    }
  };

  if (isLoading)
    return (
      <Loader />
    );

  if (isError) {
    toast.error("Nu s-au putut încărca cererile de transport");
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <FiAlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-800">
            Ceva nu a funcționat
          </h2>
          <p className="mt-2 text-gray-600">
            Nu am putut încărca cererile de transport. Vă rugăm să încercați mai târziu.
          </p>
        </div>
      </div>
    );
  }

  const statusColors = {
    pending: { bg: "bg-amber-100", text: "text-amber-800" },
    accepted: { bg: "bg-emerald-100", text: "text-emerald-800" },
    rejected: { bg: "bg-red-100", text: "text-red-800" },
    fulfilled: { bg: "bg-blue-100", text: "text-blue-800" },
  };

  const filteredRequests = data?.data?.filter((request) => {
    const searchText = searchTerm.toLowerCase();
    const requestDate = new Date(request.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const matchesSearch =
      (request.departure && request.departure.toLowerCase().includes(searchText)) ||
      (request.destination && request.destination.toLowerCase().includes(searchText)) ||
      (request.category && request.category.toLowerCase().includes(searchText)) ||
      (request.notes && request.notes.toLowerCase().includes(searchText));

    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesService = serviceFilter === "all" || request.category === serviceFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && requestDate.toDateString() === today.toDateString()) ||
      (dateFilter === "upcoming" && requestDate > today);

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  const serviceTypes = [...new Set(data?.data?.map((req) => req.category))];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-black mb-2">Cereri de transport</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Gestionați toate cererile de transport într-un singur loc
          </p>
        </motion.div>

        {/* Search and Filter UI */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Căutați după locație, serviciu sau note..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFCA09] focus:border-[#FFCA09] sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCA09]"
            >
              <FiFilter className="mr-2" />
              Filtre
              <FiChevronDown className={`ml-2 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.2 }}
              className="bg-gray-50 p-4 rounded-md border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stare</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FFCA09] focus:border-[#FFCA09] sm:text-sm rounded-md"
                >
                  <option value="all">Toate stările</option>
                  <option value="pending">În așteptare</option>
                  <option value="accepted">Acceptate</option>
                  <option value="rejected">Respinse</option>
                  <option value="fulfilled">Finalizate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tip serviciu</label>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FFCA09] focus:border-[#FFCA09] sm:text-sm rounded-md"
                >
                  <option value="all">Toate serviciile</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dată</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FFCA09] focus:border-[#FFCA09] sm:text-sm rounded-md"
                >
                  <option value="all">Toate datele</option>
                  <option value="today">Astăzi</option>
                  <option value="upcoming">Viitoare</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Afișare {filteredRequests?.length || 0} din {data?.data?.length || 0} cereri
          </p>
          {(searchTerm || statusFilter !== "all" || serviceFilter !== "all" || dateFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setServiceFilter("all");
                setDateFilter("all");
              }}
              className="text-sm text-[#FFCA09] hover:text-black"
            >
              Șterge toate filtrele
            </button>
          )}
        </div>

        {/* Requests */}
        {filteredRequests?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-200 flex flex-col"
                >
                  <div className="p-5 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center">
                          <FiMapPin className="text-[#FFCA09] mr-2" />
                          <h2 className="text-lg font-semibold text-black">
                            {request.departure} → {request.destination}
                          </h2>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <FiClock className="mr-1" />
                          <span>Postat: {new Date(request.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          statusColors[request.status]?.bg || "bg-gray-100"
                        } ${statusColors[request.status]?.text || "text-gray-800"}`}
                      >
                        {request.status === "pending" ? "În așteptare" : 
                         request.status === "accepted" ? "Acceptată" :
                         request.status === "rejected" ? "Respinsă" :
                         "Finalizată"}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-400 mr-2" />
                        <span>
                          {new Date(request.date).toLocaleDateString("ro-RO", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiUsers className="text-gray-400 mr-2" />
                        <span>Pasageri: {request.passengers}</span>
                      </div>
                      <div className="flex items-center">
                        <FiTruck className="text-gray-400 mr-2" />
                        <span>Serviciu: {request.category}</span>
                      </div>
                      {request.notes && (
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-start">
                            <FiInfo className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-xs mb-1">Note:</p>
                              <p className="text-xs text-gray-500 line-clamp-2">{request.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-5 pb-5"
                    >
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCA09]"
                      >
                        Acceptă cererea
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg border border-gray-200 p-8 text-center"
          >
            <div className="mx-auto h-20 w-20 text-gray-300 mb-4">
              <FiTruck className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-black mb-1">Nu s-au găsit cereri de transport</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || serviceFilter !== "all" || dateFilter !== "all"
                ? "Nicio cerere nu se potrivește cu filtrele curente. Încercați să ajustați criteriile de căutare."
                : "În prezent nu există cereri de transport disponibile."}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AllTransportRequests;