import React from "react";

const Button = ({ text,bgHover="white",textHover="black" , cutHover="black",onClick }) => {
  return (
    <div>
      <button
        className="relative overflow-hidden bg-[#FFEE02] w-[170px] px-6 py-3 cursor-pointer font-semibold text-black transition-all duration-500 group"
        style={{ clipPath: "polygon(100% 0, 85% 100%, 0 100%, 0 0)" }}
      >
        <div
          className={`absolute top-0 right-2 h-[100%] w-[50px] bg-${cutHover} z-20`}
          style={{ clipPath: "polygon(100% 0, 45% 100%, 25% 100%, 78% 0)" }}
        ></div>
        <span className={`absolute inset-0 bg-${bgHover} w-0 transition-all duration-500 group-hover:w-full z-10`}></span>
        <span className={`relative z-30 ms-[-30px] group-hover:text-${textHover}`} onClick={onClick}>{text}</span>
      </button>
    </div>
  );
};

export default Button;
