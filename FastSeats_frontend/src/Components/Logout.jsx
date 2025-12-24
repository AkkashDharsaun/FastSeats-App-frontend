import React from "react";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* 🔹 BLUR BACKGROUND ONLY */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        onClick={onClose}
      />

      {/* 🔹 MODAL */}
      <div className="relative bg-white rounded-2xl shadow-2xl 
                      w-[90%] max-w-md p-6 animate-scaleIn">
        <h2 className="text-xl font-semibold text-gray-800">
          Confirm Logout
        </h2>

        <p className="text-gray-600 mt-3">
          Are you sure you want to logout?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300
                       text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600
                       text-white hover:bg-red-700 transition"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
