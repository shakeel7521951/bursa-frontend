// import logo from "../assets/logo-2.png";
import logo from "../assets/companyLogo.png";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";
import appStore from "../assets/about/app-store.png";
import googlePlay from "../assets/about/google-play.png";
import { Link } from "react-router-dom";
import { LuChevronsLeft } from "react-icons/lu";
import Button from "../components/Button.jsx";
import { FaFacebook } from "react-icons/fa";
import { toast } from "react-toastify";

const Footer = () => {
  return (
    <div className="bg-black px-10 pt-10 mt-10">
      {/* Secțiunea de Sus */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        {/* Logo */}
        <div className="w-full md:w-[20%] flex justify-center md:justify-start">
          <img
            src={logo}
            alt="sigla companiei"
            loading="lazy"
            className="w-fit h-12"
          />
        </div>

        {/* Descriere */}
        <div className="w-full md:w-[30%] text-center md:text-left">
          <p className="text-white">
            Bursa Trans România-Italia oferă servicii rapide și sigure de
            transport persoane și colete între România și Italia. Ne mândrim cu
            punctualitatea, confortul și profesionalismul echipei noastre.
          </p>
        </div>

        {/* Apel Taxi */}
        <div className="w-full md:w-[30%] relative">
          <div
            className="max-w-[300px] h-[60px] md:h-[70px] bg-[#FFEE02]"
            style={{ clipPath: "polygon(20% 3%, 100% 0, 100% 100%, 0% 100%)" }}
          ></div>
          <div className="text-black flex items-center absolute top-2 right-14 md:top-3 md:right-8 lg:right-16 xl:right-20 2xl:right-24 max-w-[250px]">
            <HiOutlineDevicePhoneMobile className="text-4xl me-2" />
            <div>
              <p className="uppercase text-sm md:font-semibold">
                Sună pentru rezervare
              </p>
              <p className="text-md md:text-xl lg:text-2xl">5267-214-392</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secțiunea de Jos */}
      <div className="container mt-10 mx-auto flex flex-col md:flex-row justify-between">
        {/* Descărcare Aplicație Mobilă */}
        <div className="flex mt-5 text-white">
          <div className="max-w-[300px]">
            <h3 className="font-bold text-2xl">Descarcă Aplicația</h3>
            <div className="relative mt-2">
              <hr className="w-[90%] border-gray-500" />
              <hr className="w-[30%] bg-[#FFEE02] h-1 rounded-full mt-[-2px]" />
            </div>
            <p className="mt-2 text-sm text-gray-400">
              Administrează rezervările și urmărește cursele cu aplicația
              noastră.
            </p>
            <div className="flex gap-4 mt-5">
              <img
                src={appStore}
                className="w-32 h-12 cursor-pointer"
                alt="Descarcă din App Store"
                loading="lazy"
              />
              <img
                src={googlePlay}
                className="w-32 h-12 cursor-pointer"
                alt="Descarcă din Google Play"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Linkuri Utile */}
        <div className="flex mt-5 text-white">
          <div className="max-w-[300px]">
            <h3 className="font-bold text-2xl uppercase">Linkuri Utile</h3>
            <div className="relative mt-2">
              <hr className="w-[90%] border-gray-500" />
              <hr className="w-[30%] bg-[#FFEE02] h-1 rounded-full mt-[-2px]" />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              {["Acasă", "Servicii", "Despre Noi", "Contact"].map(
                (item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <LuChevronsLeft className="mt-0.5" />
                    <Link
                      to={`/${item.toLowerCase().replace(" ", "-")}`}
                      className="relative text-white transition-all duration-300 ease-in-out after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#FFEE02] after:transition-all after:duration-300 hover:after:w-full rounded-full"
                    >
                      {item}
                    </Link>
                  </div>
                )
              )}
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
              Abonează-te pentru a primi cele mai recente oferte și noutăți.
            </p>
            <div>
              <input
                type="email"
                className="p-3 mb-4 border border-gray-300 w-full max-w-[250px] rounded-md outline-none"
                placeholder="Introdu adresa ta de email"
              />
              <Button onClick={()=>toast("Thank you for your trust!")} text="Abonează-te" />
            </div>
          </div>
        </div>
      </div>
      <hr className="w-full text-gray-500 mt-8" />
      <div className="container mx-auto mt-4 pb-4 flex justify-between items-center">
        <div>
          <p className="text-white">
            © Drepturi rezervate Bursa Trans România-Italia
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
