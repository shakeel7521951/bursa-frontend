import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUserProfile, clearProfile } from "../redux/slices/UserSlice";
import { useLogoutMutation } from "../redux/slices/UserApi";
import { toast } from "react-toastify";
import logo from "../assets/companyLogo.png";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import Button from "./Button";

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userProfile = useSelector(selectUserProfile);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.preventDefault();
    const response = await logout();
    if (response.error) {
      toast.error(response.error.data?.message || "Deconectare eșuată!", {
        position: "top-center",
      });
    } else {
      toast.success(response.data?.message || "Deconectare reușită!", {
        position: "top-center",
      });
    }
    dispatch(clearProfile());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-black px-4 sticky top-0 z-[999] ">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div>
          <Link to="/">
            <img
              src={logo}
              alt="Company Logo"
              className="h-6 sm:h-8 md:h-10 lg:h-10 max-w-full object-contain"
            />
          </Link>
        </div>

        {/* Menu links */}
        <div className="hidden md:flex justify-center flex-1 text-white gap-5">
          <Link
            to="/"
            className="relative text-white hover:after:w-full rounded-full"
          >
            Acasă
          </Link>
          <Link
            to="/services"
            className="relative text-white hover:after:w-full rounded-full"
          >
            Servicii
          </Link>
          <Link
            to="/blogs"
            className="relative text-white hover:after:w-full rounded-full"
          >
            Bloguri
          </Link>
          <Link
            to="/about-us"
            className="relative text-white hover:after:w-full rounded-full"
          >
            Despre noi
          </Link>
          <Link
            to="/contact-us"
            className="relative text-white hover:after:w-full rounded-full"
          >
            Contact
          </Link>
        </div>

        {/* Buttons + profile */}
        <div className="hidden md:flex items-center gap-4">
          {userProfile &&(
          userProfile.role == "User" ? (
            <Link to="/transport-request-form">
              <Button text={"Solicita transport"} />
            </Link>
          ) : (
              <Link to="/all-transport-requests">
              <Button text={"Cereri de transport"} />
            </Link>
          ))}

          {userProfile ? (
            <div className="relative">
              <div
                className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full cursor-pointer overflow-hidden border-2 border-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userProfile.profilePic ? (
                  <img
                    src={userProfile.profilePic}
                    alt="Avatar utilizator"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-lg">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-30">
                  <ul className="py-2 text-gray-700">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/my-profile");
                        setDropdownOpen(false);
                      }}
                    >
                      Profilul Meu
                    </li>
                    {userProfile.role === "Admin" && (
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate("/dashboard");
                          setDropdownOpen(false);
                        }}
                      >
                        Admin
                      </li>
                    )}
                    {userProfile.role === "Transporter" && (
                      <>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/transporter-dashboard");
                            setDropdownOpen(false);
                          }}
                        >
                          Servicii
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/transporter-orders");
                            setDropdownOpen(false);
                          }}
                        >
                          Comenzi
                        </li>
                      </>
                    )}
                    {userProfile.role === "User" && (
                      <>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/my-orders");
                            setDropdownOpen(false);
                          }}
                        >
                          Comenzile Mele
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/my-transport-requests");
                            setDropdownOpen(false);
                          }}
                        >
                          My Requests
                        </li>
                      </>
                    )}
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Deconectare
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button text="Autentificare" />
            </Link>
          )}
        </div>

        {/* Mobile view */}
        <div className="md:hidden flex items-center gap-4">
          {userProfile && (
            <div className="relative">
              <div
                className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full cursor-pointer overflow-hidden border-2 border-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userProfile.profilePic ? (
                  <img
                    src={userProfile.profilePic}
                    alt="Avatar utilizator"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-lg">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-30">
                  <ul className="py-2 text-gray-700">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        navigate("/my-profile");
                        setDropdownOpen(false);
                      }}
                    >
                      Profilul Meu
                    </li>
                    {userProfile.role === "Admin" && (
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate("/dashboard");
                          setDropdownOpen(false);
                        }}
                      >
                        Admin
                      </li>
                    )}
                    {userProfile.role === "Transporter" && (
                      <>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/transporter-dashboard");
                            setDropdownOpen(false);
                          }}
                        >
                          Servicii
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/transporter-orders");
                            setDropdownOpen(false);
                          }}
                        >
                          Comenzi
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/transporter-accepted-requests");
                            setDropdownOpen(false);
                          }}
                        >
                          Accepted Requests
                        </li>
                      </>
                    )}
                    {userProfile.role === "User" && (
                      <>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/my-orders");
                            setDropdownOpen(false);
                          }}
                        >
                          Comenzile Mele
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/my-transport-requests");
                            setDropdownOpen(false);
                          }}
                        >
                          My Transport Requests
                        </li>
                      </>
                    )}
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Deconectare
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          <button className="p-2" onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? (
              <IoMdClose className="text-white text-4xl" />
            ) : (
              <IoMdMenu className="text-white text-4xl" />
            )}
          </button>
        </div>

        {showSidebar && (
          <div
            className="fixed inset-0 bg-[#000000ab] bg-opacity-50 z-40"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}

        <div
          className={`fixed z-50 top-0 right-0 w-[70%] h-[100vh] bg-white text-black p-8 shadow-lg transition-transform duration-300 ${
            showSidebar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-6 right-6 cursor-pointer text-black text-2xl hover:text-gray-600 transition"
            onClick={() => setShowSidebar(false)}
          >
            ✖
          </button>

          <ul className="flex flex-col gap-8 mt-20">
            <Link
              to="/"
              className="font-bold text-2xl hover:text-[#FFEE02]"
              onClick={() => setShowSidebar(false)}
            >
              Acasă
            </Link>
            <Link
              to="/services"
              className="font-bold text-2xl hover:text-[#FFEE02]"
              onClick={() => setShowSidebar(false)}
            >
              Servicii
            </Link>
            <Link
              to="/about-us"
              className="font-bold text-2xl hover:text-[#FFEE02]"
              onClick={() => setShowSidebar(false)}
            >
              Despre noi
            </Link>
            <Link
              to="/contact-us"
              className="font-bold text-2xl hover:text-[#FFEE02]"
              onClick={() => setShowSidebar(false)}
            >
              Contact
            </Link>
          </ul>

          {!userProfile && (
            <div className="mt-12 flex flex-col gap-6">
              <Link to="/login">
                <Button
                  text="Autentificare"
                  bgHover="black"
                  textHover="white"
                />
              </Link>
              <Link to="/sign-up">
                <Button text="Înregistrare" bgHover="black" textHover="white" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
