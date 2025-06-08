import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/slices/OrderSlices";
import { toast } from "react-toastify";

const OrderDetailModal = ({ order, closeModal, isOpen }) => {
  const [status, setStatus] = useState(order?.orderStatus || "pending");
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const { refetch } = useGetAllOrdersQuery();

  if (!order || !isOpen) return null;

  const handleStatusChange = async () => {
    try {
      const response = await updateOrderStatus({
        orderId: order._id,
        newStatus: status,
      }).unwrap();

      toast.success(response?.message || "Order status updated successfully");
      refetch();
      closeModal?.();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error?.data?.message || error.message || "Failed to update order status"
      );
    }
  };

  const renderCategorySpecificDetails = () => {
    switch(order.serviceCategory) {
      case 'passenger':
        return (
          <>
            <p><strong>Seats Booked:</strong> {order.seatsBooked || 0}</p>
            <p><strong>Luggage Quantity:</strong> {order.luggageQuantity || 0}</p>
          </>
        );
      case 'parcel':
        return (
          <>
            <p><strong>Parcel Quantity:</strong> {order.parcelQuantity || 0}</p>
            <p><strong>Total Weight:</strong> {order.parcelWeight ? `${order.parcelWeight}kg` : 'N/A'}</p>
          </>
        );
      case 'car_towing':
        return (
          <>
            <p><strong>Vehicle Details:</strong> {order.vehicleDetails || 'N/A'}</p>
            <p><strong>Towing Requirements:</strong> {order.towingRequirements || 'None'}</p>
          </>
        );
      case 'vehicle_trailer':
        return (
          <>
            <p><strong>Vehicle Type:</strong> {order.vehicleType || 'N/A'}</p>
            <p><strong>Trailer Requirements:</strong> {order.trailerRequirements || 'None'}</p>
          </>
        );
      case 'furniture':
        return (
          <>
            <p><strong>Item Count:</strong> {order.furnitureItemCount || 0}</p>
            <p><strong>Dimensions:</strong> {order.furnitureDimensions || 'N/A'}</p>
            <p><strong>Fragile Items:</strong> {order.fragileItems ? 'Yes' : 'No'}</p>
          </>
        );
      case 'animal':
        return (
          <>
            <p><strong>Animal Count:</strong> {order.animalCount || 0}</p>
            <p><strong>Animal Type:</strong> {order.animalType || 'N/A'}</p>
            <p><strong>Special Needs:</strong> {order.specialNeeds || 'None'}</p>
            <p><strong>Cage Required:</strong> {order.cageRequired ? 'Yes' : 'No'}</p>
          </>
        );
      default:
        return null;
    }
  };

  const getStatusOptions = () => {
    const baseOptions = [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" }
    ];

    // Only show rejected if order is pending
    if (order.orderStatus === "pending") {
      baseOptions.push({ value: "rejected", label: "Rejected" });
    }

    return baseOptions;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      <motion.div 
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-blue-700 mb-4">Order Details</h2>

        <div className="space-y-3 text-sm text-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Order ID:</p>
              <p className="text-gray-600">{order._id}</p>
            </div>
            <div>
              <p className="font-medium">Service Category:</p>
              <p className="text-gray-600 capitalize">
                {order.serviceCategory?.replace('_', ' ') || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Customer:</p>
              <p className="text-gray-600">{order.customerId?.name || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-gray-600">{order.customerId?.email || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Total Price:</p>
              <p className="text-gray-600">₹{order.totalPrice?.toFixed(2) || "0.00"}</p>
            </div>
            <div>
              <p className="font-medium">Payment Status:</p>
              <p className="text-gray-600 capitalize">
                {order.paymentStatus || "unpaid"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">From:</p>
              <p className="text-gray-600">{order.serviceId?.destinationFrom || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">To:</p>
              <p className="text-gray-600">{order.serviceId?.destinationTo || "N/A"}</p>
            </div>
          </div>

          <div>
            <p className="font-medium">Travel Date:</p>
            <p className="text-gray-600">
              {order.serviceId?.travelDate
                ? new Date(order.serviceId.travelDate).toLocaleDateString("en-GB", {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })
                : "N/A"}
            </p>
          </div>

          <div>
            <p className="font-medium">Departure Time:</p>
            <p className="text-gray-600">
              {order.serviceId?.departureTime || "N/A"}
            </p>
          </div>

          {/* Category-specific details */}
          <div className="pt-2 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Service Details:</h3>
            <div className="space-y-2 pl-2">
              {renderCategorySpecificDetails()}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="font-medium">Order Date:</p>
            <p className="text-gray-600">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : "N/A"}
            </p>
          </div>

          {order.notes && (
            <div className="pt-2 border-t border-gray-200">
              <p className="font-medium">Customer Notes:</p>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Update Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            {getStatusOptions().map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleStatusChange}
            className={`px-4 py-2 text-white rounded-lg transition ${
              isLoading || status === order.orderStatus
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading || status === order.orderStatus}
          >
            {isLoading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailModal;