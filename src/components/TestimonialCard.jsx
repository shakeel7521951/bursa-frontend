import React from "react";

const dummyData = [
  {
    id: "1",
    avatar:
      "https://images.unsplash.com/photo-1739056656211-de9471bad354?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "John Doe",
    rating: 4,
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut tellus non neque bibendum finibus vel eget velit.",
    designation: "CEO, Example Company",
  },
  {
    id: "2",
    avatar:
      "https://images.unsplash.com/photo-1739056656211-de9471bad354?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Jane Smith",
    rating: 5,
    message:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    designation: "CTO, Example Corp",
  },
  {
    id: "3",
    avatar:
      "https://images.unsplash.com/photo-1739056656211-de9471bad354?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Alice Johnson",
    rating: 3,
    message:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
    designation: "COO, Example Ltd",
  },
  {
    id: "4",
    avatar:
      "https://images.unsplash.com/photo-1739056656211-de9471bad354?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    name: "Bob Brown",
    rating: 5,
    message: "Another testimonial to increase the content width.",
    designation: "CMO, Example Inc",
  },
];

const TestimonialCard = () => {
  return (
    // Outer container with horizontal scrolling enabled and full width
    <div className="w-full overflow-x-auto custom-scrollbar px-3 py-6">
      {/* Flex container with nowrap to force horizontal overflow */}
      <div className="flex flex-nowrap space-x-4 sm:space-x-8 md:space-x-12">
        {dummyData.map((item) => (
          <div
            key={item.id}
            className="min-w-[500px] sm:min-w-[320px] md:min-w-[400px] bg-white rounded-2xl shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Left Column: Profile Image */}
              <div className="flex justify-center items-center">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-54 md:h-auto rounded-sm object-cover"
                />
              </div>
              {/* Right Column: Testimonial Content */}
              <div className="flex flex-col justify-center p-4">
                {/* Star Rating */}
                <div className="flex  items-center mb-2">
                  {Array.from({ length: item.rating }, (_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                  <span className="ml-2  text-sm text-gray-500">
                    {item.rating} Reviews
                  </span>
                </div>
                {/* Testimonial Comment */}
                <p className="text-gray-700 mb-4">{item.message}</p>
                {/* User Info */}
                <div className="text-lg font-bold text-gray-900">
                  {item.name}
                </div>
                <div className="text-sm text-gray-500">{item.designation}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;
