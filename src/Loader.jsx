// components/common/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="relative w-24 h-24">
        {/* Outer ring - yellow */}
        <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Middle ring - white */}
        <div className="absolute inset-2 border-4 border-white border-b-transparent rounded-full animate-spin animation-delay-75"></div>
        
        {/* Inner dot - yellow pulse */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-medium mt-16">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;