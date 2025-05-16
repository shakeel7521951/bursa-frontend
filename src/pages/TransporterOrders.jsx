import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { useGetAllOrdersQuery } from "../redux/slices/OrderSlices";
import OrderDetailModal from "../components/dashboard/orders/OrderDetailModel";

const TransporterOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  console.log(orders);
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
        order.customerId?.name?.toLowerCase().includes(term)
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
      className="bg-white bg-opacity-50 container mx-auto my-14 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className=" flex justify-between items-center mb-6">
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
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {[
                "Customer",
                "Email",
                "Travel Date",
                "From",
                "To",
                "Seats",
                "Total",
                "Payment",
                "View",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <motion.tr
                key={order._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-4 py-3 text-sm text-black">
                  {order.customerId?.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {order.customerId?.email || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {order.serviceId?.travelDate
                    ? new Date(order.serviceId.travelDate).toLocaleDateString(
                        "en-GB"
                      )
                    : "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {order.serviceId?.destinationFrom || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {order.serviceId?.destinationTo || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {order.seatsBooked || 0}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  ₹{order.totalPrice}
                </td>
                <td className="px-4 py-3 text-sm text-black">
                  {order.isPaid || "N/A"}
                </td>
                <td className="px-4 py-3 text-sm text-blue-700">
                  <Eye
                    className="cursor-pointer"
                    onClick={() => openModal(order)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDetailModel && selectedOrder && (
        <OrderDetailModal
          isOpen={showDetailModel}
          closeModal={closeModal}
          order={selectedOrder}
        />
      )}
    </motion.div>
  );
};

export default TransporterOrders;
