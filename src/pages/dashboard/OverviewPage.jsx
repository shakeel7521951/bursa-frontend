import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from '../../components/dashboard/common/Header';
import StatCard from '../../components/dashboard/common/StatCard';
import CategoryDistributionChart from "../../components/dashboard/overview/CategoryDistributionChart";
import { useAllUsersQuery } from "../../redux/slices/UserApi";
import { useGetAllServicesQuery } from "../../redux/slices/ServiceApi";
import { useGetAllOrdersQuery } from "../../redux/slices/OrderSlices";

const OverviewPage = () => {
  const { data: userData, isLoading: isUsersLoading } = useAllUsersQuery();
  const { data: serviceData, isLoading: isServicesLoading } = useGetAllServicesQuery();
  const { data: ordersData, isLoading: isOrdersLoading } = useGetAllOrdersQuery();

  const users = Array.isArray(userData) ? userData : [];
  const services = Array.isArray(serviceData?.services) ? serviceData.services : [];
  const orders = Array.isArray(ordersData?.orders) ? ordersData.orders : [];

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Prezentare generală" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATISTICI */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Utilizatori totali"
            icon={Users}
            value={isUsersLoading ? "Se încarcă..." : users.length}
            color="#8B5CF6"
          />
          <StatCard
            name="Servicii totale"
            icon={ShoppingBag}
            value={isServicesLoading ? "Se încarcă..." : services.length}
            color="#EC4899"
          />
          <StatCard
            name="Comenzi totale"
            icon={BarChart2}
            value={orders.length}
            color="#10B981"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
