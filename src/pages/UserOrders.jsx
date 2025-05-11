import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Trash2, Pencil } from "lucide-react";
import {
  useDeleteOrderMutation,
  useMyOrdersQuery,
} from "../redux/slices/OrderSlices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserOrders = () => {
  const { data, isLoading } = useMyOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  // Filter out orders where deletedBy="user"

  const [searchTerm, setSearchTerm] = useState("");
  const [finalFilteredOrders, setFinalFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([])
  const navigate = useNavigate();
  const [deleteOrder] = useDeleteOrderMutation();

  useEffect(() => {
    setFinalFilteredOrders(filteredOrders);
  }, []);
  useEffect(() => {
      
    const filteredOrders = orders.filter((order) => order.deletedBy !== "user");
    setFilteredOrders(filteredOrders)
    setFinalFilteredOrders(filteredOrders)

  }, [isLoading])
  

  useEffect(() => {
    setFinalFilteredOrders(
      filteredOrders.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm) ||
          order.customerId?.name.toLowerCase().includes(searchTerm)
      )
    );
  }, [searchTerm, filteredOrders]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleEditOrder = (order) => {
    if (order.orderStatus === "Fulfilled" || order.orderStatus === "Rejected") {
      alert("You cannot edit a fulfilled or rejected order.");
      return;
    }

    const formattedOrder = {
      ...order,
      pickupTime: new Date(order.pickupTime).toISOString(),
    };
    navigate(`/update-order/${order._id}`, {
      state: { order: formattedOrder },
    });
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOrder) {
      try {
        const response = await deleteOrder({
          orderId: selectedOrder._id,
          status: selectedOrder.orderStatus,
        }).unwrap();
        handleDeleteCancel();
        toast.success(response.message || "Order deleted successfully", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(error.data?.message || "Failed to delete order", {
          position: "top-center",
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsModalOpen(false); 
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div className="text-[#000]">Loading orders...</div>;
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
              {selectedOrder?.orderStatus === "Pending"
                ? "Cancel Order"
                : "Delete Order"}
            </h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to{" "}
              {selectedOrder?.orderStatus === "Pending"
                ? "cancel this order?"
                : "delete this order?"}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm cursor-pointer font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm cursor-pointer font-medium text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Confirm
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
          <h2 className="text-xl font-semibold text-[#000]">My Orders</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-white text-[#000] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FFEE02]"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search
              className="absolute left-3 top-2.5 text-[#000]"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {[
                  "Car Name",
                  "Customer Email",
                  "Total Cost",
                  "Order Status",
                  "Order Date",
                  "Pickup Time",
                  "Pickup Location",
                  "Dropoff Location",
                  "Actions",
                ].map((header) => (
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
              {finalFilteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {order.customerId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {order.customerId?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    ${order.price ? order.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.orderStatus === "Fulfilled"
                          ? "bg-green-100 text-green-800"
                          : order.orderStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000]">
                    {new Date(order.pickupTime).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000]">
                    {order.pickupLocation ? order.pickupLocation : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#000]">
                    {order.dropoffLocation ? order.dropoffLocation : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEditOrder(order)}
                      title="Edit"
                      disabled={
                        order.orderStatus === "Fulfilled" ||
                        order.orderStatus === "Rejected"
                      }
                      className={`text-indigo-400 cursor-pointer hover:text-indigo-300 mr-2 ${
                        order.orderStatus === "Fulfilled" ||
                        order.orderStatus === "Rejected"
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(order)}
                      className="text-red-500 cursor-pointer hover:text-red-300"
                      title={
                        order.orderStatus === "Pending"
                          ? "Cancel Order"
                          : "Delete Order"
                      }
                    >
                      <Trash2 size={18} />
                    </button>
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