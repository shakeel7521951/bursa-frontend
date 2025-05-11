import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useGetAllOrdersQuery } from "../../../redux/slices/OrderSlices";

// Function to format date as "MM/DD"
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
};

// Function to group orders by date
const getDailyOrdersData = (orders) => {
  const dailyCounts = orders.reduce((acc, order) => {
    const dateKey = formatDate(order.createdAt);
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(dailyCounts).map(([date, count]) => ({ date, orders: count }));
};

const DailyOrders = () => {
  const { data, isLoading } = useGetAllOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  // Dynamically generate daily orders data
  const dailyOrdersData = getDailyOrdersData(orders);

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h2 className="text-xl font-semibold text-blue-700 mb-4">Daily Orders</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={dailyOrdersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="" />
            <YAxis stroke="" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#8B5CF6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default DailyOrders;
