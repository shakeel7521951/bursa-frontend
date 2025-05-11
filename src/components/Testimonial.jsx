import React from "react";
import TestimonialCard from "./TestimonialCard";

const Testimonial = () => {
  return (
    <div
      className="flex flex-col justify-around items-center mt-8 min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/testimonial/testimonial.png)" }}
    >
      <div className="flex flex-col items-center gap-4 px-4">
        <button
          disabled
          className="bg-[#1572D3]/10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-lg text-[#1572D3] p-3 poppins-normal"
        >
          {"Testimonial".toUpperCase()}
        </button>
        <h1 className="poppins-semibold text-3xl sm:text-4xl md:text-5xl font-medium text-center">
          What People say about us?
        </h1>
      </div>
      <div className="mb-12 w-full overflow-x-auto overflow-y-hidden">
        <TestimonialCard />
      </div>
    </div>
  );
};

export default Testimonial;
