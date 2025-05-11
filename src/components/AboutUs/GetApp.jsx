import bgImage from "../../assets/about/4.jpg";
import google from '../../assets/about/google-play.png';
import app from '../../assets/about/app-store.png';
import iconCar from '../../assets/about/icon-car-4.99f44885.png';

const GetApp = () => {
  return (
    <div className="my-14 relative">
      {/* Background Image with Overlay */}
      <div className="relative">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover min-h-[300px]"
        />
        <div className="absolute inset-0 bg-[#000000ad]"></div>
      </div>

      {/* Yellow Shapes & Content */}
      <div className="absolute inset-0 flex flex-col md:flex-row justify-between items-center md:items-start px-6 md:px-20 py-10 md:py-0">
        <div className="hidden md:block absolute right-0 top-0 h-full">
          <div
            className="w-[300px] h-full absolute bg-[#FFEE02] right-0"
            style={{ clipPath: "polygon(57% 0, 100% 0, 44% 100%, 0% 100%)" }}
          ></div>
          <div
            className="w-[300px] h-full absolute bg-[#FFEE02] right-52"
            style={{ clipPath: "polygon(57% 0, 100% 0, 44% 100%, 0% 100%)" }}
          ></div>
        </div>

        <div className="hidden md:block absolute right-10 bottom-[-40px] w-[250px] md:w-[330px]">
          <img src={iconCar} className="car-animation w-full" alt="Icon Car" />
        </div>

        <div className="w-full md:w-[40%] my-auto">
          <h1 className="text-2xl md:text-5xl font-bold text-white">
            Get Free Citycar App On
            <span className="text-[#FFEE02]">Online Store</span>
          </h1>
          <p className="text-sm mt-2 text-white">
            Competently re-engineer cross-media breed meta-services
          </p>
          <div className="flex mt-4 gap-3">
            <img src={google} className="w-32 md:w-34" alt="Google" />
            <img src={app} className="w-32 md:w-34" alt="App Store" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetApp;
