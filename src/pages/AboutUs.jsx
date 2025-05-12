import React from "react";
import Intro from "../components/AboutUs/GetApp";
import HowWorks from "../components/AboutUs/HowWorks";
import Drivers from "../components/AboutUs/Drivers";
import Header from "../components/contact/Header";
import TrustedCabService from "../components/home/TrustedCabService";
import GetApp from "../components/AboutUs/GetApp";

const About1 = () => {
  return (
    <>
      <Header title="Despre" name="Despre noi" />
      <TrustedCabService />
      <HowWorks />
      <Drivers />
      <GetApp />
    </>
  );
};

export default About1;
