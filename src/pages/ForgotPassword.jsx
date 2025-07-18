import React, { useState, useRef } from "react";
import {
  useForgotpasswordotpMutation,
  useVerifyOTPMutation,
} from "../redux/slices/UserApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpInputRefs = useRef([]);
  const [forgotpasswordotp, { isLoading, error }] =
    useForgotpasswordotpMutation();
  const [verifyOTP, { isLoading: verifyOtpLoading }] = useVerifyOTPMutation();

  const handleSendOtp = async () => {
    try {
      const response = await forgotpasswordotp(email).unwrap();
      toast.success(response.message, { position: "top-center" });
      if (response.message === "OTP sent successfully!") {
        setOtpSent(true);
      }
    } catch (err) {
      toast.error(err.data?.message || "Trimiterea OTP-ului a eșuat.", {
        position: "top-center",
      });
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 4) {
      toast.error("Te rugăm să introduci un cod OTP valid de 4 cifre.", {
        position: "top-center",
      });
      return;
    }

    try {
      const response = await verifyOTP({ email, otp: enteredOtp }).unwrap();
      toast.success(response.message, { position: "top-center" });
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.data?.message || "Verificarea OTP-ului a eșuat.", {
        position: "top-center",
      });
    }
  };

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Ceva nu a mers bine. Te rugăm să încerci mai târziu!</div>;
  }

  return (
    <div className="flex justify-center items-center py-24 bg-gray-100">
      <div className="p-8 shadow-2xl rounded-md bg-white w-[30rem]">
        <h1 className="text-2xl font-bold mb-6 text-center">Ai uitat parola</h1>

        {!otpSent ? (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Introdu adresa ta de email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-[#ffee0240] p-2 rounded-lg w-full focus:outline-none focus:border-[#FFEE02]"
            />
            <button
              onClick={handleSendOtp}
              className={`w-full bg-gradient-to-r from-[#FFEE02] to-yellow-500 text-black p-3 rounded-full mt-4 font-semibold hover:from-yellow-400 hover:to-[#FFEE02] transition duration-300 shadow-md cursor-pointer ${
                isLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              Trimite OTP
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center">Introdu OTP-ul trimis pe email</p>
            <div className="flex justify-center space-x-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  className="w-12 h-12 border-2 border-blue-200 text-center rounded-lg focus:outline-none focus:border-blue-500"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={verifyOtpLoading}
              className="bg-blue-500 cursor-pointer text-white p-2 rounded-lg w-full hover:bg-blue-600 focus:outline-none disabled:bg-blue-300"
            >
              {verifyOtpLoading ? "Se verifică..." : "Verifică OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
