import { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import loginImage from "../assets/AUTH/LOGIN.jpg";
import { useLoginMutation } from "../redux/slices/UserApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/slices/UserSlice";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";

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
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.email) tempErrors.email = "Emailul este obligatoriu";
    if (!formData.password) tempErrors.password = "Parola este obligatorie";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const resp = await loginUser(formData);
      if (resp.error) {
        toast.error(resp.error.data?.message || "Autentificare eșuată", {
          position: "top-center",
        });
      } else {
        toast.success(resp.data?.message || "Autentificare reușită", {
          position: "top-center",
        });
        dispatch(setProfile(resp.data?.user));
        navigate("/");
      }
    } catch (error) {
      toast.error("A apărut o eroare neașteptată", { position: "top-center" });
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      toast.info("Autentificarea cu Google va fi disponibilă în curând!", {
        position: "top-center",
      });
    }, 2000);
  };

  if(isLoading){
    return <Loader />
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-r from-black to-gray-900">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden border-t-[6px] border-[#FFCE00]">
        {/* Left Side - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col p-10 justify-center bg-white">
          <h2 className="text-4xl font-extrabold text-black mb-2 text-center tracking-tight">
            Bine ai revenit la Bursa Trans
          </h2>
          <p className="text-gray-600 text-sm text-center mb-8">
            Continuă călătoria ta spre Italia. Nu ai un cont?{" "}
            <Link
              to="/sign-up"
              className="text-[#FFCE00] hover:underline font-semibold"
            >
              Creează cont
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-black text-sm font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCE00]"
                placeholder="Introdu adresa de email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm font-semibold mb-1">
                Parolă
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCE00] pr-10"
                  placeholder="Introdu parola"
                  value={formData.password}
                  onChange={handleChange}
                />
                <span
                  className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Ține-mă minte
              </label>
              <Link
                to="/forgot-password"
                className="text-[#FFCE00] hover:underline font-medium"
              >
                Ai uitat parola?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#FFCE00] text-black font-semibold py-3 rounded-full shadow-md hover:bg-yellow-400 transition duration-300 cursor-pointer ${
                isLoading ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {isLoading ? "Se conectează..." : "Conectează-te la contul tău"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm">SAU</span>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <button
            className="flex items-center justify-center w-full border border-gray-300 p-3 rounded-full font-semibold text-gray-800 hover:bg-gray-100 transition duration-300"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <div className="p-2 bg-red-500 rounded-full">
              <FaGoogle className="text-white" />
            </div>
            <span className="ml-3">
              {googleLoading
                ? "Se conectează cu Google..."
                : "Conectează-te cu Google"}
            </span>
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-black">
          <img
            src={loginImage}
            alt="Autentificare Bursa Trans"
            className="w-[90%] h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
