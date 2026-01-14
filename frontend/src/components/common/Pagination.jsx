import React from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  // Skip rendering if pagination is not needed (0 or 1 page)
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6 gap-2 select-none">

      {/* Prev Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md border border-yellowbutton transition duration-300 ease-in-out 
          ${currentPage === 1
            ? "bg-transparent text-darkblue/50 cursor-not-allowed"
            : "bg-transparent hover:bg-yellowbutton text-darkblue cursor-pointer"
          }`}
      >
        Prev
      </button>

      {/* Page number buttons */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        const isActive = currentPage === page;

        return (
          <button
            key={i}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border border-yellowbutton cursor-pointer hover:text-darkblue-hover hover:bg-hoveryellowbutton 
              ${isActive
                ? "bg-yellowbutton text-darkblue border-yellowbutton"
                : "bg-transparent text-darkblue"
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md border border-yellowbutton transition duration-300 ease-in-out 
          ${currentPage === totalPages
            ? "bg-transparent text-darkblue/50 cursor-not-allowed"
            : "bg-transparent hover:bg-yellowbutton text-darkblue cursor-pointer"
          }`}
      >
        Next
      </button>

    </div>
  );
}
