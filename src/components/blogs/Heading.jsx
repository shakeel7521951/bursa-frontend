import React from "react";

function Heading() {
  return (
    <div className="my-8 flex flex-col md:items-center md:justify-center gap-4 p-4">
      <button className="bg-[#ffee025e] py-2 px-4 rounded text-black font-semibold hover:cursor-pointer">
        Blogurile Noastre
      </button>
      <h2 className="lg:text-[2.5rem] md:text-[2rem] text-[20px]">
        Explorează Resursele Noastre
      </h2>
      <p>
        Oferim sfaturi și informații utile de la experți din domeniul feroviar.
      </p>
    </div>
  );
}

export default Heading;
