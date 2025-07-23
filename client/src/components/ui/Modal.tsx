import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Optional title */}
        {title && (
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
            {title}
          </h2>
        )}

        {/* Modal Body */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
