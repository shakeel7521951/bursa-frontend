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
import Loader from "../../Loader";

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

  if (isLoading) return <Loader />;
  if (error) return <h2>Eroare la încărcarea blogului</h2>;
  if (!blog) return <h2>Blogul nu a fost găsit</h2>;

  const handleLikeBlog = async () => {
    try {
      await likeBlog({ blogId: id }).unwrap();
      setLikedBlog(!likedBlog);
    } catch (error) {
      toast.error(error.data?.message || "Eroare la aprecierea blogului!", {
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
      toast.error(error.data?.message || "Eroare la aprecierea comentariului!", {
        position: "top-center",
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error("Comentariul nu poate fi gol!", { position: "top-center" });
      return;
    }

    try {
      await addComment({ blogId: id, commentText: newComment }).unwrap();
      setNewComment("");
    } catch (error) {
      toast.error(error.data?.message || "Eroare la adăugarea comentariului!", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="bg-[#fff]">
      <div className="mx-4 py-10">
        <h2 className="text-lg sm:text-2xl text-start font-bold mx-2 sm:w-[60%]">
          {blog?.title || "Titlu indisponibil"}
        </h2>
        {blog?.blogImage ? (
          <img
            src={blog.blogImage}
            alt="Imagine de copertă"
            className="mt-4 w-full h-96 object-cover"
          />
        ) : (
          <p>Imagine indisponibilă</p>
        )}

        <div className="max-w-8xl mx-auto py-10">
          <div className="flex justify-between items-start flex-col sm:flex-row gap-4 sm:gap-0">
            <h2 className="text-lg sm:text-[20px]">
              {blog?.publishDate || "Data indisponibilă"}
            </h2>
            <h2 className="text-lg sm:text-[20px] md:mr-60 ">
              Categorie: {blog?.category || "Necategorizat"}
            </h2>
          </div>

          <div className="flex justify-between items-start mt-4 flex-col gap-4 sm:gap-4">
            <h2 className="md:text-2xl text-[18px] font-bold text-black pb-1">
              Descriere
            </h2>
            <p className="text-black text-lg sm:text-[18px]">
              {blog?.description || "Descriere indisponibilă"}
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
            Apreciază blogul ({blog?.likes?.length || 0})
          </button>

          <div className="mt-3 p-2">
            <div className="w-full sm:w-6/12">
              <textarea
                className="w-full border rounded-md p-2 focus:outline-[#11110f] transition-all"
                rows="4"
                placeholder="Scrie un comentariu aici..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button
                text="Comentează"
                bgHover="black"
                textHover="white"
                cutHover="white"
                onClick={handleAddComment}
              />
            </div>
          </div>

          <hr className="my-4" />

          <div className="px-2 bg-[#ffee0274] mt-3 p-4 rounded-md">
            <h3 className="text-lg font-bold">Comentarii:</h3>
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
                          : "Dată indisponibilă"}
                      </p>
                    </div>
                    <p className="text-gray-700">
                      {comment.text || "Text comentariu indisponibil"}
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
                        {comment?.likes?.length || 0} Aprecieri
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                Nu există comentarii încă. Fii primul care comentează!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
