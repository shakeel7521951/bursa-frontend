import { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../../redux/slices/OrderSlices";
import { toast } from "react-toastify";

const OrderDetailModal = ({ order, closeModal }) => {
  const [status, setStatus] = useState(order?.orderStatus || "Pending");
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  const { refetch } = useGetAllOrdersQuery();

  const handleStatusChange = async () => {
    try {
      const response = await updateOrderStatus({
        orderId: order._id,
        newStatus: status,
      }).unwrap();

      toast.success(response.message || "Order status updated successfully");
      refetch();
      closeModal();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error?.data?.message || error.message || "Failed to update order status"
      );
    }
  };

  if (!order) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg relative">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Order Details</h2>

        <div className="space-y-2 text-sm text-gray-800">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Customer:</strong> {order.customerId?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {order.customerId?.email || "N/A"}
          </p>
          <p>
            <strong>Total Price:</strong> ₹{order.price?.toFixed(2) || "N/A"}
          </p>
          <p>
            <strong>Pickup Location:</strong> {order.pickupLocation || "N/A"}
          </p>
          <p>
            <strong>Dropoff Location:</strong> {order.dropoffLocation || "N/A"}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-GB")
              : "N/A"}
          </p>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Update Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200"
          >
            <option value="Pending">Pending</option>
            <option value="Fulfilled">Fulfilled</option>
            <option value="Rejected">Rejected</option>
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
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Save"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderDetailModal;
