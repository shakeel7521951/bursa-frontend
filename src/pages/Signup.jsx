import { useState } from "react";
import signup from "../assets/AUTH/signup.jpg";
import { FaGoogle } from "react-icons/fa";
import { useUserRegistrationMutation } from "../redux/slices/UserApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [userRegistration, { isLoading }] = useUserRegistrationMutation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const response = await userRegistration(formData);
    if (response.error) {
      toast.error(response.error.data?.message || "Înregistrarea a eșuat!", {
        position: "top-center",
      });
    } else {
      toast.success(response.data?.message || "Înregistrare reușită!", {
        position: "top-center",
      });
      navigate("/user-verification", { state: { user: formData } });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 bg-gray-50 items-center justify-center">
          <img
            src={signup}
            alt="Ilustrație înregistrare"
            className="w-[80%] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right Side */}
        <form
          className="w-full md:w-1/2 flex flex-col p-8"
          onSubmit={handleRegister}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Creează un Cont
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-md font-medium">
              Nume complet
            </label>
            <input
              type="text"
              name="name"
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introdu numele complet"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-md font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introdu adresa de email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-md font-medium">
              Parolă
            </label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introdu parola"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-md font-medium">
              Selectează rolul
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                -- Selectează rolul --
              </option>
              <option value="User">Utilizator</option>
              <option value="Transporter">Transportator</option>
            </select>
          </div>

          <div className="flex items-center justify-between my-4">
            <div className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                id="remember"
                className="mr-2 cursor-pointer"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label
                htmlFor="remember"
                className="text-gray-600 cursor-pointer text-sm"
              >
                Ține-mă minte
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-[#FFEE02] to-yellow-500 text-black p-3 rounded-full mt-4 font-semibold hover:from-yellow-400 hover:to-[#FFEE02] transition duration-300 shadow-md cursor-pointer ${
              isLoading ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Se încarcă..." : "Creează cont"}
          </button>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-3 text-gray-500">SAU</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Google Sign-up Button */}
          <button
            type="button"
            className="flex items-center justify-center w-full border border-gray-300 p-3 rounded-lg font-medium hover:bg-gray-100 transition duration-300"
          >
            <div className="p-2 bg-red-500 rounded-full flex items-center justify-center">
              <FaGoogle className="text-white" />
            </div>
            <span className="ml-3 text-gray-700 font-medium">
              Înscrie-te cu Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
