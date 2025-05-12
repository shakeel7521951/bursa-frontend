import React from "react";
import trusted1 from "../../assets/home/trusted1.jpg";
import about2 from "../../assets/home/about1-2.png";
import about3 from "../../assets/home/about1-3.png";
import { CiCalendarDate } from "react-icons/ci";
import { FaHeadset } from "react-icons/fa";
import Button from "../Button";

const TrustedCabService = () => {
  return (
    <div className="container flex flex-col md:flex-row gap-10 mx-auto mt-20 px-5">
      {/* Image Section */}
      <div className="w-full md:w-[50%] relative flex justify-center">
        <img
          src={trusted1}
          alt="Secțiunea de încredere"
          className="relative w-full max-w-[90%] h-auto md:h-[30rem]"
        />
        <img
          src={about2}
          alt="Secțiunea de încredere"
          className="absolute right-[-15px] md:right-0 top-5 md:top-10 w-[40%] max-w-[150px]"
        />
        <img
          src={about3}
          alt="Secțiunea de încredere"
          className="absolute bottom-[-50px] right-0 md:right-0 w-[40%] max-w-[150px]"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-[50%] mt-7 text-center md:text-left">
        <p className="text-gray-600">Bine ai venit la compania noastră</p>
        <h1 className="text-3xl md:text-5xl font-bold my-3">
          Oferim servicii de taxi de încredere
        </h1>
        <p className="text-gray-600 my-3">
          Ne descurcăm cu succes în fața unor sarcini de diferite complexități, oferim garanții pe termen lung și învățăm constant noi tehnologii.
        </p>
        <p className="text-gray-600">
          Portofoliul nostru include zeci de proiecte finalizate cu succes, de case cu mai multe etaje.
        </p>

        {/* Features */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center md:items-start mt-4">
          <div className="flex items-center gap-2">
            <CiCalendarDate className="text-3xl" />
            <h4 className="text-xl">Rezervare online</h4>
          </div>
          <div className="flex items-center gap-2">
            <FaHeadset className="text-2xl" />
            <h4 className="text-xl">Suport 24/7</h4>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-10 md:justify-start">
          <Button text="Rezervă un taxi" bgHover="black" textHover="white" cutHover="white"/>
        </div>
      </div>
    </div>
  );
};

export default TrustedCabService;
