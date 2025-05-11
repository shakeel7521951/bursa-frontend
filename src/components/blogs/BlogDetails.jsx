import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../Button";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import {
  useGetSingleBlogQuery,
  useAddCommentMutation,
  useLikeBlogMutation,
  useLikeCommentMutation,
} from "../../redux/slices/BlogSlice";
import { toast } from "react-toastify";

function BlogDetails() {
  const { id } = useParams();
  const { data: blog, isLoading, error } = useGetSingleBlogQuery(id);
  const [addComment] = useAddCommentMutation();
  const [likeBlog] = useLikeBlogMutation();
  const [likeComment] = useLikeCommentMutation();

  const [newComment, setNewComment] = useState("");
  const [likedBlog, setLikedBlog] = useState(false);
  const [likedComments, setLikedComments] = useState({});

  useEffect(() => {
    if (blog) {
      setLikedBlog(blog.isLiked || false);
      const initialLikedComments = {};
      blog.comments.forEach((comment) => {
        initialLikedComments[comment._id] = comment.isLiked || false;
      });
      setLikedComments(initialLikedComments);
    }
  }, [blog]);

  if (isLoading) return <h2>Loading...</h2>;
  if (error) return <h2>Error fetching blog</h2>;
  if (!blog) return <h2>Blog not found</h2>;

  const handleLikeBlog = async () => {
    try {
      await likeBlog({ blogId: id }).unwrap();
      setLikedBlog(!likedBlog);
    } catch (error) {
      toast.error(error.data?.message || "Failed to like blog!", {
        position: "top-center",
      });
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      await likeComment({ blogId: id, commentId }).unwrap();
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: !prev[commentId],
      }));
    } catch (error) {
      toast.error(error.data?.message || "Failed to like comment!", {
        position: "top-center",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty!", { position: "top-center" });
      return;
    }

    try {
      await addComment({ blogId: id, commentText: newComment }).unwrap();
      setNewComment("");
    } catch (error) {
      toast.error(error.data?.message || "Failed to add comment!", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="bg-[#fff]">
      <div className="mx-4 py-10">
        <h2 className="text-lg sm:text-2xl text-start font-bold mx-2 sm:w-[60%]">
          {blog?.title || "No title available"}
        </h2>
        {blog?.blogImage ? (
          <img
            src={blog.blogImage}
            alt="Blog Cover"
            className="mt-4 w-full h-96 object-cover"
          />
        ) : (
          <p>No image available</p>
        )}

        <div className="max-w-8xl mx-auto py-10">
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4 sm:gap-0">
            <h2 className="text-lg sm:text-[20px]">
              {blog?.publishDate || "No date"}
            </h2>
            <h2 className="text-lg sm:text-[20px] md:mr-60 ">
              Category: {blog?.category || "Uncategorized"}
            </h2>
          </div>

          <div className="flex justify-between items-start mt-4 flex-col gap-4 sm:gap-4">
            <h2 className="md:text-2xl text-[18px] font-bold text-black pb-1">
              Description
            </h2>
            <p className="text-black text-lg sm:text-[18px]">
              {blog?.description || "No description available"}
            </p>
          </div>

          <button
            onClick={handleLikeBlog}
            className="flex items-center cursor-pointer gap-2 text-black text-sm mt-4"
          >
            {likedBlog ? (
              <FaHeart className="text-3xl text-red-500" />
            ) : (
              <CiHeart className="text-2xl" />
            )}
            Like Blog ({blog?.likes?.length || 0})
          </button>

          <div className="mt-3 p-2">
            <div className="w-full sm:w-6/12">
              <textarea
                className="w-full border rounded-md p-2 focus:outline-[#11110f] transition-all"
                rows="4"
                placeholder="Enter your comment here..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                text="Comment"
                bgHover="black"
                textHover="white"
                cutHover="white"
                onClick={handleAddComment}
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="px-2 bg-[#ffee0274] mt-3 p-4 rounded-md">
            <h3 className="text-lg font-bold">Comments:</h3>
            {blog?.comments?.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {blog.comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="p-4 rounded shadow-sm w-full bg-white"
                  >
                    <div className="flex justify-between w-full sm:w-4/12 mb-2">
                      <p className="text-xs text-gray-500">
                        {comment.date
                          ? new Date(comment.date).toLocaleString()
                          : "No date"}
                      </p>
                    </div>
                    <p className="text-gray-700">
                      {comment.text || "No comment text"}
                    </p>
                    <div className="flex justify-start gap-2 items-center">
                      <button
                        className="flex items-center gap-1 text-black text-sm mt-1"
                        onClick={() => handleLikeComment(comment._id)}
                      >
                        {likedComments[comment._id] ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <CiHeart className="mt-[6px]" />
                        )}
                        {comment?.likes?.length || 0} Likes
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;