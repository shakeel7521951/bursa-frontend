import React from "react";
import Heading from "../components/blogs/Heading";
import BlogCards from "../components/blogs/BlogCards";
import BlogLabel from "../components/blogs/BlogLabel";
import Header from "../components/contact/Header";

const Blogs = () => {
  return (
    <div>
      <Header title="Bloguri" name="Blogurile noastre"/>
      <Heading />
      <div className="grid grid-cols-3">
        <div className="md:col-span-1">
          <BlogLabel />
        </div>
        <div className="md:col-span-2 col-span-3">
          <BlogCards />
        </div>
      </div>
    </div>
  );
};

export default Blogs;
