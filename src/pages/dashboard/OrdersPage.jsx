import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import DailyOrders from '../../components/dashboard/orders/DailyOrders';
import OrdersTable from '../../components/dashboard/orders/OrdersTable';
import { useGetAllOrdersQuery } from "../../redux/slices/OrderSlices";

const OrdersPage = () => {
  const { data, isLoading, error } = useGetAllOrdersQuery();
  const orders = data?.orders && Array.isArray(data.orders) ? data.orders : [];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching orders: {error.message}</p>;
  }

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title={"Orders"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Orders"
            icon={ShoppingBag}
            value={orders.length}
            color="#6366F1"
          />
          <StatCard
            name="Pending Orders"
            icon={Clock}
            value={orders.filter((order)=>order.orderStatus === 'Pending').length}
            color="#F59E0B"
          />
          <StatCard
            name="Completed Orders"
            icon={CheckCircle}
            value={orders.filter((order)=>order.orderStatus === "Fulfilled").length}
            color="#10B981"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={orders.reduce((total,order)=>total+(order.price || 0),0)}
            color="#EF4444"
          />
        </motion.div>

        <OrdersTable />
        <div className="grid grid-cols-1 gap-8 mt-8">
          <DailyOrders />
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;