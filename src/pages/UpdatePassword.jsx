import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUpdatePasswordMutation } from "../redux/slices/UserApi";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password must match!");
      return;
    }

    if (!validatePassword(formData.newPassword)) {
      toast.error("Password must be at least 8 characters long, contain an uppercase letter, and a number.");
      return;
    }

    try {
      const response = await updatePassword(formData).unwrap();
      toast.success(response.message || "Password updated successfully!", {
        position: "top-center",
      });
      navigate("/my-profile");
    } catch (error) {
      toast.error(error.data?.message || "Password update failed!", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Update Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password Fields */}
          {["currentPassword", "newPassword", "confirmPassword"].map((field, index) => (
            <div key={index} className="relative">
              <label className="block text-sm font-medium text-gray-600">
                {field === "currentPassword"
                  ? "Current Password"
                  : field === "newPassword"
                  ? "New Password"
                  : "Confirm Password"}
              </label>
              <input
                type={showPassword[field] ? "text" : "password"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <span
                onClick={() => togglePassword(field)}
                className="absolute right-3 top-7 cursor-pointer text-gray-500"
              >
                {showPassword[field] ? "👁️" : "👁️‍🗨️"}
              </span>
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-2 text-white rounded-lg transition duration-300 cursor-pointer ${
              isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
