import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Header from "../../components/dashboard/common/Header";
import StatCard from "../../components/dashboard/common/StatCard";
import AdminBlogsSection from "../../components/dashboard/blogs/AdminBlogsSection";
import Button from "../../components/Button";
import BlogModal from "../../components/dashboard/blogs/BlogModal";
import { useGetAllBlogsQuery } from "../../redux/slices/BlogSlice";

const AdminBlogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = (data) => {
    console.log("Blog Data Submitted:", data);
  };

  return (
    <div className="flex-1 relative z-10 overflow-auto">
      <Header title="Blogs" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Blogs"
            icon={ShoppingBag}
            value={10}
            color="#6366F1"
          />
        </motion.div>

        <Button
          text="Add Blog"
          bgHover="black"
          textHover="white"
          cutHover="white"
          onClick={handleOpenModal}
        />
        <AdminBlogsSection />
      </main>

      <BlogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AdminBlogs;