import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBlogsQuery } from "../../redux/slices/BlogSlice";

function BlogCards() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAllBlogsQuery();

  if (isLoading) return <div className="text-center">Loading blogs...</div>;
  if (isError) return <div className="text-center text-red-500">Error loading blogs.</div>;

  const blogPosts = data?.blogs || [];

  return (
    <div className="p-4">
      <div className="grid md:grid-cols-2 gap-6 hover:cursor-pointer">
        {blogPosts.map((item) => (
          <div
            key={item._id}
            className="flex flex-col gap-2"
            onClick={() => navigate(`/blog/${item._id}`)}
          >
            <img
              src={item.blogImage}
              alt="not found"
              className="rounded-xl h-[40vh]"
            />
            <p className="bg-[#ffee0275] py-1 px-2 rounded-full text-black font-semibold w-20 text-center text-sm">
              {item.category}
            </p>
            <h2 className="lg:text-[1.2rem] md:text-[1rem] text-[20px] font-bold text-[#333]">
              {item.title.length > 50 ? `${item.title.substring(0, 50)}...` : item.title}
            </h2>
            <p className="text-[#666]">
              {item.description.length > 100
                ? `${item.description.substring(0, 100)}...`
                : item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogCards;
