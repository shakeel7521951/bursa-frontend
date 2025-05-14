import React from "react";
import trusted1 from "../../assets/home/trusted1.jpg";
import about2 from "../../assets/home/about1-2.png";
import about3 from "../../assets/home/about1-3.png";
import { CiCalendarDate } from "react-icons/ci";
import { FaHeadset } from "react-icons/fa";
import Button from "../Button";

const TrustedTransportService = () => {
  return (
    <div className="container flex flex-col md:flex-row gap-10 mx-auto mt-20 px-5">
      {/* Image Section */}
      <div className="w-full md:w-[50%] relative flex justify-center">
        <img
          src={trusted1}
          alt="Transport de încredere"
          className="relative w-full max-w-[90%] h-auto md:h-[30rem]"
        />
        <img
          src={about2}
          alt="Despre transport"
          className="absolute right-[-15px] md:right-0 top-5 md:top-10 w-[40%] max-w-[150px]"
        />
        <img
          src={about3}
          alt="Despre transport"
          className="absolute bottom-[-50px] right-0 md:right-0 w-[40%] max-w-[150px]"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-[50%] mt-7 text-center md:text-left">
        <p className="text-gray-600">Bine ai venit pe platforma noastră</p>
        <h1 className="text-3xl md:text-5xl font-bold my-3">
          Transport planificat România – Italia
        </h1>
        <p className="text-gray-600 my-3">
          Descoperă curse regulate de persoane și colete între România și Italia. Alege data, orașul și locurile disponibile.
        </p>
        <p className="text-gray-600">
          Platforma noastră conectează pasageri și transportatori pentru o experiență sigură, planificată și eficientă.
        </p>

        {/* Features */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start mt-4">
          <div className="flex items-center gap-2">
            <CiCalendarDate className="text-3xl" />
            <h4 className="text-xl">Filtrare curse după dată și destinație</h4>
          </div>
          <div className="flex items-center gap-2">
            <FaHeadset className="text-2xl" />
            <h4 className="text-xl">Suport 24/7 pentru pasageri și transportatori</h4>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10 md:justify-start">
          <Button text="Vezi cursele disponibile" bgHover="black" textHover="white" cutHover="white" />
        </div>
      </div>
    </div>
  );
};

export default TrustedTransportService;
