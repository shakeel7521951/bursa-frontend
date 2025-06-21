import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye, AlertCircle } from "lucide-react";
import { useGetAllOrdersQuery } from "../../../redux/slices/OrderSlices";
import OrderDetailModal from "./OrderDetailModel";

// Define category-specific fields to display
const categoryFields = {
  passenger: {
    primary: "seatsBooked",
    secondary: "luggageQuantity",
    label: "Passengers"
  },
  parcel: {
    primary: "parcelQuantity",
    secondary: "parcelWeight",
    label: "Parcels",
    unit: "kg"
  },
  car_towing: {
    primary: "vehicleDetails",
    secondary: "towingRequirements",
    label: "Vehicle"
  },
  vehicle_trailer: {
    primary: "vehicleType",
    secondary: "trailerRequirements",
    label: "Trailer"
  },
  furniture: {
    primary: "furnitureItemCount",
    secondary: "fragileItems",
    label: "Items",
    fragileLabel: "Fragile"
  },
  animal: {
    primary: "animalCount",
    secondary: "animalType",
    label: "Animals"
  }
};

const OrdersTable = () => {
  const { data, isLoading, error: queryError } = useGetAllOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];
console.log(orders)
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showDetailModel, setShowDetailModel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    try {
      setFilteredOrders(orders);
      setLocalError(null);
    } catch (err) {
      setLocalError("Failed to process orders data");
      console.error("Orders processing error:", err);
    }
  }, [orders]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    try {
      const filtered = orders.filter((order) => {
        const idMatch = order._id?.toLowerCase().includes(term);
        const nameMatch = order.customerId?.name?.toLowerCase().includes(term);
        const categoryMatch = selectedCategory === "all" || 
                            (order.serviceCategory || "").toLowerCase() === selectedCategory;
        return (idMatch || nameMatch) && categoryMatch;
      });
      setFilteredOrders(filtered);
    } catch (err) {
      setLocalError("Search failed");
      console.error("Search error:", err);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    try {
      const filtered = category === "all" 
        ? orders 
        : orders.filter(order => (order.serviceCategory || "").toLowerCase() === category);
      setFilteredOrders(filtered);
    } catch (err) {
      setLocalError("Filtering failed");
      console.error("Filter error:", err);
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setShowDetailModel(true);
  };

  const closeModal = () => {
    setShowDetailModel(false);
    setSelectedOrder(null);
  };

  const formatCategoryName = (category) => {
    if (!category) return "Unknown";
    return String(category).replace(/_/g, ' ');
  };

  const renderCategorySpecificField = (order) => {
    try {
      const category = order.serviceCategory || "passenger";
      const fields = categoryFields[category] || {};
      
      if (!fields.primary) return null;

      const primaryValue = order[fields.primary] || "N/A";
      const secondaryValue = order[fields.secondary];

      return (
        <div className="flex flex-col text-sm">
          <div>
            <span className="font-medium">{fields.label}: </span>
            {primaryValue}
            {fields.unit && ` ${fields.unit}`}
          </div>
          {secondaryValue && (
            <div className="text-xs text-gray-500">
              {fields.fragileLabel && secondaryValue ? fields.fragileLabel : secondaryValue}
            </div>
          )}
        </div>
      );
    } catch (err) {
      console.error("Error rendering order details:", err);
      return <div className="text-sm text-red-500">Error loading details</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-700 animate-pulse">Loading orders...</div>
      </div>
    );
  }

  if (queryError || localError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h3 className="text-lg font-medium text-red-700 mb-2">
          {queryError?.data?.message || localError || "Failed to load orders"}
        </h3>
        <p className="text-red-600 mb-4">
          Please try refreshing the page or contact support if the problem persists.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-blue-700">Order List</h2>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-blue-700">Filter:</label>
            <select
              className="bg-white text-blue-700 rounded-lg px-3 py-2 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {Object.keys(categoryFields).map((category) => (
                <option key={category} value={category}>
                  {formatCategoryName(category)}
                </option>
              ))}
            </select>
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-white text-blue-700 placeholder-blue-700 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-blue-700" size={18} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                {[
                  "Customer",
                  "Category",
                  "Service",
                  "Details",
                  "Total",
                  "From",
                  "To",
                  "Date",
                  "Status",
                  // "Actions",
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
                  key={order._id || Math.random().toString(36).substring(2, 9)}
                  className="hover:bg-blue-50 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium">{order.customerId?.name || "Guest"}</div>
                    <div className="text-xs text-gray-500">{order.customerId?.email || "N/A"}</div>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize">
                    {formatCategoryName(order.serviceCategory)}
                  </td>
                  <td className="px-4 py-3 text-sm">{order?.serviceId?.serviceName || "N/A"}</td>
                  <td className="px-4 py-3 text-sm text-nowrap">
                    {renderCategorySpecificField(order)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-nowrap">Rs {order.totalPrice || 0}</td>
                  <td className="px-4 py-3 text-sm">{order?.serviceId?.destinationFrom || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">{order?.serviceId?.destinationTo || "N/A"}</td>
                  <td className="px-4 py-3 text-sm">
                    {order.travelDate || order.createdAt
                      ? new Date(order.travelDate || order.createdAt).toLocaleDateString("en-IN")
                      : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.orderStatus === "completed"
                          ? "bg-green-200 text-green-800"
                          : order.orderStatus === "cancelled" || order.orderStatus === "rejected"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {order.orderStatus || "unknown"}
                    </span>
                  </td>
                  {/* <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => openModal(order)}
                      className="text-indigo-500 hover:text-indigo-700"
                      title="View Order Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td> */}
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No orders found</div>
            {selectedCategory !== "all" && (
              <button
                onClick={() => handleCategoryFilter("all")}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showDetailModel && selectedOrder && (
        <OrderDetailModal order={selectedOrder} closeModal={closeModal} />
      )}
    </motion.div>
  );
};

export default OrdersTable;