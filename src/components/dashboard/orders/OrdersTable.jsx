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
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(term) ||
        order.customerId?.name.toLowerCase().includes(term)
    );
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

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Customer Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Pickup Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Dropoff Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide divide-gray-700">
            {filteredOrders.map((order) => (
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                  {order.pickupLocation ? order.pickupLocation : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                  {order.dropoffLocation ? order.dropoffLocation : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                  <button
                    onClick={() => openModal(order)}
                    className="text-indigo-400 cursor-pointer hover:text-indigo-300 mr-2"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetailModel && selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeModal} />
      )}
    </motion.div>
  );
};

export default OrdersTable;
