import logo from "../assets/logo-2.png";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import appStore from "../assets/about/app-store.png";
import googlePlay from "../assets/about/google-play.png";
import { Link } from "react-router-dom";
import { LuChevronsLeft } from "react-icons/lu";
import Button from "../components/Button.jsx";
import { FaFacebook } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-black px-10 pt-10 mt-10">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Logo */}
        <div className="w-full md:w-[20%] flex justify-center md:justify-start">
          <img
            src={logo}
            alt="company logo"
            loading="lazy"
            className="w-fit max-w-[170px]"
          />
        </div>

        {/* Description */}
        <div className="w-full md:w-[30%] text-center md:text-left">
          <p className="text-white">
            Logo Authoritatively simplify open-source resources via backend
            visualize business e-markets before parallel.
          </p>
        </div>

        {/* Call for Taxi */}
        <div className="w-full md:w-[30%] relative">
          <div
            className="max-w-[300px] h-[60px] md:h-[70px] bg-[#FFEE02]"
            style={{ clipPath: "polygon(20% 3%, 100% 0, 100% 100%, 0% 100%)" }}
          ></div>
          <div className="text-black flex items-center absolute top-2 right-14 md:top-3 md:right-8 lg:right-16 xl:right-20 2xl:right-24 max-w-[250px]">
            <HiOutlineDevicePhoneMobile className="text-4xl me-2" />
            <div>
              <p className="uppercase text-sm md:font-semibold">
                Call for Taxi
              </p>
              <p className="text-md md:text-xl lg:text-2xl">5267-214-392</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mt-10 mx-auto flex flex-col md:flex-row justify-between">
        {/* Download Mobile App */}
        <div className="flex mt-5 text-white">
          <div className="max-w-[300px]">
            <h3 className="font-bold text-2xl">Download Mobile App</h3>
            <div className="relative mt-2">
              <hr className="w-[90%] border-gray-500" />
              <hr className="w-[30%] bg-[#FFEE02] h-1 rounded-full mt-[-2px]" />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Competently re-engineer cross-media breed meta-services.
            </p>
            <div className="flex gap-4 mt-5">
              <img
                src={appStore}
                className="w-32 h-12 cursor-pointer"
                alt="Download from App Store"
                loading="lazy"
              />
              <img
                src={googlePlay}
                className="w-32 h-12 cursor-pointer"
                alt="Download from Google Play"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Useful Links */}
        <div className="flex mt-5 text-white">
          <div className="max-w-[300px]">
            <h3 className="font-bold text-2xl uppercase">Useful Links</h3>
            <div className="relative mt-2">
              <hr className="w-[90%] border-gray-500" />
              <hr className="w-[30%] bg-[#FFEE02] h-1 rounded-full mt-[-2px]" />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              {["Home", "Services", "About Us", "Contact Us"].map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <LuChevronsLeft className="mt-0.5" />
                  <Link
                    to={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex mt-5 text-white">
          <div className="max-w-[300px]">
            <h3 className="font-bold text-2xl uppercase">Newsletter</h3>
            <div className="relative mt-2">
              <hr className="w-[90%] border-gray-500" />
              <hr className="w-[30%] bg-[#FFEE02] h-1 rounded-full mt-[-2px]" />
            </div>
            <p className="my-2 text-sm text-gray-400">
              Signup for our weekly Newsletter updates.
            </p>
            <div>
              <input
                type="email"
                className="p-3 mb-4 border border-gray-300 w-full max-w-[250px] rounded-md outline-none"
                placeholder="Enter your email"
              />
              <Button text="Subscribe" />
            </div>
          </div>
        </div>
      </div>
      <hr className="w-full text-gray-500 mt-8" />
      <div className="container mx-auto mt-4 pb-4 flex justify-between items-center">
        <div>
          <p className="text-white">
            © Copyright Citycar Reserved By Kodesolution.com
          </p>
        </div>
        <div>
          <div className="text-white items-center cursor-pointer flex gap-1 hover:text-[#FFEE02]">
            <FaFacebook className="text-white" />
            <p>Facebook</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
