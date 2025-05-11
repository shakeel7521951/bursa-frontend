import { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../assets/AUTH/LOGIN.jpg";
import { useLoginMutation } from "../redux/slices/UserApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/slices/UserSlice";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors when user types
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Email is required";
    if (!formData.password) tempErrors.password = "Password is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resp = await loginUser(formData);
      if (resp.error) {
        toast.error(resp.error.data?.message || "Login failed", {
          position: "top-center",
        });
      } else {
        toast.success(resp.data?.message || "Login successful", {
          position: "top-center",
        });
        dispatch(setProfile(resp.data?.user));
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred", { position: "top-center" });
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      toast.info("Google Sign-in coming soon!", { position: "top-center" });
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
        
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm text-center mb-6">
            Start your journey with us. Don’t have an account?{" "}
            <Link
              to="/sign-up"
              className="text-red-600 hover:underline font-semibold cursor-pointer"
            >
              Sign up
            </Link>
          </p>

          <form method="post" onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700 text-md font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4 relative">
              <label className="block text-gray-700 text-md font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute top-3 right-3 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between my-4">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-600 text-sm">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-red-600 hover:underline font-medium cursor-pointer text-sm"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-[#FFEE02] to-yellow-500 text-black p-3 rounded-full mt-4 font-semibold hover:from-yellow-400 hover:to-[#FFEE02] transition duration-300 shadow-md cursor-pointer ${
                isLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in to your account"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500">OR</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            className="flex items-center cursor-pointer justify-center w-full border border-gray-300 p-3 rounded-lg font-medium hover:bg-gray-100 transition duration-300"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <div className="p-2 bg-red-500 rounded-full flex items-center justify-center">
              <FaGoogle className="text-white" />
            </div>
            <span className="ml-3 text-gray-700 font-medium">
              {googleLoading ? "Signing in with Google..." : "Sign in with Google"}
            </span>
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center">
          <img
            src={loginImage}
            alt="Login Illustration"
            className="w-[80%] object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
