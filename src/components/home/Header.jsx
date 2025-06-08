import Button from "../Button";
import { Link } from "react-router-dom";
import home1 from '../../assets/home/home3.png'
import home2 from '../../assets/home/home2.png';

const Header = () => {
  return (
    <div className="relative w-full bg-gray-50">
      {/* Hero Section with Images */}
      <div className="flex flex-col lg:flex-row w-full mx-auto">
        {/* Left Image with Overlay Text */}
        <div className="relative w-full lg:w-1/2 h-96 lg:h-[500px] justify-center items-center overflow-hidden">
          <img 
            src={home1} 
            alt="Bus traveling between Romania and Italy" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex justify-center items-center mt-auto mb-0 p-6">
            <div className="text-white max-w-md ">
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
          </div>
        </div>

        {/* Right Image with Features */}
        <div className="relative w-full lg:w-1/2 h-96 lg:h-[500px] overflow-hidden">
          <img 
            src={home2} 
            alt="Comfortable bus seats" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-6">
          </div>
        </div>
      </div>
  
    </div>
  );
};

export default Header;