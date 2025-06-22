import React, { useEffect, useState } from "react";
import {
  FiTruck,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiClock,
  FiInfo,
  FiSearch,
  FiFilter,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  useGetAcceptedTransporterRequestsQuery,
  useUpdateRequestStatusMutation,
} from "../redux/slices/RequestBooking";
import Loader from "../Loader";

const TransporterAcceptedRequests = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetAcceptedTransporterRequestsQuery();
  const [updateRequestStatus] = useUpdateRequestStatusMutation();
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message || "Eroare la încărcarea cererilor acceptate");
    }
  }, [isError, error]);

  const handleConfirm = async () => {
    try {
      await updateRequestStatus(selectedRequestId).unwrap();
      toast.success("Cererea a fost marcată ca finalizată");
      setShowModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Eroare la actualizarea cererii");
    }
  };

  const filteredData = data?.data
    ?.filter((req) =>
      statusFilter === "all" ? true : req.status === statusFilter
    )
    ?.filter((req) => {
      const searchText = search.toLowerCase();
      return (
        req.departure.toLowerCase().includes(searchText) ||
        req.destination.toLowerCase().includes(searchText) ||
        req.category.toLowerCase().includes(searchText) ||
        req.status.toLowerCase().includes(searchText) ||
        new Date(req.date).toLocaleDateString().includes(searchText)
      );
    });

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-black">
            Cereri de Transport Acceptate
          </h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Gestionează cererile de transport acceptate și actualizează starea acestora
          </p>
        </motion.div>

        {/* Căutare și Filtru */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full md:w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Caută cereri..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFCA09] focus:border-[#FFCA09] sm:text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-[#FFCA09] focus:border-[#FFCA09] sm:text-sm"
              >
                <option value="all">Toate statusurile</option>
                <option value="accepted">Acceptate</option>
                <option value="fulfilled">Finalizate</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {filteredData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((request, idx) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center text-lg font-semibold text-black">
                        <FiMapPin className="text-[#FFCA09] mr-2" />
                        <span>
                          {request.departure} → {request.destination}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <FiClock className="mr-1" />
                        {new Date(request.createdAt).toLocaleString()}
                      </div>
                    </div>
                    {request.status === "fulfilled" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Finalizat
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFCA09] text-black">
                        Activ
                      </span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
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
                  </div>

                  {request.notes && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-start">
                        <FiInfo className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-600">{request.notes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {request.status === "accepted" && (
                  <div className="bg-gray-50 px-5 py-3 flex justify-end">
                    <button
                      onClick={() => {
                        setSelectedRequestId(request._id);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCA09]"
                    >
                      Marchează ca Finalizat
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-lg border border-gray-200 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
              <FiTruck className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-3 text-lg font-medium text-black">
              Nicio cerere găsită
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {search || statusFilter !== "all"
                ? "Nicio cerere nu corespunde criteriilor de căutare."
                : "Momentan nu ai nicio cerere de transport acceptată."}
            </p>
          </motion.div>
        )}
      </div>

      {/* Confirmare modală */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-sm w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-[#FFCA09] mb-4">
                <FiCheckCircle className="h-6 w-6 text-black" />
              </div>
              <h3 className="text-lg font-medium text-center text-black mb-2">
                Confirmare Finalizare
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Ești sigur că dorești să marchezi această cerere ca finalizată?
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCA09]"
                  onClick={() => setShowModal(false)}
                >
                  Anulează
                </button>
                <button
                  type="button"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFCA09]"
                  onClick={handleConfirm}
                >
                  Confirmă
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TransporterAcceptedRequests;
