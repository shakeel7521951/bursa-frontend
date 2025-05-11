import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import {
  useAllUsersQuery,
  useUpdateUserRoleMutation,
} from "../../../redux/slices/UserApi";
import { toast } from "react-toastify";

const UsersTable = () => {
  const { data, isLoading, error } = useAllUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [userData, setUserData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error?.message, { position: "top-center" });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setUserData(data);
      setFilteredUsers(data);
    }
  }, [data]);

  useEffect(() => {
    setFilteredUsers(userData);
  }, [userData]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      userData.filter(
        (user) =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    );
  };

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const changeUserRole = async (id, newRole) => {
    try {
      const res = await updateUserRole({ userId: id, role: newRole }).unwrap();
      toast.success(res.message,{position:'top-center'});

      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user role");
    }
    setOpenDropdown(null);
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <motion.div
      className="bg-white shadow-lg rounded-xl p-6 border border-blue-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-700">Users</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-white text-blue-700 placeholder-blue-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-blue-700" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              {["Name", "Email", "Role", "Status", "Actions"].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-300 text-blue-700 font-bold">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={user.name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-700">
                        {user.name}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-black">{user.email}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === "verified"
                        ? "bg-green-800 text-green-100"
                        : "bg-red-800 text-red-100"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 relative">
                  <button
                    onClick={() => toggleDropdown(user._id)}
                    className="flex items-center text-indigo-600 hover:text-indigo-300"
                  >
                    Manage <ChevronDown className="ml-1" size={16} />
                  </button>

                  {openDropdown === user._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-30">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => changeUserRole(user._id, "Admin")}
                      >
                        Make Admin
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => changeUserRole(user._id, "User")}
                      >
                        Make User
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
