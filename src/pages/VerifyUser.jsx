import React, { useState, useRef } from "react";
import { useVerifyUserMutation } from "../redux/slices/UserApi";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/slices/UserSlice";

const VerifyUser = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifyUser, { isLoading }] = useVerifyUserMutation();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const dispatch = useDispatch();

  const location = useLocation();
  const user = location?.state?.user || {};
  const email = user.email; 

  const handleChange = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length < 4) {
      toast.error("Please enter a valid 4-digit OTP.", { position: "top-center" });
      return;
    }

    try {
      const response = await verifyUser({ otp: otpCode, email });

      if (response.error) {
        toast.error(response.error.data?.message || "Invalid OTP", { position: "top-center" });
      } else {
        toast.success(response.data?.message || "OTP Verified", { position: "top-center" });
        dispatch(setProfile(user));
        navigate("/");
      }
    } catch (error) {
      toast.error("Something went wrong!", { position: "top-center" });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">OTP Verification</h1>
        <p className="text-gray-600 text-center mb-4">
          Enter the OTP sent to <strong>{email || "your email"}</strong>
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-center gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 border rounded text-center text-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            className={`bg-blue-500 text-white py-2 rounded cursor-pointer hover:bg-blue-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyUser;
