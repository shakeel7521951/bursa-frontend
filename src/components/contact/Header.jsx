import { Link } from "react-router-dom";
import pageTitle from "../../assets/contact/page-title.png";
import { FaChevronRight } from "react-icons/fa";

const Header = ({name,title}) => {
  return (
    <div className="relative w-full">
      <img
        src={pageTitle}
        alt="Contact page poster"
        className="w-full h-auto min-h-[300px] object-cover"
      />

      <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#000000b3] bg-opacity-60 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white text-center mb-3">
        {name}
        </h1>

        <div className="flex items-center gap-2 text-white text-sm md:text-base">
          <Link to="/" className="hover:underline">Home</Link>
          <FaChevronRight className="text-xs opacity-70" />
          <span className="text-gray-300">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
