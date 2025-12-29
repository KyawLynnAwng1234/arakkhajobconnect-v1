import React, { useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../common/Pagination";

export default function JobCategoryList({ categories, onDelete, onDetail, onEdit, }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentItems = categories.slice(indexFirst, indexLast);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div className="mt-16 rounded-2xl shadow-xl bg-white/30 p-6">
      <h2 className="text-xl font-semibold text-darkblue mb-4">
        Category List
      </h2>

      <ul className="space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((cat) => (
            <li
              key={cat.id}
              className="px-5 py-3 border-t border-grayblack/30 flex justify-between items-center"
            >
              <span className="text-darkblue">{cat.name}</span>
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => onDetail(cat.id)}
                  className="text-blue-600 underline hover:no-underline"
                >
                  Detail
                </button>
                <button
                  onClick={() => onEdit(cat.id)}
                  className="text-green-600 underline hover:no-underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(cat.id)}
                  className="text-red-600 underline hover:no-underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-graycustom">No categories found</p>
        )}
      </ul>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
