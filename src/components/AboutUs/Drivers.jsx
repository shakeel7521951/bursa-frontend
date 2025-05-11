import { IoPhonePortraitOutline } from "react-icons/io5";
import team1 from "../../assets/about/team1-1.jpg";
import team2 from "../../assets/about/team1-2.jpg";
import team3 from "../../assets/about/team1-3.jpg";
import { FaLinkedinIn, FaFacebook, FaTwitter } from "react-icons/fa6";

const driversData = [
  {
    name: "Tricia Gibney",
    role: "President, Manager",
    phone: "(+380) 50 318 47 07",
    image: team1,
  },
  {
    name: "Thomas Walker",
    role: "President, Manager",
    phone: "(+380) 51 234 56 78",
    image: team2,
  },
  {
    name: "Roman Morko",
    role: "President, Manager",
    phone: "(+380) 52 987 65 43",
    image: team3,
  },
];

const Drivers = () => {
  return (
    <div className="container mx-auto px-4 md:px-0">
      <p className="uppercase text-center text-sm md:text-base">
        Our Expert Drivers
      </p>
      <h1 className="text-2xl md:text-5xl font-bold text-center">
        Meet Our Drivers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 mt-9 gap-10">
        {driversData.map((driver, index) => (
          <div
            key={index}
            className="flex flex-col min-w-[300px] mx-auto rounded border relative my-3 cursor-pointer group hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Driver Info */}
            <div className="px-4 pt-4 md:px-3">
              <h1 className="text-lg md:text-2xl font-semibold text-left ">
                {driver.name}
              </h1>
              <p className="text-gray-600 text-left">
                {driver.role}
              </p>
            </div>

            {/* Phone Section */}
            <div className="flex flex-col md:flex-row mt-3 mb-10 items-center md:items-start gap-2 justify-center md:justify-end px-3">
              <IoPhonePortraitOutline className="bg-[#FFEE02] w-[40px] h-[40px] p-2 rounded-full" />
              <p className="hover:underline cursor-pointer font-semibold text-gray-600 text-center md:text-left">
                {driver.phone}
              </p>
            </div>

            {/* Shape Background */}
            <div
              className="w-full h-[200px] md:w-[300px] md:h-[280px] bg-[#FFEE02] group-hover:bg-[#000] transition-all duration-1000 z-0 mx-auto md:ml-[20px]"
              style={{
                clipPath: "polygon(28% 34%, 100% 30%, 65% 100%, 0% 100%)",
              }}
            ></div>

            {/* Driver Image */}
            <div className="absolute bottom-10 w-full flex justify-center md:justify-start">
              <img
                src={driver.image}
                alt={driver.name}
                className="object-cover transition-transform duration-1000 transform group-hover:scale-110 max-w-[90%] md:max-w-none"
                style={{
                  clipPath: "polygon(41% 0, 100% 0, 62% 100%, 0% 100%)",
                  transformOrigin: "center",
                }}
              />
            </div>

            {/* Social Icons */}
            <div className="absolute bottom-0 w-full flex justify-center items-center mb-4 gap-4">
              <FaLinkedinIn className="shadow-lg p-2 w-[32px] md:w-[36px] h-[32px] md:h-[36px] bg-white text-gray-800 hover:bg-[#FFEE02] hover:text-black hover:border hover:border-white rounded-full transition-all duration-500 transform hover:scale-110" />
              <FaFacebook className="shadow-lg p-2 w-[32px] md:w-[36px] h-[32px] md:h-[36px] bg-white text-gray-800 hover:bg-[#FFEE02] hover:text-black hover:border hover:border-white rounded-full transition-all duration-500 transform hover:scale-110" />
              <FaTwitter className="shadow-lg p-2 w-[32px] md:w-[36px] h-[32px] md:h-[36px] bg-white text-gray-800 hover:bg-[#FFEE02] hover:text-black hover:border hover:border-white rounded-full transition-all duration-500 transform hover:scale-110" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
