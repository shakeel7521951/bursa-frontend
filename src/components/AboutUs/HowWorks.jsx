import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

const HowWorks = () => {
  const working = [
    {
      icon: <FaMapMarkerAlt className="border rounded-full group-hover:bg-[#FFEE02] w-[70px] h-[70px] p-3" />,
      title: "Călătorește între România și Italia",
      description: "Găsește curse planificate între orașele din România și Italia, disponibile pentru rezervare în avans.",
    },
    {
      icon: <FaCalendarAlt className="border rounded-full group-hover:bg-[#FFEE02] w-[70px] h-[70px] p-3" />,
      title: "Rezervă-ți locul din timp",
      description: "Alege data și destinația dorită pentru a rezerva locul în minibusul sau autobuzul preferat.",
    },
    {
      icon: <FaCheckCircle className="border rounded-full group-hover:bg-[#FFEE02] w-[70px] h-[70px] p-3" />,
      title: "Călătorește confortabil și în siguranță",
      description: "Bucură-te de un transport sigur, planificat, cu locuri disponibile și condiții optime pentru călătorii lungi.",
    },
  ];

  return (
    <div className="container mx-auto my-20 text-center">
      <p className="uppercase">Transport planificat între România și Italia</p>
      <h1 className="text-3xl md:text-5xl font-bold">Cum Funcționează</h1>

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
