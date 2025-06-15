import React from "react";
import service5 from "../../assets/home/Bursa_Trans_Steaguri_HD.webp";
import service6 from "../../assets/home/service5-2.jpg";
import service7 from "../../assets/home/Transport_Auto_HD.webp";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      title: "Transport Persoane România - Italia",
      description:
        "Găsește curse disponibile postate de transportatori și rezervă-ți locul ușor pentru o călătorie confortabilă.",
      image: service5,
      link: "/services",
      category: "passenger",
    },
    {
      title: "Trimite Colete Rapid",
      description:
        "Trimite pachete între România și Italia în siguranță. Transportatori reali și comunicare directă.",
      image: service6,
      link: "/services",
      category: "parcel",
    },
    {
      title: "Transport Autovehicule oriunde",
      description:
        "Puteți găsi aici platforme pentru transportul autovehiculelor dumneavoastră de la adresă la adresă, în condiții de siguranță și profesionalism.",
      image: service7,
      link: "/services",
      category: "vehicle_trailer",
    },
  ];

  return (
    <div className="bg-[#F5F5F5] text-center mt-20 py-16">
      <p className="text-lg text-amber-500 font-semibold tracking-wide">
        SERVICIILE NOASTRE
      </p>
      <h1 className="text-3xl md:text-5xl font-bold w-full md:w-[70%] mx-auto leading-tight text-gray-900">
        Conectăm pasagerii și transportatorii pentru curse România - Italia
      </h1>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 px-6 md:px-12">
        {services.map((data, index) => (
          <Link key={index} to={`${data.link}?category=${data.category}`}>
            <div
              className="transition-all group duration-500 overflow-hidden relative"
              style={{
                clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <div
                className="bg-[#ffee02cd] group-hover:bg-black transition-all duration-500 w-full mx-auto h-[220px] top-10 absolute"
                style={{
                  clipPath: "polygon(0 17%, 100% 0, 100% 78%, 0% 100%)",
                }}
              ></div>
              <img
                src={data.image}
                alt={data.title}
                className="h-60 w-full object-cover transition-all duration-500 group-hover:scale-110"
                style={{
                  clipPath: "polygon(0 19%, 100% 0, 100% 79%, 0% 100%)",
                }}
              />
              <div className="p-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {data.title}
                </h2>
                <p className="text-gray-700 mt-3 text-sm">
                  {data.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
