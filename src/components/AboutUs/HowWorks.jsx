import React from "react";
import { FaTaxi, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";

const HowWorks = () => {
  const working = [
    {
      icon: <FaTaxi className="border rounded-full group-hover:bg-[#FFEE02] w-[70px] h-[70px] p-3" />,
      title: "Book in Just 2 Taps",
      description: "Easily book your taxi with just two taps using our user-friendly app.",
    },
    {
      icon: <FaMapMarkerAlt className="border rounded-full group-hover:bg-[#FFEE02] w-[70px] h-[70px] p-3" />,
      title: "Track Your Driver",
      description: "Monitor your ride in real-time and get accurate arrival estimates.",
    },
    {
      icon: <FaCheckCircle className="border rounded-full group-hover:bg-[#FFEE02] w-[70px] h-[70px] p-3" />,
      title: "Pick & Arrive Safely",
      description: "Enjoy a safe and comfortable journey to your destination.",
    },
  ];

  return (
    <div className="container mx-auto my-20 text-center">
      <p className="uppercase">Order Taxi Online</p>
      <h1 className="text-3xl md:text-5xl font-bold">How It Works</h1>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {working.map((item, index) => (
          <div key={index} className="mt-5 relative group">
            <div
              className="h-[230px] w-[300px] bg-[#FFF9B3]"
              style={{ clipPath: "polygon(53% 0, 100% 0, 49% 100%, 0% 100%)" }}
            ></div>

            <div className="absolute top-10 left-20 flex gap-2">
              <div>{item.icon}</div>
              <div>
                <h1 className="font-bold text-xl md:text-2xl text-left">{item.title}</h1>
                <p className="text-sm text-gray-600 text-left">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowWorks;
