// Romanian translated OrderDetailModal
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

      toast.success(response?.message || "Starea comenzii a fost actualizată cu succes");
      refetch();
      closeModal?.();
    } catch (error) {
      console.error("Actualizare eșuată:", error);
      toast.error(
        error?.data?.message || error.message || "Actualizarea stării comenzii a eșuat"
      );
    }
  };

  const renderCategorySpecificDetails = () => {
    switch (order.serviceCategory) {
      case "passenger":
        return (
          <>
            <p><strong>Locuri rezervate:</strong> {order.seatsBooked || 0}</p>
            <p><strong>Număr bagaje:</strong> {order.luggageQuantity || 0}</p>
          </>
        );
      case "parcel":
        return (
          <>
            <p><strong>Număr colete:</strong> {order.parcelQuantity || 0}</p>
            <p><strong>Greutate totală:</strong> {order.parcelWeight ? `${order.parcelWeight}kg` : 'N/A'}</p>
          </>
        );
      case "car_towing":
        return (
          <>
            <p><strong>Detalii vehicul:</strong> {order.vehicleDetails || 'N/A'}</p>
            <p><strong>Cerințe remorcare:</strong> {order.towingRequirements || 'Niciuna'}</p>
          </>
        );
      case "vehicle_trailer":
        return (
          <>
            <p><strong>Tip vehicul:</strong> {order.vehicleType || 'N/A'}</p>
            <p><strong>Cerințe remorcă:</strong> {order.trailerRequirements || 'Niciuna'}</p>
          </>
        );
      case "furniture":
        return (
          <>
            <p><strong>Număr obiecte:</strong> {order.furnitureItemCount || 0}</p>
            <p><strong>Dimensiuni:</strong> {order.furnitureDimensions || 'N/A'}</p>
            <p><strong>Obiecte fragile:</strong> {order.fragileItems ? 'Da' : 'Nu'}</p>
          </>
        );
      case "animal":
        return (
          <>
            <p><strong>Număr animale:</strong> {order.animalCount || 0}</p>
            <p><strong>Tip animal:</strong> {order.animalType || 'N/A'}</p>
            <p><strong>Nevoi speciale:</strong> {order.specialNeeds || 'Niciuna'}</p>
            <p><strong>Cușcă necesară:</strong> {order.cageRequired ? 'Da' : 'Nu'}</p>
          </>
        );
      default:
        return null;
    }
  };

  const getStatusOptions = () => {
    const baseOptions = [
      { value: "pending", label: "În așteptare" },
      { value: "confirmed", label: "Confirmată" },
      { value: "completed", label: "Finalizată" },
      { value: "cancelled", label: "Anulată" }
    ];

    if (order.orderStatus === "pending") {
      baseOptions.push({ value: "rejected", label: "Respinsă" });
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
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Închide"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-blue-700 mb-4">Detalii Comandă</h2>

        <div className="space-y-3 text-sm text-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">ID Comandă:</p>
              <p className="text-gray-600">{order._id}</p>
            </div>
            <div>
              <p className="font-medium">Categorie Serviciu:</p>
              <p className="text-gray-600 capitalize">
                {order.serviceCategory?.replace("_", " ") || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Client:</p>
              <p className="text-gray-600">{order.customerId?.name || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p className="text-gray-600">{order.customerId?.email || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Preț Total:</p>
              <p className="text-gray-600">₹{order.totalPrice?.toFixed(2) || "0.00"}</p>
            </div>
            <div>
              <p className="font-medium">Stare Plată:</p>
              <p className="text-gray-600 capitalize">
                {order.paymentStatus || "neplătit"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium">De la:</p>
              <p className="text-gray-600">{order.serviceId?.destinationFrom || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Până la:</p>
              <p className="text-gray-600">{order.serviceId?.destinationTo || "N/A"}</p>
            </div>
          </div>

          <div>
            <p className="font-medium">Data Călătoriei:</p>
            <p className="text-gray-600">
              {order.serviceId?.travelDate
                ? new Date(order.serviceId.travelDate).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>

          <div>
            <p className="font-medium">Ora Plecării:</p>
            <p className="text-gray-600">
              {order.serviceId?.departureTime || "N/A"}
            </p>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Detalii Serviciu:</h3>
            <div className="space-y-2 pl-2">{renderCategorySpecificDetails()}</div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <p className="font-medium">Data Comenzii:</p>
            <p className="text-gray-600">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </p>
          </div>

          {order.notes && (
            <div className="pt-2 border-t border-gray-200">
              <p className="font-medium">Notițe Client:</p>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actualizează Starea:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
            {getStatusOptions().map((option) => (
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
            Anulează
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
            {isLoading ? "Se actualizează..." : "Actualizează Starea"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailModal;
