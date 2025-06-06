import { useState } from "react";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import home1 from '../../assets/home/home1.png';
import home2 from '../../assets/home/home2.png';
import { FaArrowRight, FaSearch } from "react-icons/fa";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    setIsModalOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative w-full bg-gray-50">
      {/* Hero Section with Images */}
      <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto">
        {/* Left Image with Overlay Text */}
        <div className="relative w-full lg:w-1/2 h-96 lg:h-[500px] overflow-hidden">
          <img 
            src={home1} 
            alt="Bus traveling between Romania and Italy" 
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6">
            <div className="text-white text-center max-w-md">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Transport de încredere între România și Italia
              </h1>
              <p className="text-lg mb-6">
                Rezervă locuri pentru persoane sau colete în curse regulate și sigure
              </p>
              <Link to="/services">
                <Button 
                  text="Vezi cursele disponibile" 
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3"
                />
              </Link>
            </div>
          </div> */}
        </div>

        {/* Right Image with Features */}
        <div className="relative w-full lg:w-1/2 h-96 lg:h-[500px] overflow-hidden">
          <img 
            src={home2} 
            alt="Comfortable bus seats" 
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black/20 flex items-end p-6">
            <div className="text-white">
              <div className="flex items-center mb-3">
                <div className="bg-yellow-400 p-2 rounded-full mr-3">
                  <FaSearch className="text-black text-lg" />
                </div>
                <h3 className="text-xl font-semibold">Peste 100 de curse săptămânale</h3>
              </div>
              <div className="flex items-center">
                <div className="bg-yellow-400 p-2 rounded-full mr-3">
                  <FaArrowRight className="text-black text-lg" />
                </div>
                <h3 className="text-xl font-semibold">Direct din orașul tău</h3>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Modal for Login Requirement */}
      {/* {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Pentru a vedea cursele disponibile
            </h2>
            <p className="text-gray-600 mb-6">
              Este necesar să vă autentificați sau să vă creați un cont.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="flex-1">
                <Button
                  text="Autentificare"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                />
              </Link>
              <Link to="/register" className="flex-1">
                <Button
                  text="Înregistrare"
                  className="w-full bg-black hover:bg-gray-800 text-white"
                />
              </Link>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Header;