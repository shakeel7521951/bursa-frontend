import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const salesData = {
  "This Week": [
    { month: "Mon", sales: 1000 },
    { month: "Tue", sales: 1500 },
    { month: "Wed", sales: 2000 },
    { month: "Thu", sales: 1800 },
    { month: "Fri", sales: 2200 },
    { month: "Sat", sales: 2500 },
    { month: "Sun", sales: 2300 },
  ],
  "This Month": [
    { month: "Week 1", sales: 4000 },
    { month: "Week 2", sales: 5000 },
    { month: "Week 3", sales: 6000 },
    { month: "Week 4", sales: 7000 },
  ],
  "This Quarter": [
    { month: "Jan", sales: 12000 },
    { month: "Feb", sales: 15000 },
    { month: "Mar", sales: 18000 },
  ],
  "This Year": [
    { month: "Q1", sales: 45000 },
    { month: "Q2", sales: 50000 },
    { month: "Q3", sales: 55000 },
    { month: "Q4", sales: 60000 },
  ],
};

const SalesOverviewChart = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");
  const [filteredData, setFilteredData] = useState(salesData["This Month"]);

  const handleTimeRangeChange = (e) => {
    const selectedRange = e.target.value;
    setSelectedTimeRange(selectedRange);
    setFilteredData(salesData[selectedRange]);
  };

  return (
    <motion.div
      className="bg-white bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-blue-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-blue-700">Sales Overview</h2>

        <select
          className="bg-white-700 text-blue-700 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedTimeRange}
          onChange={handleTimeRangeChange}
        >
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer>
          <AreaChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="month" stroke="" />
            <YAxis stroke="" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesOverviewChart;
