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
      <Header title="About" name="About Us" />
      <TrustedCabService />
      <HowWorks />
      <Drivers />
      <GetApp />
    </>
  );
};

export default About1;
