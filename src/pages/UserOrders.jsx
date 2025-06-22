import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Pencil } from "lucide-react";
import {
  useDeleteOrderMutation,
  useMyOrdersQuery,
} from "../redux/slices/OrderSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../Loader";

const UserOrders = () => {
  const { data, isLoading } = useMyOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [finalFilteredOrders, setFinalFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const navigate = useNavigate();
  const [deleteOrder] = useDeleteOrderMutation();

  useEffect(() => {
    const filtered = orders.filter((order) => order.deletedBy !== "user");
    setFilteredOrders(filtered);
    setFinalFilteredOrders(filtered);
  }, [orders]);

  useEffect(() => {
    setFinalFilteredOrders(
      filteredOrders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm) ||
          order.customerId?.name?.toLowerCase().includes(searchTerm) ||
          order.customerId?.email?.toLowerCase().includes(searchTerm) ||
          order.serviceId?.serviceName?.toLowerCase().includes(searchTerm) ||
          order.serviceCategory?.toLowerCase().includes(searchTerm)
      )
    );
  }, [searchTerm, filteredOrders]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  // const handleEditOrder = (order) => {
  //   if (order.orderStatus === "completed" || order.orderStatus === "rejected") {
  //     alert("You cannot edit a completed or rejected order.");
  //     return;
  //   }
  //   navigate(`/update-order/${order._id}`, {
  //     state: { order },
  //   });
  // };

  // const handleDeleteClick = (order) => {
  //   setSelectedOrder(order);
  //   setIsModalOpen(true);
  // };

  const handleDeleteConfirm = async () => {
    if (selectedOrder) {
      try {
        const response = await deleteOrder({
          orderId: selectedOrder._id,
          status: selectedOrder.orderStatus,
        }).unwrap();
        setIsModalOpen(false);
        setSelectedOrder(null);
        toast.success(response.message || "Comanda a fost ștearsă cu succes", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(error.data?.message || "Ștergerea comenzii a eșuat", {
          position: "top-center",
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getCategorySpecificDetails = (order) => {
    switch(order.serviceCategory) {
      case 'passenger':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.seatsBooked || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.luggageQuantity || 0}
            </td>
          </>
        );
      case 'parcel':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.parcelQuantity || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.parcelWeight ? `${order.parcelWeight}kg` : 'N/A'}
            </td>
          </>
        );
      case 'car_towing':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.vehicleDetails || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.towingRequirements || 'Fără'}
            </td>
          </>
        );
      case 'vehicle_trailer':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.vehicleType || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.trailerRequirements || 'Fără'}
            </td>
          </>
        );
      case 'furniture':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.furnitureItemCount || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.fragileItems ? 'Da' : 'Nu'}
            </td>
          </>
        );
      case 'animal':
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.animalCount || 0}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              {order.cageRequired ? 'Da' : 'Nu'}
            </td>
          </>
        );
      default:
        return (
          <>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              N/A
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
              N/A
            </td>
          </>
        );
    }
  };

  const getTableHeaders = () => {
    return [
      "Nume serviciu",
      "Categorie",
      "Email client",
      ...(searchTerm ? [] : ["Detalii 1", "Detalii 2"]),
      "Preț total",
      "Stare comandă",
      "Data comenzii",
      // "Acțiuni"
    ];
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-5 bg-[#000000a2] z-50">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-[#000] mb-4">
              {selectedOrder?.orderStatus === "pending"
                ? "Anulează comanda"
                : "Șterge comanda"}
            </h2>
            <p className="text-gray-700 mb-6">
              Ești sigur că vrei să{" "}
              {selectedOrder?.orderStatus === "pending"
                ? "anulezi această comandă?"
                : "ștergi această comandă?"}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Anulează
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm cursor-pointer font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Confirmă
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <motion.div
        className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-[#FFEE02] w-[80%] mx-auto my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#000]">Comenzile mele</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Caută comenzi..."
              className="bg-white text-[#000] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFEE02]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-[#000]" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {getTableHeaders().map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-bold text-[#000] uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {finalFilteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={getTableHeaders().length}
                    className="text-center py-4 text-gray-500 text-sm"
                  >
                    Nu s-au găsit comenzi.
                  </td>
                </tr>
              )}

              {finalFilteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {order.serviceId?.serviceName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black capitalize">
                    {order.serviceCategory?.replace('_', ' ') || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {order.customerId?.email || "N/A"}
                  </td>
                  
                  {!searchTerm && getCategorySpecificDetails(order)}
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.orderStatus === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.orderStatus === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.orderStatus === "completed" ? "Finalizată" : 
                       order.orderStatus === "pending" ? "În așteptare" : 
                       order.orderStatus === "confirmed" ? "Confirmată" : 
                       "Respinsă"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000]">
                    {new Date(order.createdAt).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <button
                      onClick={() => handleEditOrder(order)}
                      title="Edit"
                      disabled={
                        order.orderStatus === "completed" ||
                        order.orderStatus === "rejected"
                      }
                      className={`text-indigo-400 cursor-pointer hover:text-indigo-300 mr-2 ${
                        order.orderStatus === "completed" ||
                        order.orderStatus === "rejected"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Pencil size={18} />
                    </button> 
                    {/* <button
                      onClick={() => handleDeleteClick(order)}
                      className="text-red-500 cursor-pointer hover:text-red-300"
                      title={
                        order.orderStatus === "pending"
                          ? "Cancel Order"
                          : "Delete Order"
                      }
                    >
                      <Trash2 size={18} />
                    </button> */}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
};

export default UserOrders;
