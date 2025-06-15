import Header from "../components/home/Header";
import TrustedCabService from "../components/home/TrustedCabService";
import Services from "../components/home/Services";
import PopularServices from "../components/home/PopularServices";
import Faqs from "../components/home/Faqs";
// import Plan from "../components/home/Plan";

const Home = () => {
  return (
    <div>
      <Header />
      <TrustedCabService />
      <Services />
      {/* <Plan /> */}
      {/* <PopularServices /> */}
      <Faqs />
    </div>
  );
};

export default Home;
