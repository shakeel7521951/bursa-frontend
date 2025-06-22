import React, { useState } from "react";
import { useGetAllBlogsQuery, useDeleteBlogMutation } from "../../../redux/slices/BlogSlice";
import UpdateProductModal from "./UpdateProductModel";
import { toast } from "react-toastify"; // Ensure you have react-toastify installed

const AdminBlogs = () => {
  const { data, isLoading, isError } = useGetAllBlogsQuery();
  const [deleteBlog] = useDeleteBlogMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  if (isLoading) return <div className="text-center">Se încarcă blogurile...</div>;
  if (isError) return <div className="text-center text-red-500">Eroare la încărcarea blogurilor.</div>;

  const blogs = data?.blogs || [];

  const handleOpenModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (blogId) => {
    setSelectedBlogId(blogId);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await deleteBlog({ blogId: selectedBlogId }).unwrap();
      toast.success(response.message);
      setDeleteModal(false);
    } catch (error) {
      toast.error(error.data?.message || "Ștergerea blogului a eșuat");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Secțiunea de administrare a blogurilor</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img src={blog.blogImage} alt={blog.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-xl font-bold">{blog.title}</h3>
              <p className="text-gray-600 text-sm">De {blog.author}</p>
              <div className="flex justify-between mt-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 cursor-pointer"
                  onClick={() => handleOpenModal(blog)}
                >
                  Actualizează
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                  onClick={() => handleOpenDeleteModal(blog._id)}
                >
                  Șterge
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#000000c4] bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p className="text-lg font-semibold mb-4">Ești sigur că vrei să ștergi acest blog?</p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 cursor-pointer"
                onClick={() => setDeleteModal(false)}
              >
                Anulează
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 cursor-pointer"
                onClick={handleDelete}
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {isModalOpen && (
        <UpdateProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} blog={selectedBlog} />
      )}
    </div>
  );
};

export default AdminBlogs;
