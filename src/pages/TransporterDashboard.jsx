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

const TransporterDashboard = () => {
  const { data, isLoading, isError } = useGetIndividualServicesQuery();
  console.log(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isOpenUpdate, setOpenUpdate] = useState(false);
  const [deleteService] = useDeleteServiceMutation();

  // Filter services based on search
  const filteredServices = (data?.services || []).filter(
    ({ serviceName, serviceCategory, destinationFrom, destinationTo }) =>
      [serviceName, serviceCategory, destinationFrom, destinationTo].some(
        (field) => field.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDelete = async () => {
    try {
      if (selectedProduct?._id) {
        await deleteService(selectedProduct._id).unwrap();
        // toast.success("Service deleted successfully");
      }
      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error("Failed to delete service:", err);
      // toast.error("Failed to delete service");
    }
  };

  const handleUpdate = (service) => {
    setSelectedProduct(service);
    setOpenUpdate(true);
  };

  // UI states
  if (isLoading) {
    return (
      <div className="text-center py-10 text-blue-700">Loading services...</div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to fetch services. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 md:px-0 py-10">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setAddProductOpen(true)}
        className="px-4 py-2 mb-10 bg-blue-700 cursor-pointer text-white rounded-lg hover:bg-blue-500 transition"
      >
        + Add New Service
      </motion.button>

      <motion.div
        className="bg-white backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700 me-auto">
            Services List
          </h2>
          <div className="relative ms-auto">
            <input
              type="text"
              placeholder="Search services..."
              className="bg-white text-blue-700 placeholder-blue-700 rounded-lg pl-10 pr-4 border py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <Search
              className="absolute left-3 top-2.5 text-blue-700"
              size={18}
            />
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-auto">
          {filteredServices.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-nowrap text-xs font-medium text-blue-700 uppercase">
                    Available Seats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-nowrap text-xs font-medium text-blue-700 uppercase">
                    Departure Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredServices.map((service) => (
                  <motion.tr
                    key={service._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-700 flex gap-2 items-center">
                      <img
                        src={
                          service.servicePic || "https://via.placeholder.com/50"
                        }
                        alt={service.serviceName}
                        className="w-10 h-10 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.serviceCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      ${service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.availableSeats} / {service.totalSeats}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.destinationFrom} → {service.destinationTo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.departureTime}{" "}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      <button
                        className="text-indigo-500 cursor-pointer hover:text-indigo-300 mr-2"
                        onClick={() => handleUpdate(service)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="text-red-500 cursor-pointer hover:text-red-300"
                        onClick={() => {
                          setSelectedProduct(service);
                          setDialogOpen(true);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
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
