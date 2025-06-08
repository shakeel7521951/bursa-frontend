import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import { useGetAllOrdersQuery } from "../redux/slices/OrderSlices";
import OrderDetailModal from "../components/dashboard/orders/OrderDetailModel";
import Loader from "../Loader";

const TransporterOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showDetailModel, setShowDetailModel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOrders(orders);
    }
  }, [orders, searchTerm]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = orders.filter(
      (order) =>
        order._id.toLowerCase().includes(term) ||
        order.customerId?.name?.toLowerCase().includes(term) ||
        order.customerId?.email?.toLowerCase().includes(term) ||
        order.serviceId?.serviceName?.toLowerCase().includes(term) ||
        order.serviceCategory?.toLowerCase().includes(term)
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

  const getCategorySpecificColumns = (order) => {
    switch(order.serviceCategory) {
      case 'passenger':
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">
              {order.seatsBooked || 0}
            </td>
            <td className="px-4 py-3 text-sm text-black">
              {order.luggageQuantity || 0}
            </td>
          </>
        );
      case 'parcel':
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">
              {order.parcelQuantity || 0}
            </td>
            <td className="px-4 py-3 text-sm text-black">
              {order.parcelWeight ? `${order.parcelWeight}kg` : 'N/A'}
            </td>
          </>
        );
      case 'car_towing':
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">
              {order.vehicleDetails || 'N/A'}
            </td>
            <td className="px-4 py-3 text-sm text-black">
              {order.towingRequirements || 'None'}
            </td>
          </>
        );
      case 'vehicle_trailer':
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">
              {order.vehicleType || 'N/A'}
            </td>
            <td className="px-4 py-3 text-sm text-black">
              {order.trailerRequirements || 'None'}
            </td>
          </>
        );
      case 'furniture':
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">
              {order.furnitureItemCount || 0}
            </td>
            <td className="px-4 py-3 text-sm text-black">
              {order.fragileItems ? 'Yes' : 'No'}
            </td>
          </>
        );
      case 'animal':
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">
              {order.animalCount || 0}
            </td>
            <td className="px-4 py-3 text-sm text-black">
              {order.cageRequired ? 'Yes' : 'No'}
            </td>
          </>
        );
      default:
        return (
          <>
            <td className="px-4 py-3 text-sm text-black">N/A</td>
            <td className="px-4 py-3 text-sm text-black">N/A</td>
          </>
        );
    }
  };

  const getTableHeaders = () => {
    const baseHeaders = [
      "Customer",
      "Email",
      "Service",
      "Category",
      "Travel Date",
      "From",
      "To",
      "Details 1",
      "Details 2",
      "Total",
      "Status",
      "View"
    ];

    if (searchTerm) {
      // Simplified view when searching
      return baseHeaders.filter(header => 
        !['Details 1', 'Details 2'].includes(header)
      );
    }
    return baseHeaders;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <motion.div
      className="bg-white bg-opacity-50 container mx-auto my-14 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
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
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {getTableHeaders().map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={getTableHeaders().length} className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm text-black">
                    {order.customerId?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.customerId?.email || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.serviceId?.serviceName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black capitalize">
                    {order.serviceCategory?.replace('_', ' ') || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.serviceId?.travelDate
                      ? new Date(order.serviceId.travelDate).toLocaleDateString("en-GB")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.serviceId?.destinationFrom || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-black">
                    {order.serviceId?.destinationTo || "N/A"}
                  </td>
                  
                  {!searchTerm && getCategorySpecificColumns(order)}
                  
                  <td className="px-4 py-3 text-sm text-black">
                    ₹{order.totalPrice?.toFixed(2) || "0.00"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.orderStatus === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.orderStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.orderStatus === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-700">
                    <Eye
                      className="cursor-pointer hover:text-blue-500"
                      onClick={() => openModal(order)}
                    />
                  </td>
                </motion.tr>
              ))
            )}
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