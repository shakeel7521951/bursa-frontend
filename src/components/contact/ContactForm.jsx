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
          <p className="uppercase text-gray-600">Trimite-ne un mesaj</p>
          <h1 className="text-3xl md:text-5xl font-semibold">
            Scrie-ne fără ezitare
          </h1>
          <form
            type="submit"
            className="my-5 flex flex-col flex-wrap md:flex-row gap-3"
          >
            <input
              type="text"
              name="name"
              placeholder="Nume complet"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <input
              type="email"
              name="email"
              placeholder="Adresă de email"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <input
              type="text"
              name="subject"
              placeholder="Subiectul mesajului"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <input
              type="number"
              name="phone"
              placeholder="Număr de telefon"
              className="w-full md:w-[48%] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <textarea
              name="message"
              placeholder="Scrie mesajul tău aici..."
              className="w-full min-h-[150px] p-3 bg-[#F4F5F8] rounded outline-none focus:ring-2 focus:ring-[#FFEE02] transition duration-300"
            />
            <div className="w-full">
              <Button
                text="Trimite"
                bgHover="black"
                textHover="white"
                cutHover="white"
              />
            </div>
          </form>
        </div>

        {/* Right Section (Contact Details) */}
        <div className="w-full md:w-[48%]">
          <p className="uppercase text-gray-600">Ai nevoie de ajutor?</p>
          <h1 className="text-3xl md:text-5xl font-bold">
            Ia legătura cu echipa noastră
          </h1>
          <p className="text-gray-600 text-sm my-4">
            Suntem aici pentru a te ajuta cu informații despre trenurile din România și Italia. Scrie-ne pentru bilete, orare sau suport.
          </p>

          {/* Contact Info */}
          <div className="flex flex-col gap-5">
            <ContactInfo
              icon={<FiPhoneMissed />}
              title="Ai întrebări?"
              text="+40 123 456 789"
            />
            <ContactInfo
              icon={<MdEmail />}
              title="Scrie-ne pe email"
              text="contact@bursatrains.ro"
            />
            <ContactInfo
              icon={<BsCursor />}
              title="Ne găsești aici"
              text="Str. Principală 99, București / Roma"
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
