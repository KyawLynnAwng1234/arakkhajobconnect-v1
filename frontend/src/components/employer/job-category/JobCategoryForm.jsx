import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import usePageTitle from "../../../hooks/usePageTitle";

export default function JobCategoryForm({ onSuccess, categoryId, onBack }) {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  // Page Title (Add/Edit)
  usePageTitle(
    categoryId
      ? `${categoryName || "Edit Category"} | Edit`
      : "Add Job Category"
  );

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [categoryId]);

  // Edit detail load
  useEffect(() => {
    if (categoryId) {
      axios
        .get(`${API_URL}/job/job-categories/detail/${categoryId}/`)
        .then((res) => setCategoryName(res.data.name))
        .catch((err) => console.error("Error fetching detail:", err));
    }
  }, [categoryId]);

  // (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    setLoading(true);

    // CSRF token from cookies
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
    const csrftoken = getCookie("csrftoken");

    try {
      // Update mode
      if (categoryId) {
        await axios.put(
          `${API_URL}/job/job-categories/update/${categoryId}/`,
          { name: categoryName },
          {
            headers: { "X-CSRFToken": csrftoken },
            withCredentials: true,
          }
        );
        toast.success("Category updated!");
      }
      //Create mode
      else {
        await axios.post(
          `${API_URL}/job/job-categories/create/`,
          { name: categoryName },
          {
            headers: { "X-CSRFToken": csrftoken },
            withCredentials: true,
          }
        );
        toast.success("Category created!");
      }
      setCategoryName("");
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Error saving:", err);
      // Backend validation error
      if (err.response?.data?.name) {
        toast.error(err.response.data.name[0]);
      } else {
        toast.error("Category name is the same");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/30 p-6 rounded-2xl shadow-xl"
    >
      <div className="flex items-center mb-4 gap-6">

        {/* Back button (Edit mode only) */}
        {categoryId && (
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-blue-600 font-semibold hover:underline"
          >
            ← Back
          </button>
        )}

        <h2 className="text-xl text-darkblue font-bold">
          {categoryId ? "Edit Category" : "Add Category"}
        </h2>
      </div>

      {/* frontend error */}
      {error && (
        <p className="text-red-600 text-sm mb-1 font-medium">{error}</p>
      )}

      {/* Name */}
      <input
        type="text"
        value={categoryName}
        onChange={(e) => {
          setCategoryName(e.target.value);
          setError("");
        }}
        className={`border rounded-md px-4 py-2 w-full mb-4 text-darkblue focus:outline-none ${
          error ? "border-red-500" : "border-grayblack/30"
        }`}
        placeholder="Category name"
      />

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-yellowbutton hover:bg-hoveryellowbutton text-darkblue hover:text-darkblue-hover transition duration-300 ease-in-out font-semibold px-8 py-2 rounded-xl cursor-pointer"
      >
        {loading ? "Saving..." : categoryId ? "Update" : "Add"}
      </button>
    </form>
  );
}
