import React from "react";
import service5 from "../../assets/home/service5-1.jpg";
import service6 from "../../assets/home/service5-2.jpg";
import service7 from "../../assets/home/service5-3.jpg";

const Plan = () => {
  const services = [
    {
      serviceName: "BMW X5 2008",
      serviceCategory: "Lambo",
      image: service5,
      price: "$2.50",
      perMileRate: "$1.75",
      doors: "2",
      passengers: "4 person",
    },
    {
      serviceName: "BMW X5 2008",
      serviceCategory: "Lambo",
      image: service6,
      price: "$2.50",
      perMileRate: "$1.75",
      doors: "2",
      passengers: "4 person",
    },
    {
      serviceName: "BMW X5 2008",
      serviceCategory: "Lambo",
      image: service7,
      price: "$2.50",
      perMileRate: "$1.75",
      doors: "2",
      passengers: "4 person",
    },
  ];

  return (
    <div className="container mx-auto items-center text-center my-10">
      <p>Select a plan that shouts</p>
      <h1 className="text-3xl md:text-5xl font-bold w-[50%] mx-auto">
        Choose Your Taxi to Ride!
      </h1>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 px-6 md:px-12">
        {services.map((data, index) => (
          <div
            key={index}
            className="relative group overflow-hidden transition-all duration-500"
            style={{
              clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0% 100%)",
            }}
          >
            {/* Yellow Background Shape */}
            <div
              className="absolute inset-0 bg-[#ffee02cd] transition-all h-[220px] top-10 z-10 duration-500"
              style={{
                clipPath: "polygon(0 17%, 100% 0, 100% 78%, 0% 100%)",
              }}
            ></div>

            {/* Black Overlay (Hidden Initially, Slides Down on Hover) */}
            <div className="absolute inset-0 bg-black h-0 group-hover:h-full transition-all duration-700"></div>

            {/* Image */}
            <img
              src={data.image}
              alt="Service"
              className="h-60 w-full object-cover relative z-20 transition-all duration-500 group-hover:scale-110"
              style={{
                clipPath: "polygon(0 19%, 100% 0, 100% 79%, 0% 100%)",
              }}
            />

            {/* Content */}
            <div className="p-6 relative z-10 shadow-2xl">
              <h2 className="text-2xl font-semibold text-left text-gray-800 group-hover:text-white">
                {data.serviceName}
              </h2>
              <p className="text-gray-700 mt-3 text-sm text-left group-hover:text-white">
                {data.serviceCategory}
              </p>
              <table className="w-full mt-4">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-left text-gray-700 group-hover:text-white">Price: </td>
                    <td className="py-2 text-right font-semibold text-gray-900 group-hover:text-white">{data.price}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-left text-gray-700 group-hover:text-white">Per Mile Rate:</td>
                    <td className="py-2 text-right font-semibold text-gray-900 group-hover:text-white">{data.perMileRate}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-left text-gray-700 group-hover:text-white">Doors:</td>
                    <td className="py-2 text-right font-semibold text-gray-900 group-hover:text-white">{data.doors}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-left text-gray-700 group-hover:text-white">Passengers:</td>
                    <td className="py-2 text-right font-semibold text-gray-900 group-hover:text-white">{data.passengers}</td>
                  </tr>
                </tbody>
              </table>
              <button className="px-10 py-3 mt-5 bg-[#FFEE02] cursor-pointer">Book Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plan;