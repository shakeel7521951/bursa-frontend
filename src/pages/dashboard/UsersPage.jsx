import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import UsersTable from "../../components/dashboard/users/UsersTable";
import { useAllUsersQuery } from "../../redux/slices/UserApi";

const UsersPage = () => {
  const { data, isLoading, error } = useAllUsersQuery();

  const totalUsers = data ? data.length : 0;
  const activeUsers = data ? data.filter(user => user.status === "verified").length : 0;
  const today = new Date().toISOString().split("T")[0];
  const newUsersToday = data
    ? data.filter(user => user.createdAt.startsWith(today)).length
    : 0;

  const churnRate = totalUsers > 0
    ? (((totalUsers - activeUsers) / totalUsers) * 100).toFixed(1) + "%"
    : "0%";

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Users" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Users"
            icon={UsersIcon}
            value={isLoading ? "Loading..." : totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="New Users Today"
            icon={UserPlus}
            value={isLoading ? "Loading..." : newUsersToday}
            color="#10B981"
          />
          <StatCard
            name="Active Users"
            icon={UserCheck}
            value={isLoading ? "Loading..." : activeUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Churn Rate"
            icon={UserX}
            value={isLoading ? "Loading..." : churnRate}
            color="#EF4444"
          />
        </motion.div>

        {error && <p className="text-red-500">Failed to load users.</p>}

        {!isLoading && !error && <UsersTable />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8"></div>
      </main>
    </div>
  );
};

export default UsersPage;
