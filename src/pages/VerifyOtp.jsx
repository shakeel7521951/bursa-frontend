import { useState } from "react";

export default function EmailOTPForm() {
  const [email, setEmail] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpComplete, setIsOtpComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailSubmit = () => {
    if (email && isChecked) {
      setShowOTP(true);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (newOtp.every((digit) => digit !== "")) {
      setIsOtpComplete(true);
    } else {
      setIsOtpComplete(false);
    }
  };

  const handleOtpSubmit = () => {
    setSuccessMessage("OTP Verified Successfully!");
    setTimeout(() => {
      setSuccessMessage("");
      setEmail("");
      setIsChecked(false);
      setShowOTP(false);
      setOtp(["", "", "", ""]);
      setIsOtpComplete(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      {successMessage && (
        <div className="bg-blue-700 text-white p-4 mb-4 rounded-md shadow-lg text-center text-lg">
          {successMessage}
        </div>
      )}
      {!showOTP ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold mb-6">Enter Your Email</h2>
          <input
            type="email"
            className="border p-3 w-full rounded-md mb-3 text-lg"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <label className="text-md cursor-pointer">Confirm Email</label>
          </div>
          <button
            onClick={handleEmailSubmit}
            className="bg-blue-700 text-white cursor-pointer px-5 py-3 rounded-md w-full text-lg disabled:opacity-50"
            disabled={!email || !isChecked}
          >
            Submit
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
          <h2 className="text-xl font-semibold mb-6">Enter OTP</h2>
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="border w-14 h-14 text-center text-xl rounded-md"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
              />
            ))}
          </div>
          {isOtpComplete && (
            <button
              onClick={handleOtpSubmit}
              className="bg-blue-700 cursor-pointer text-white px-5 py-3 mt-6 rounded-md w-full text-lg"
            >
              Verify OTP
            </button>
          )}
        </div>
      )}
    </div>
  );
}