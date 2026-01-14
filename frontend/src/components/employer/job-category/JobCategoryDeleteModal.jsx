import React from "react";

export default function JobCategoryDeleteModal({ isOpen, onClose, onConfirm }) {
  // Hide modal when not open
  if (!isOpen) return null;

  return (
    //  Modal backdrop
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="border border-yellowbutton/50 p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-darkblue">Confirm Delete</h2>
        <p className="mb-6 text-darkblue">
          Are you sure you want to delete this category? This action cannot be
          undone.
        </p>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-grayblack hover:text-darkblue border-grayblack/20 hover:bg-grayblack/20 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-yellowbutton text-darkblue hover:bg-hoveryellowbutton hover:text-darkblue-hover transition duration-300 ease-in-out"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
