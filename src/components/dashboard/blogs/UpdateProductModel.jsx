import React, { useState } from "react";
import { toast } from "react-toastify";
import { useUpdateBlogMutation } from "../../../redux/slices/BlogSlice";

const UpdateProductModal = ({ isOpen, onClose, blog }) => {
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    author: blog?.author || "",
    description: blog?.description || "",
    blogImage: null,
    previewImage: blog?.blogImage || null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        blogImage: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("author", formData.author);
      formDataToSend.append("description", formData.description);
      if (formData.blogImage) formDataToSend.append("blogImage", formData.blogImage);

      const response = await updateBlog({ blogId: blog._id, data: formDataToSend }).unwrap();
      toast.success(response.message);
      onClose();
    } catch (error) {
      toast.error(error.data?.message || "Error updating blog");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#000000a4] bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[440px] h-auto">
        <h2 className="text-xl font-bold my-4">Update Blog</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border mb-2" required />
          <input name="author" value={formData.author} onChange={handleChange} className="w-full p-2 border mb-2" required />
          <input name="blogImage" type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border mb-2" />
          {formData.previewImage && <img src={formData.previewImage} alt="Preview" className="w-full h-32 object-cover rounded mb-2" />}
          <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border mb-2" required />
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
