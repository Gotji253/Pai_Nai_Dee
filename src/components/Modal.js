// components/Modal.js
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setAnimationClass('animate-scale-in');
    } else {
      // Only animate out if it was previously rendered (or is rendering)
      if (shouldRender) {
        setAnimationClass('animate-scale-out');
        const timer = setTimeout(() => {
          setShouldRender(false); // After animation, truly hide/unmount by parent
        }, 200); // Duration of scale-out animation (must match CSS)
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, shouldRender]);

  if (!shouldRender && !animationClass.includes('animate-scale-out')) {
    // If not rendering and not in the process of animating out, return null
    return null;
  }

  // Fallback if isOpen is false and we are not animating out (e.g. initial load and isOpen is false)
  if (!isOpen && !animationClass.includes('animate-scale-out')) {
      return null;
  }


  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center p-4 z-50 transition-opacity duration-200
                  ${isOpen && shouldRender ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`} // Backdrop opacity can remain same for dark/light
    >
      <div
        className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto transform ${animationClass} transition-colors duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <X size={24} className="text-gray-600 dark:text-slate-400" />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
