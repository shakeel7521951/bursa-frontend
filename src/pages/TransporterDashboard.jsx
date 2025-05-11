import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import AddNewService from "../components/transporterDashboard/AddNewService";
import { useDeleteServiceMutation, useGetIndividualServicesQuery } from "../redux/slices/ServiceApi";
import UpdateService from "../components/dashboard/products/UpdateProduct";
import AlertDialog from "../components/dashboard/alert/AlertDialog";
// import AlertDialog from "../alert/AlertDialog";
// import { toast } from "react-toastify";

const TransporterDashboard = () => {
  const { data, isLoading, isError } = useGetIndividualServicesQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isOpenUpdate, setOpenUpdate] = useState(false);
  const [deleteService] = useDeleteServiceMutation();

  // Filter products based on search
  const filteredProducts = (data?.services || []).filter(
    (service) =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-blue-700">Services List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search cars..."
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
          {filteredProducts.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Passengers
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProducts.map((service) => (
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
                        className="size-10 rounded-full"
                      />
                      {service.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.serviceCategory}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      ${service.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-700">
                      {service.passengers}
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
