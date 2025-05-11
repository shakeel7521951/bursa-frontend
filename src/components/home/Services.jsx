import React from "react";
import service5 from "../../assets/home/service5-1.jpg";
import service6 from "../../assets/home/service5-2.jpg";
import service7 from "../../assets/home/service5-3.jpg";

const Services = () => {
  const services = [
    {
      title: "Business Transfer",
      description:
        "Lorem ipsum dolor sit amet, consectne auctor aliquet Aenean solli lorem tim bibendum auctor.",
      image: service5,
    },
    {
      title: "Online Booking",
      description:
        "Lorem ipsum dolor sit amet, consectne auctor aliquet Aenean solli lorem tim bibendum auctor.",
      image: service6,
    },
    {
      title: "City Transport",
      description:
        "Lorem ipsum dolor sit amet, consectne auctor aliquet Aenean solli lorem tim bibendum auctor.",
      image: service7,
    },
  ];
  return (
    <div className="bg-[#F5F5F5] text-center mt-20 py-16">
      <p className="text-lg text-amber-500 font-semibold tracking-wide">
        LATEST SERVICES
      </p>
      <h1 className="text-3xl md:text-5xl font-bold w-full md:w-[50%] mx-auto leading-tight text-gray-900">
        Check Out Our All-Time Best Services
      </h1>

      {/* Services Grid */}
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 px-6 md:px-12">
        {services.map((data,index) => (
          <div key={index} className=" transition-all group duration-500 overflow-hidden relative"
          style={{
            clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0% 100%)",
          }}>
            <div
              className="bg-[#ffee02cd] group-hover:bg-black transition-all duration-500 w-full mx-auto h-[220px] top-10 absolute"
              style={{
                clipPath: "polygon(0 17%, 100% 0, 100% 78%, 0% 100%)",
              }}
            ></div>
            <img
              src={data.image}
              alt="Service"
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
        ))}
      </div>
    </div>
  );
};

export default Services;
