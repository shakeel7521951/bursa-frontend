import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/footerContent/Frame.png";

function BlogLabel() {
  const categories = [
    "Toate categoriile",
    "Tehnologie",
    "Biologie",
    "Noutăți",
    "Știință",
    "Sănătate",
    "Călătorii",
    "Educație",
    "Afaceri",
    "Sport",
    "Finanțe",
    "Inteligență Artificială",
  ];

  const [selectedCategory, setSelectedCategory] = useState("Toate categoriile");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Buton mobil pentru meniu */}
      <button
        className="sticky top-[120px] left-5 z-[-10] md:hidden bg-[#00667C] text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-[#004D5A]"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Suprapunere pe mobil când meniul este deschis */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Meniu lateral */}
      <div
        className={`fixed top-0 right-0 w-72 p-5 shadow-lg md:rounded-xl bg-white transform transition-transform duration-300 ease-in-out z-50 md:sticky md:top-0 md:left-5 md:w-full md:translate-x-0 ${
          isOpen ? "translate-x-0 w-full" : "translate-x-full"
        }`}
      >
        {/* Buton închidere (mobil) */}
        <button
          className="absolute top-5 right-5 text-gray-600 md:hidden"
          onClick={() => setIsOpen(false)}
        >
          <FaTimes size={20} />
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center mb-5">
          <img
            src={logo}
            alt="logo"
            className="w-16 h-16"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(31%) sepia(89%) saturate(714%) hue-rotate(194deg) brightness(96%) contrast(97%)",
            }}
          />
        </div>

        {/* Căutare articole */}
        <label htmlFor="search" className="block text-black font-medium mb-2">
          🔍 Caută articole
        </label>
        <input
          type="text"
          id="search"
          placeholder="Caută articole..."
          className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#00667C] transition"
        />

        {/* Secțiune de filtrare */}
        <div className="mb-5 relative">
          <label htmlFor="filter" className="block text-black font-medium mb-1">
            📌 Filtru
          </label>
          <div className="relative">
            <button
              className="w-full p-2 border rounded-md bg-white text-black text-left"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedCategory}
            </button>

            {isOpen && (
              <ul className="absolute w-full border bg-black mt-1 z-50 max-h-60 overflow-auto">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`p-2 cursor-pointer hover:bg-[#FFEE02] hover:text-black ${
                      selectedCategory === category
                        ? "bg-[#FFEE02] text-black font-semibold"
                        : "text-white"
                    }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsOpen(false);
                    }}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Navigare pe categorii */}
        <h2 className="text-xl font-semibold mb-4 text-black">
          📂 Categorii
        </h2>
        <div className="h-[40vh] overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`w-full text-left px-4 py-2 rounded-md transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-[#FFEE02] text-black font-semibold shadow-md"
                  : "bg-black text-white"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default BlogLabel;
