import React, { useEffect, useState } from "react";
import axios from "axios";
import JobCategoryForm from "../../../components/employer/job-category/JobCategoryForm";
import JobCategoryList from "../../../components/employer/job-category/JobCategoryList";
import JobCategoryDeleteModal from "../../../components/employer/job-category/JobCategoryDeleteModal";
import { toast } from "react-hot-toast";

export default function JobCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [formMode, setFormMode] = useState("add"); // add | edit
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // Vite API_URL
  const API_URL = import.meta.env.VITE_API_URL;

  // CSRF token function
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + "=")) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleBackToAdd = () => {
    setFormMode("add");
    setEditingCategoryId(null);
  };

  const handleEdit = (id) => {
    setEditingCategoryId(id);
    setFormMode("edit");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Fetch all job categories from the API
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/job/job-categories/`);
      console.log(res.data);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchCategoryDetail = async (id) => {
    try {
      const res = await axios.get(
        `${API_URL}/job/job-categories/detail/${id}/`
      );
      setSelectedCategory(res.data);
      setShowDetail(true);
    } catch (err) {
      console.error("Error fetching detail:", err);
    }
  };

  // Delete a job category by ID
  const handleDelete = async (id) => {
    if (!id) return;

    // variables csrfToken
    const csrfToken = getCookie("csrftoken");

    try {
      await axios.delete(`${API_URL}/job/job-categories/delete/${id}/`, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
      toast.success("✅ Category deleted!");
      setDeleteId(null);
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("❌ Error deleting category");
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      <div className="relative overflow-hidden">
        {/* ADD CATEGORY */}
        <div
          className={`transition-all duration-300 transform
      ${
        formMode === "add"
          ? "translate-x-0 opacity-100"
          : "-translate-x-full opacity-0 absolute inset-0"
      }`}
        >
          <JobCategoryForm
            onSuccess={() => {
              fetchCategories();
              setFormMode("add");
              setEditingCategoryId(null);
            }}
          />
        </div>

        {/* EDIT CATEGORY */}
        <div
          className={`transition-all duration-300 transform
      ${
        formMode === "edit"
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 absolute inset-0"
      }`}
        >
          <JobCategoryForm
            categoryId={editingCategoryId}
            onBack={handleBackToAdd}
            onSuccess={() => {
              fetchCategories();
              setFormMode("add"); // 👈 back to add
              setEditingCategoryId(null);
            }}
          />
        </div>
      </div>

      {/* ===== FLEX LAYOUT ===== */}
      <div
        className={`flex transition-all duration-300
    ${showDetail ? "gap-6" : "gap-0"}
  `}
      >
        {/* LEFT: CATEGORY LIST */}
        <div
          className={`transition-all duration-300
      ${showDetail ? "flex-3" : "flex-1"}
    `}
        >
          <JobCategoryList
            categories={categories}
            onDelete={(id) => setDeleteId(id)}
            onDetail={fetchCategoryDetail}
            onEdit={handleEdit}
          />
        </div>

        {/* RIGHT: DETAIL PANEL */}
        <div
          className={`transition-all duration-300 ease-in-out mt-16
    ${
      showDetail
        ? "flex-2 opacity-100 translate-x-0"
        : "flex-0 opacity-0 translate-x-full overflow-hidden"
    }
  `}
        >
          {showDetail && selectedCategory && (
            <div className="bg-white/30 rounded-2xl shadow-xl p-6 h-fit">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-darkblue">
                  Category Detail
                </h2>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-red-600 font-semibold"
                >
                  ✕
                </button>
              </div>

              <p className="mb-2">
                <strong>Name:</strong> {selectedCategory.name}
              </p>

              {selectedCategory.parent && (
                <p className="mb-2">
                  <strong>Parent:</strong> {selectedCategory.parent.name}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-4">
                Created at:{" "}
                {new Date(selectedCategory.created_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* JobCategoryDeleteModal */}
      <JobCategoryDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId)}
      />
    </div>
  );
}
