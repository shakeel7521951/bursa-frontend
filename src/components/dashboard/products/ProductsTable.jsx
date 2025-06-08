import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDeleteServiceMutation, useGetAllServicesQuery } from "../../../redux/slices/ServiceApi";
import AlertDialog from "../alert/AlertDialog";
import AddProduct from "../popup/Add";
import UpdateService from "./UpdateProduct";

const categoryFeatures = {
  passenger: ["totalSeats", "availableSeats", "pricePerSeat"],
  parcel: ["parcelLoadCapacity", "price"],
  car_towing: ["vehicleType", "price"],
  vehicle_trailer: ["trailerType", "price"],
  furniture: ["furnitureDetails", "price"],
  animal: ["animalType", "price"]
};

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [isOpenUpdate, setOpenUpdate] = useState(false);

  const { data, isLoading, error } = useGetAllServicesQuery();
  const [deleteService] = useDeleteServiceMutation();

  useEffect(() => {
    if (data?.services) {
      setServicesList(data.services);
    }
  }, [data]);

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const response = await deleteService(selectedProduct._id);
      if (response.error) {
        toast.error(response.error.data?.message || "Failed to delete service", { position: "top-center" });
      } else {
        toast.success("Service deleted successfully", { position: "top-center" });
        setServicesList((prev) => prev.filter((s) => s._id !== selectedProduct._id));
      }
    } catch (error) {
      toast.error("An error occurred while deleting", { position: "top-center" });
    }
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdate = (service) => {
    setSelectedProduct(service);
    setOpenUpdate(true);
  };

  const filteredProducts = servicesList.filter(
    (service) =>
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCategorySpecificFeatures = (service) => {
    const features = categoryFeatures[service.serviceCategory] || [];
    
    return features.map((feature) => {
      if (!service[feature]) return null;
      
      let displayValue = service[feature];
      
      // Format specific fields
      if (feature === 'price' || feature === 'pricePerSeat') {
        displayValue = `Rs. ${service[feature]}`;
      }
      
      return (
        <div key={feature} className="text-sm text-gray-600">
          <span className="font-medium capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}:</span> {displayValue}
        </div>
      );
    });
  };

  if (isLoading) return <p className="text-blue-700 text-lg">Loading services...</p>;

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setAddProductOpen(true)}
        className="px-6 py-2 mb-6 bg-blue-700 text-white rounded-md hover:bg-blue-600 transition-all"
      >
        + Add New Service
      </motion.button>

      {error && <p className="text-red-600 text-lg">Failed to fetch data.</p>}

      {!error && (
        <motion.div
          className="bg-white shadow-xl rounded-lg p-6 border border-blue-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-xl font-semibold text-blue-700">Service List</h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search services..."
                className="bg-white text-blue-700 border border-blue-300 rounded-lg pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <Search className="absolute left-3 top-2.5 text-blue-700" size={18} />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredProducts.length > 0 ? (
              <table className="min-w-[1200px] w-full text-sm text-left text-blue-700 border-collapse">
                <thead className="bg-blue-50 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">Name</th>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">Category</th>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">From → To</th>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">Category Specific Features</th>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">Departure</th>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap">Route</th>
                    <th className="px-4 py-3 font-medium uppercase whitespace-nowrap text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((service) => (
                    <motion.tr
                      key={service._id}
                      className="border-b border-blue-100 hover:bg-blue-50 transition-all"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="px-4 py-3 flex items-center gap-4">
                        <img
                          src={service.servicePic || "https://via.placeholder.com/50"}
                          alt={service.serviceName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">{service.serviceName}</span>
                      </td>
                      <td className="px-10 py-3 whitespace-nowrap capitalize">
                        {service.serviceCategory.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{service.destinationFrom} → {service.destinationTo}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {renderCategorySpecificFeatures(service)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(service.travelDate).toLocaleDateString()} at {service.departureTime}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {service.routeCities?.join(" → ")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {/* <button
                          className="text-indigo-500 hover:text-indigo-600 mr-2"
                          onClick={() => handleUpdate(service)}
                        >
                          <Edit size={18} />
                        </button> */}
                        <button
                          className="text-red-500 hover:text-red-600"
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
              <p className="text-center text-gray-500 py-6">No services found.</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Modals */}
      {/* <UpdateService isOpen={isOpenUpdate} onClose={() => setOpenUpdate(false)} serviceData={selectedProduct} /> */}
      <AddProduct isOpen={addProductOpen} onClose={() => setAddProductOpen(false)} />
      <AlertDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onConfirm={handleDelete} />
    </>
  );
};

export default ProductsTable;