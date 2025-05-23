import React from "react";
// import services1 from "../../assets/services/service3-1.jpg";
import services1 from "../../assets/home/1000001836.webp";
import services2 from "../../assets/home/1000001841.jpg";
import services3 from "../../assets/home/1000001843.webp";
import { LuChevronsLeft } from "react-icons/lu";
import { FaBoxOpen, FaBusAlt, FaClipboardCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: "Rezervă Loc în Curse",
      description:
        "Caută curse disponibile între România și Italia și rezervă-ți rapid un loc pentru călătoria ta.",
      image: services1,
      icon: (
        <FaBusAlt className="text-black text-3xl group-hover:text-white transition-all duration-500" />
      ),
    },
    {
      id: 2,
      title: "Trimite Colete",
      description:
        "Trimite colete în siguranță cu transportatori de încredere care operează curse regulate.",
      image: services2,
      icon: (
        <FaBoxOpen className="text-black text-3xl group-hover:text-white transition-all duration-500" />
      ),
    },
    {
      id: 3,
      title: "Gestionare Cereri",
      description:
        "Transportatorii pot gestiona ușor cererile de curse și colete direct din platformă.",
      image: services3,
      icon: (
        <FaClipboardCheck className="text-black text-3xl group-hover:text-white transition-all duration-500" />
      ),
    },
  ];

  return (
    <div className="bg-[#F5F5F5] py-10">
      <h1 className="text-3xl md:text-5xl text-center font-bold text-gray-900">
        Servicii Populare
      </h1>
      <div className="container md:w-[85%] mx-auto my-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {services.map((service) => (
          <Link to="/services" key={service.id}>
            <div className="shadow-xl max-w-[270px] relative group mx-auto">
              <div className="relative overflow-hidden cursor-pointer">
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="group-hover:scale-110 transition-all duration-500 ease-in-out w-full max-h-[13rem]"
                />
              </div>
              <div
                className="w-[100px] h-[100px] bg-[#FFEE02] absolute top-28 right-0 group-hover:bg-black transition-all duration-500 flex justify-center items-center"
                style={{
                  clipPath: "polygon(12% 15%, 100% 0, 83% 86%, 0% 100%)",
                }}
              >
                {service.icon}
              </div>
              <div className="p-5">
                <h1 className="text-xl font-bold text-gray-900">
                  {service.title}
                </h1>
                <p className="text-[12px] my-3 text-gray-500">
                  {service.description}
                </p>
                <LuChevronsLeft className="border-1 border-gray-700 w-8 h-8 rounded-full p-2 cursor-pointer hover:border-[#0000001b] hover:bg-[#FFEE02] duration-all duration-500 " />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesSection;
