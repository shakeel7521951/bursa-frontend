import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useDeleteTransportRequestMutation,
  useGetUserTransportRequestsQuery,
} from "../redux/slices/TransportRequestApi";
import {
  FiCalendar,
  FiUsers,
  FiTruck,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiClock,
  FiMapPin,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const MyTransportRequests = () => {
  const { data, isLoading, isError } = useGetUserTransportRequestsQuery();
  const [deleteRequest] = useDeleteTransportRequestMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const openConfirm = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    try {
      await deleteRequest(selectedId).unwrap();
      toast.success("Cererea a fost ștearsă cu succes");
    } catch (error) {
      toast.error(error?.data?.message || "Nu s-a putut șterge cererea");
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
    }
  };

  const userRequests = data?.data || [];

  const filteredRequests = userRequests.filter((request) => {
    const matchesSearch =
      request.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    fulfilled: "bg-blue-100 text-blue-800",
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 text-sm">Se încarcă cererile tale...</p>
        </div>
      </div>
    );

  if (isError) {
    toast.error("Nu s-au putut încărca cererile");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-6 rounded-lg shadow">
          <FiAlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            Eroare la încărcarea datelor
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
          Cererile mele de transport
        </h1>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative">
          {/* Search */}
          <div className="relative w-full md:w-2/3">
            <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Căutați după locație, serviciu sau note..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FiX
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-gray-600"
              />
            )}
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center justify-center w-full md:w-auto px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 md:me-20"
            >
              <FiFilter className="mr-2" />
              Filtre
              <FiChevronDown
                className={`ml-2 transition-transform ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-0 top-full mt-2 z-10 w-44 bg-white border border-gray-200 rounded-md shadow-md p-3"
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filtrează după stare
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Toate</option>
                  <option value="pending">În așteptare</option>
                  <option value="accepted">Acceptate</option>
                  <option value="rejected">Respinse</option>
                  <option value="fulfilled">Finalizate</option>
                </select>
              </motion.div>
            )}
          </div>
        </div>

        {/* Requests */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRequests.map((request) => (
              <motion.div
                key={request._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col justify-between"
                whileHover={{ y: -2 }}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-base font-semibold text-gray-700 flex items-center gap-1">
                      <FiMapPin className="text-blue-500" />
                      {request.departure} → {request.destination}
                    </h2>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[request.status]}`}
                    >
                      {request.status === "pending" ? "În așteptare" : 
                       request.status === "accepted" ? "Acceptată" :
                       request.status === "rejected" ? "Respinsă" :
                       "Finalizată"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FiClock className="text-gray-400" />
                    {new Date(request.createdAt).toLocaleDateString('ro-RO')}
                  </p>

                  <div className="mt-3 text-md text-gray-600 space-y-2">
                    <p className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      {new Date(request.date).toLocaleDateString('ro-RO')}
                    </p>
                    <p className="flex items-center gap-2">
                      <FiUsers className="text-gray-400" />
                      {request.passengers} Pasager(i)
                    </p>
                    <p className="flex items-center gap-2">
                      <FiTruck className="text-gray-400" />
                      {request.category}
                    </p>
                    {request.notes && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                        <span className="font-medium text-gray-600">Note:</span>{" "}
                        {request.notes}
                      </p>
                    )}
                  </div>
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    {/* <button
                      onClick={() => toast.info("Edit functionality goes here")}
                      className="w-full text-sm py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      <FiEdit2 className="inline mb-1 mr-1" />
                      Edit
                    </button> */}
                    <button
                      onClick={() => openConfirm(request._id)}
                      className="w-full text-sm py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      <FiTrash2 className="inline mb-1 mr-1" />
                      Șterge
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10">
            Nu s-au găsit cereri.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-[#000000a9] bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Sigur doriți să ștergeți această cerere?
              </h2>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                >
                  Anulează
                </button>
                <button
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Confirmă ștergerea
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTransportRequests;