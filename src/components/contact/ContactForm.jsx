import React from "react";
import { FiPhoneMissed } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { BsCursor } from "react-icons/bs";
import Button from "../Button";

const ContactForm = () => {
  return (
    <div className="container mx-auto my-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Section (Form) */}
        <div className="w-full md:w-[48%]">
          <p className="uppercase text-gray-600">Send us email</p>
          <h1 className="text-3xl md:text-5xl font-semibold">
            Feel free to write
          </h1>
          <form
            type="submit"
            className="my-5 flex flex-col flex-wrap md:flex-row gap-3"
          >
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <input
              type="text"
              name="subject"
              placeholder="Enter Subject"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <input
              type="number"
              name="phone"
              placeholder="Enter Phone"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <textarea
              name="message"
              placeholder="Enter Message"
              className="w-full min-h-[150px] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <div className="w-full">
              <Button
                text="Discover More"
                bgHover="black"
                textHover="white"
                cutHover="white"
              />
            </div>
          </form>
        </div>

        {/* Right Section (Contact Details) */}
        <div className="w-full md:w-[48%]">
          <p className="uppercase text-gray-600">Need any help?</p>
          <h1 className="text-3xl md:text-5xl font-bold">Get in touch with us</h1>
          <p className="text-gray-600 text-sm my-4">
            Lorem ipsum is simply free text available dolor sit amet consectetur
            notted adipisicing elit sed do eiusmod tempor incididunt simply dolore
            magna.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-5">
            <ContactInfo
              icon={<FiPhoneMissed />}
              title="Have any question?"
              text="Free +92 (020)-9850"
            />
            <ContactInfo
              icon={<MdEmail />}
              title="Write email"
              text="needhelp@company.com"
            />
            <ContactInfo
              icon={<BsCursor />}
              title="Visit anytime"
              text="66 Brooklyn Golden Street, New York"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Contact Info Component
const ContactInfo = ({ icon, title, text }) => (
  <div className="flex gap-4 cursor-default items-center group">
    <div className="bg-[#FFEE02] w-[60px] h-[60px] rounded p-3 flex items-center justify-center text-xl transition-all duration-300 group-hover:bg-black group-hover:text-white">
      {icon}
    </div>
    <div>
      <h1 className="font-bold text-xl transition-colors duration-300 group-hover:text-[#FFEE02]">
        {title}
      </h1>
      <p className="text-gray-600 transition-colors duration-300 group-hover:text-black">
        {text}
      </p>
    </div>
  </div>
);

export default ContactForm;
