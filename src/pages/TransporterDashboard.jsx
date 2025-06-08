import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import AddNewService from "../components/transporterDashboard/AddNewService";
import {
  useDeleteServiceMutation,
  useGetIndividualServicesQuery,
} from "../redux/slices/ServiceApi";
import UpdateService from "../components/dashboard/products/UpdateProduct";
import AlertDialog from "../components/dashboard/alert/AlertDialog";
import Loader from "../Loader";

const TransporterDashboard = () => {
  const { data, isLoading, isError } = useGetIndividualServicesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isOpenUpdate, setOpenUpdate] = useState(false);
  const [deleteService] = useDeleteServiceMutation();

  const filteredServices = (data?.services || []).filter(
    ({ serviceName, serviceCategory, destinationFrom, destinationTo }) =>
      [serviceName, serviceCategory, destinationFrom, destinationTo].some(
        (field) =>
          field && field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDelete = async () => {
    try {
      if (selectedProduct?._id) {
        await deleteService(selectedProduct._id).unwrap();
      }
      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to delete service:", err);
    }
  };

  const handleUpdate = (service) => {
    setSelectedProduct(service);
    setOpenUpdate(true);
  };

  // Function to render category-specific details
  const renderCategoryDetails = (service) => {
    switch(service.serviceCategory) {
      case 'passenger':
        return (
          <div className="space-y-1">
            <p>Seats: <span className="text-gray-500">{service.availableSeats}/{service.totalSeats}</span></p>
            <p>Price per seat: <span className="text-gray-500">${service.price}</span></p>
          </div>
        );
      case 'parcel':
        return (
          <div className="space-y-1">
            <p>Capacity: <span className="text-gray-500">{service.parcelLoadCapacity} kg</span></p>
            <p>Price: <span className="text-gray-500">${service.price}</span></p>
          </div>
        );
      case 'car_towing':
        return (
          <div className="space-y-1">
            <p>Vehicle Type: <span className="text-gray-500">{service.vehicleType || 'N/A'}</span></p>
            <p>Price: <span className="text-gray-500">${service.price}</span></p>
          </div>
        );
      case 'vehicle_trailer':
        return (
          <div className="space-y-1">
            <p>Trailer Type: <span className="text-gray-500">{service.trailerType || 'N/A'}</span></p>
            <p>Price: <span className="text-gray-500">${service.price}</span></p>
          </div>
        );
      case 'furniture':
        return (
          <div className="space-y-1">
            <p>Details: <span className="text-gray-500">{service.furnitureDetails || 'N/A'}</span></p>
            <p>Price: <span className="text-gray-500">${service.price}</span></p>
          </div>
        );
      case 'animal':
        return (
          <div className="space-y-1">
            <p>Animal Type: <span className="text-gray-500">{service.animalType || 'N/A'}</span></p>
            <p>Price: <span className="text-gray-500">${service.price}</span></p>
          </div>
        );
      default:
        return <p>Price: ${service.price}</p>;
    }
  };

  // Function to format availability days
  const formatAvailabilityDays = (days) => {
    if (!days) return 'N/A';
    return days.join(', ');
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Access denied: not a Transporter</div>;
  }

  return (
    <div className="container mx-auto px-5 md:px-0 py-10">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setAddProductOpen(true)}
        className="px-4 py-2 mb-10 bg-blue-700 text-white rounded-lg hover:bg-blue-500 transition"
      >
        + Add New Service
      </motion.button>

      <motion.div
        className="bg-white shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">Services List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              className="bg-white text-blue-700 placeholder-blue-700 rounded-lg pl-10 pr-4 border py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-blue-700" size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredServices.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Availability</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredServices.map((service) => (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={service.servicePic || "https://via.placeholder.com/50"}
                        alt={service.serviceName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      <p className="font-medium">{service.serviceName}</p>
                      <p className="text-gray-500 text-xs">
                        {service.pickupOption === 'yes' ? 'With pickup' : 'No pickup'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700 capitalize">
                      {service.serviceCategory.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      <p>{service.destinationFrom} → {service.destinationTo}</p>
                      <p className="text-xs text-gray-500">
                        Via: {service.routeCities?.join(', ') || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      <p>{new Date(service.travelDate).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">
                        Depart: {service.departureTime}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-blue-700">
                      {renderCategoryDetails(service)}
                    </td>
                    <td className="px-6 py-4 text-sm text-nowrap text-blue-700">
                      <p>Romania: <span className="text-gray-500">{formatAvailabilityDays(service.availabilityDays?.romania)}</span></p>
                      <p>Italy: <span className="text-gray-500">{formatAvailabilityDays(service.availabilityDays?.italy)}</span></p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-500 hover:text-indigo-300"
                          onClick={() => handleUpdate(service)}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-300"
                          onClick={() => {
                            setSelectedProduct(service);
                            setDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500 py-4">No services found.</p>
          )}
        </div>
      </motion.div>

      <UpdateService
        isOpen={isOpenUpdate}
        onClose={() => setOpenUpdate(false)}
        serviceData={selectedProduct}
      />
      <AddNewService
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />
      <AlertDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TransporterDashboard;