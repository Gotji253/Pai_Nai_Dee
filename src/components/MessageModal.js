// components/MessageModal.js
import React from 'react';
import Modal from './Modal';
import { X, CheckCircle, Info } from 'lucide-react';

const MessageModal = ({ isOpen, onClose, message, type = 'info' }) => {
  const icon = {
    info: <Info size={48} className="text-blue-500" />,
    success: <CheckCircle size={48} className="text-green-500" />,
    error: <X size={48} className="text-red-500" />,
  }[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col items-center justify-center text-center py-4">
        {icon} {/* Icon colors are semantic, likely no change needed for dark mode */}
        <p className="mt-4 text-lg text-gray-700 dark:text-slate-200 transition-colors duration-300">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-full shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-300"
        >
          ตกลง
        </button>
      </div>
    </Modal>
  );
};

export default MessageModal;
