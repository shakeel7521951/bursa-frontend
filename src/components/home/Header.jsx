import React from "react";
// import header from "../../../src/assets/home/header.jpg";
import header from "../../assets/home/header.jpg";
import Button from "../Button";

const Header = () => {
  return (
    <div className="relative w-full max-h-screen">
      {/* Background Image */}
      <img
        src={header}
        alt="Header poster"
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
          Reserve Your Car From Any Location
        </h1>

        <p className="mt-4 text-sm sm:text-base md:text-lg max-w-2xl">
          Rent a Car dolor sit amet consectetur adipisicing elit. Aut porro
          fugit error assumenda quasi dolor placeat nemo et expedita nostrum,
          suscipit neque harum iure unde voluptatum nisi aspernatur alias
          perferendis!
        </p>

        <div className="mt-6 flex sm:justify-start justify-center">
          <Button text="Discover More" />
        </div>
      </div>
    </div>
  );
};

export default Header;
