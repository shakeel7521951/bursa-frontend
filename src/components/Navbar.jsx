import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUserProfile, clearProfile } from "../redux/slices/UserSlice";
import { useLogoutMutation } from "../redux/slices/UserApi";
import { toast } from "react-toastify";
// import logo from "../assets/logo-2.png";
import logo from "../assets/logo.png";
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
      toast.error(response.error.data?.message || "Logout failed!", {
        position: "top-center",
      });
    } else {
      toast.success(response.data?.message || "Logout successful!", {
        position: "top-center",
      });
    }
    dispatch(clearProfile());
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <div className="bg-black px-4 sticky top-0 z-[999]">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <div>
          <Link to="/">
            <img src={logo} alt="Company Logo" className="w-24 h-12" />
          </Link>
        </div>

        {/* Menu links in the center (hidden on mobile) */}
        <div className="hidden md:flex justify-center flex-1 text-white gap-5">
          <Link
            to="/"
            className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
          >
            Home
          </Link>
          <Link
            to="/services"
            className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
          >
            Services
          </Link>
          <Link
            to="/blogs"
            className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
          >
            Blogs
          </Link>
          <Link
            to="/about-us"
            className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
          >
            About
          </Link>
          <Link
            to="/contact-us"
            className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
          >
            Contact
          </Link>
        </div>

        {/* Right side: Book a Taxi button and Profile dropdown */}
        <div className="hidden md:flex items-center gap-4">
          {userProfile ? <Button text={"Book a Taxi"} /> : ""}

          {userProfile ? (
            <div className="relative">
              {/* Profile Icon */}
              <div
                className="w-10 h-10 flex items-center justify-center bg-[] text-white font-bold rounded-full cursor-pointer overflow-hidden border-2 border-white hover:opacity-90 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userProfile.profilePic ? (
                  <img
                    src={userProfile.profilePic}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-lg">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dropdown Menu */}
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
                      My Profile
                    </li>
                    {userProfile.role === "Admin" && (
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate("/dashboard");
                          setDropdownOpen(false);
                        }}
                      >
                        Dashboard
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
                          Services
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            navigate("/transporter-orders");
                            setDropdownOpen(false);
                          }}
                        >
                          Orders
                        </li>
                      </>
                    )}
                    {userProfile.role === "User" && (
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          navigate("/my-orders");
                          setDropdownOpen(false);
                        }}
                      >
                        My Orders
                      </li>
                    )}
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button text="Login" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button & Profile Icon */}
        <div className="md:hidden flex items-center gap-4">
          {/* Profile Icon for Mobile */}
          {userProfile && (
            <div className="relative">
              <div
                className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full cursor-pointer overflow-hidden border-2 border-white hover:opacity-90 transition"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userProfile.profilePic ? (
                  <img
                    src={userProfile.profilePic}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-lg">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Dropdown Menu */}
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
                      My Profile
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Menu Icon */}
          <button className="p-2" onClick={() => setShowSidebar(!showSidebar)}>
            {showSidebar ? (
              <IoMdClose className="text-white text-4xl" />
            ) : (
              <IoMdMenu className="text-white text-4xl" />
            )}
          </button>
        </div>

        {/* Mobile Sidebar */}
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
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 cursor-pointer text-black text-2xl hover:text-gray-600 transition"
            onClick={() => setShowSidebar(false)}
          >
            ✖
          </button>

          {/* Navigation Links */}
          <ul className="flex flex-col gap-8 mt-20">
            <Link
              to="/"
              className="font-bold text-2xl hover:text-[#FFEE02] transition-colors"
              onClick={() => setShowSidebar(false)}
            >
              Home
            </Link>
            <Link
              to="/services"
              className="font-bold text-2xl hover:text-[#FFEE02] transition-colors"
              onClick={() => setShowSidebar(false)}
            >
              Services
            </Link>
            <Link
              to="/about-us"
              className="font-bold text-2xl hover:text-[#FFEE02] transition-colors"
              onClick={() => setShowSidebar(false)}
            >
              About
            </Link>
            <Link
              to="/contact-us"
              className="font-bold text-2xl hover:text-[#FFEE02] transition-colors"
              onClick={() => setShowSidebar(false)}
            >
              Contact
            </Link>
          </ul>

          {/* Authentication Buttons */}
          {!userProfile && (
            <div className="mt-12 flex flex-col gap-6">
              <Link to="/login">
                <Button text="Login" bgHover="black" textHover="white" />
              </Link>
              <Link to="/sign-up">
                <Button text="Sign up" bgHover="black" textHover="white" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
