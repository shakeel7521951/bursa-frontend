import { motion } from "framer-motion";
import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import { AlertTriangle, Car, DollarSign, TrendingUp } from "lucide-react";
import CategoryDistributionChart from "../../components/dashboard/overview/CategoryDistributionChart";
import SalesTrendChart from "../../components/dashboard/products/SalesTrendChart";
import ProductsTable from "../../components/dashboard/products/ProductsTable";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";

const ProductsPage = () => {
  const { data, isLoading, error } = useGetAllServicesQuery();
  const services = Array.isArray(data?.services) ? data.services : [];

  if (isLoading) {
    return <p className="text-blue-700 text-lg">Loading data...</p>;
  }

  if (error) {
    return <p className="text-red-700 text-lg">Failed to load data.</p>;
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Cars" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Cars"
            icon={Car}
            value={services.length}
            color="#6366F1"
          />
          <StatCard
            name="Top Selling"
            icon={TrendingUp}
            value={services[0]?.sales || 0}
            color="#10B981"
          />
          <StatCard
            name="Low Stock"
            icon={AlertTriangle}
            value={services.filter((car) => car.stock < 5).length}
            color="#F59E0B"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={`$${services
              .reduce((acc, car) => acc + (car.price || 0), 0)
              .toLocaleString()}`}
            color="#EF4444"
          />
        </motion.div>

        <ProductsTable services={services} />

        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;
