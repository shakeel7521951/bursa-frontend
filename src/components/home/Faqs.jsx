import React, { useState } from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import faq1 from "../../assets/home/faq1-1.jpg";

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How to book a taxi cab in a city tour?",
      answer:
        "Sed perspiciatis unde omnis iste natus voluptatem accusantium doloremque laudantium, totam aperiam eaque quae inventore veritatis et quasi architecto beatae vitae dicta.",
    },
    {
      question: "What are the payment options available?",
      answer:
        "We accept credit cards, debit cards, and digital wallets for a seamless transaction experience.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking up to 24 hours before your scheduled ride without any charges.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container flex gap-20 my-5 mx-auto md:h-[90vh] items-center">
      {/* FAQ Section */}
      <div className="w-[100%] md:w-[50%] mx-5 pt-20">
        <p className="mb-2">Have you any question?</p>
        <h1 className="text-3xl md:text-5xl font-bold mb-6">
          Frequently Asked Questions?
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

      {/* Image Section */}
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
