import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { useGetAllOrdersQuery } from "../../../redux/slices/OrderSlices";
import OrderDetailModal from "./OrderDetailModel";

const OrdersTable = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showDetailModel, setShowDetailModel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = orders.filter((order) => {
      const idMatch = order._id?.toLowerCase().includes(term);
      const nameMatch = order.customerId?.name?.toLowerCase().includes(term);
      return idMatch || nameMatch;
    });

    setFilteredOrders(filtered);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModel(true);
  };

  const closeModal = () => {
    setShowDetailModel(false);
    setSelectedOrder(null);
  };

  if (isLoading) {
    return <div className="text-blue-700">Loading orders...</div>;
  }

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header with Search */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-700">Order List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            className="bg-white text-blue-700 placeholder-blue-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-blue-700" size={18} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {[
                "Customer",
                "Email",
                "Service",
                "Seats",
                "Price/Seat",
                "Total",
                "From",
                "To",
                "Date",
                "Status",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-2 text-left text-xs font-semibold text-blue-700"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-4 py-3 text-sm">{order.customerId?.name || "Guest"}</td>
                <td className="px-4 py-3 text-sm">{order.customerId?.email || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{order.serviceName || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{order.seatsBooked || 0}</td>
                <td className="px-4 py-3 text-sm">Rs {order.pricePerSeat || 0}</td>
                <td className="px-4 py-3 text-sm font-semibold">Rs {order.totalPrice || 0}</td>
                <td className="px-4 py-3 text-sm">{order.destinationFrom || "N/A"}</td>
                <td className="px-4 py-3 text-sm">{order.destinationTo || "N/A"}</td>
                <td className="px-4 py-3 text-sm">
                  {new Date(order.travelDate || order.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.orderStatus === "Fulfilled"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => openModal(order)}
                    className="text-indigo-500 hover:text-indigo-700"
                    title="View Order Details"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showDetailModel && selectedOrder && (
        <OrderDetailModal order={selectedOrder} closeModal={closeModal} />
      )}
    </motion.div>
  );
};

export default OrdersTable;
