import React, { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
// import faq1 from "../../assets/home/faq1-1.jpg";
import faq1 from '../../assets/home/testimonials.jpg'

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Cum pot rezerva un loc într-o călătorie?",
      answer:
        "Poți rezerva un loc într-o călătorie disponibilă între Italia și România direct de pe platformă. Selectezi traseul, data și ora, iar cererea ta va fi trimisă către transportator.",
    },
    {
      question: "Cum funcționează procesul de aprobare?",
      answer:
        "După ce trimiți o cerere de rezervare, transportatorul o va analiza și o poate accepta sau respinge în funcție de disponibilitate.",
    },
    {
      question: "Ce tipuri de plăți sunt acceptate?",
      answer:
        "Plățile pot fi efectuate online cu card bancar sau, în unele cazuri, numerar la fața locului — în funcție de preferințele transportatorului.",
    },
    {
      question: "Pot anula o rezervare confirmată?",
      answer:
        "Da, poți anula o rezervare confirmată, dar verifică politicile fiecărui transportator privind anulările și eventualele taxe.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container flex flex-col md:flex-row gap-10 my-10 mx-auto items-center md:h-[90vh]">
      {/* FAQ Text Section */}
      <div className="w-full md:w-1/2 px-5">
        <p className="text-gray-600 mb-2">Ai întrebări despre platformă?</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Întrebări Frecvente
        </h1>

        <div className="mt-10 space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-3">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <h4 className="font-semibold text-lg">{faq.question}</h4>
                {openIndex === index ? <FaChevronDown /> : <FaChevronRight />}
              </div>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex w-1/2 items-center justify-center relative">
        <div
          className="bg-black h-[220px] w-[150px] mr-[-120px] -translate-y-1/2"
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
