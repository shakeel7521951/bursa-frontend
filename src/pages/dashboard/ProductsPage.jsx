import { motion } from "framer-motion";
import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import { Car, DollarSign, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../components/dashboard/overview/CategoryDistributionChart";
import ProductsTable from "../../components/dashboard/products/ProductsTable";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
import Loader from "../../Loader";

const ProductsPage = () => {
  const { data, isLoading, error } = useGetAllServicesQuery();
  const services = Array.isArray(data?.services) ? data.services : [];
  console.log(services);
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-700 text-lg">Eroare la încărcarea datelor.</p>;
  }

  const uniqueCategories = [...new Set(services.map(s => s.serviceCategory))];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Mașini" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Servicii"
            icon={Car}
            value={services.length}
            color="#6366F1"
          />
          <StatCard
            name="Cele Mai Vândute"
            icon={TrendingUp}
            value={services[0]?.sales || 0}
            color="#10B981"
          />
          <StatCard
            name="Categorii Unice"
            icon={DollarSign}
            value={uniqueCategories?.length}
            color="#EF4444"
          />
        </motion.div>

        <ProductsTable services={services} />

        <div className="grid grid-col-1 lg:grid-cols-1 gap-8">
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
