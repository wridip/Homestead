import React from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-lg shadow-lg p-6 w-full max-w-md m-4">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-200">
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
