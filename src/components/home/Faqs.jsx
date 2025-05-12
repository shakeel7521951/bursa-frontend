import React, { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import faq1 from "../../assets/home/faq1-1.jpg";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Cum să rezerv un taxi pentru un tur al orașului?",
      answer:
        "Este simplu! Poți rezerva un taxi pentru tururi ale orașului direct de pe platforma noastră, alegând data, ora și destinația dorită.",
    },
    {
      question: "Ce opțiuni de plată sunt disponibile?",
      answer:
        "Acceptăm carduri de credit, carduri de debit și portofele digitale pentru o experiență de tranzacționare rapidă și sigură.",
    },
    {
      question: "Pot anula rezervarea?",
      answer:
        "Da, poți anula rezervarea cu până la 24 de ore înainte de călătoria programată, fără taxe suplimentare.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container flex gap-20 my-5 mx-auto md:h-[90vh] items-center">
      {/* Secțiunea FAQ */}
      <div className="w-[100%] md:w-[50%] mx-5 pt-20">
        <p className="mb-2">Ai vreo întrebare?</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Întrebări Frecvente
        </h1>

        <div className="mt-10">
          {faqs.map((faq, index) => (
            <div key={index} className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer mb-3"
                onClick={() => toggleFAQ(index)}
              >
                <h4 className="font-semibold text-lg">{faq.question}</h4>
                {openIndex === index ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              <hr className="mb-3" />
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={openIndex === index ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-gray-600">{faq.answer}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Secțiunea Imagini */}
      <div className="hidden md:flex w-[50%] items-center justify-center relative">
        <div
          className="bg-black h-[220px] w-[150px] mr-[-120px] left-0 -translate-y-1/2"
          style={{ clipPath: "polygon(53% 0, 100% 0, 49% 100%, 0% 100%)" }}
        ></div>

        <div className="relative h-[450px] w-[300px]">
          <img
            src={faq1}
            alt="Faq"
            className="w-fit h-full object-cover"
            style={{ clipPath: "polygon(53% 0, 100% 0, 49% 100%, 0% 100%)" }}
          />
        </div>

        <div
          className="bg-[#FFEE02] h-[450px] w-[250px] ml-[-100px]"
          style={{ clipPath: "polygon(53% 0, 100% 0, 49% 100%, 0% 100%)" }}
        ></div>
      </div>
    </div>
  );
};

export default Faqs;
