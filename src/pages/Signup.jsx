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
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-l from-black to-gray-900">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden border-t-[6px] border-[#FFCE00]">
        {/* Image Side */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-black">
          <img
            src={signup}
            alt="Form signup illustration"
            className="w-[85%] rounded-lg shadow-md"
          />
        </div>

        {/* Form Side */}
        <form
          onSubmit={handleRegister}
          className="w-full md:w-1/2 p-8 space-y-5"
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Creează un cont
          </h2>

          {/* Input Fields */}
          {[
            { label: "Nume complet", name: "name", type: "text", placeholder: "Introdu numele complet" },
            { label: "Email", name: "email", type: "email", placeholder: "Introdu adresa de email" },
            { label: "Parolă", name: "password", type: "password", placeholder: "Introdu parola" }
          ].map(({ label, name, type, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
                required
              />
            </div>
          ))}

          {/* Role Select */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800"
              required
            >
              <option value="" disabled>-- Selectează rolul --</option>
              <option value="User">Utilizator</option>
              <option value="Transporter">Transportator</option>
            </select>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
              Ține-mă minte
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold transition duration-300 shadow-md ${
              isLoading
                ? "bg-yellow-300 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-yellow-300 to-yellow-500 hover:from-yellow-400 hover:to-yellow-400 text-black"
            }`}
          >
            {isLoading ? "Se încarcă..." : "Creează cont"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-400 text-sm">SAU</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Signup */}
          <button
            type="button"
            className="flex items-center justify-center gap-3 w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300 shadow-sm"
          >
            <div className="p-2 bg-red-500 rounded-full text-white">
              <FaGoogle />
            </div>
            <span className="text-gray-700 font-medium">Înscrie-te cu Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}
