import React from "react";
import header from "../../assets/home/header.jpg";
import Button from "../Button";

const Header = () => {
  return (
    <div className="relative w-full max-h-screen">
      {/* Background Image */}
      <img
        src={header}
        alt="Afiș antet"
        className="w-full min-h-[60vh] object-cover"
      />

      {/* Text Content */}
      <div
        className="absolute inset-0 flex flex-col justify-center text-white 
        px-4 sm:px-6 md:px-10 lg:px-16 
        w-full sm:w-[80%] md:w-[60%] 
        text-center sm:text-left"
      >
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight">
          Găsește transport între România și Italia
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl">
          Platformă de transport planificat: rezervă locuri pentru persoane sau
          colete în curse internaționale.
        </p>

        <p className="mt-2 text-sm sm:text-base md:text-lg max-w-2xl">
          <strong>Bursa Trans România - Italia:</strong> Descoperă curse
          regulate, filtrează după oraș, dată și locuri disponibile.
        </p>

        <div className="w-fit flex-nowrap mt-6 flex sm:justify-start justify-center">
          <Button text="Vezi cursele disponibile" />
        </div>
      </div>
    </div>
  );
};

export default Header;
