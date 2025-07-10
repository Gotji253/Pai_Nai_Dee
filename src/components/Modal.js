// components/Modal.js
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [animationClass, setAnimationClass] = useState('');
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  const titleId = `modal-title-${Math.random().toString(36).substring(2, 9)}`;
  const contentId = `modal-content-${Math.random().toString(36).substring(2, 9)}`;

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedElement.current = document.activeElement;
      setShouldRender(true);
      setAnimationClass('animate-scale-in');
      // Focus the modal itself or the first focusable element after a short delay for animation
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);
    } else {
      if (shouldRender) {
        setAnimationClass('animate-scale-out');
        const timer = setTimeout(() => {
          setShouldRender(false);
          previouslyFocusedElement.current?.focus();
        }, 200); // Duration of scale-out animation (must match CSS)
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      } else if (event.key === 'Tab' && isOpen && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) { // Shift + Tab
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else { // Tab
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  if (!shouldRender && !animationClass.includes('animate-scale-out')) {
    return null;
  }

  if (!isOpen && !animationClass.includes('animate-scale-out')) {
      return null;
  }

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center p-4 z-50 transition-opacity duration-200
                  ${isOpen && shouldRender ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'}`}
      aria-hidden={!isOpen} // Ensure it's hidden when not open
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={contentId}
        tabIndex={-1} // Make the modal itself focusable for initial focus
        className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto transform ${animationClass} transition-colors duration-300 outline-none`}
      >
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id={titleId} className="text-xl font-semibold text-gray-800 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-600 dark:text-slate-400" />
          </button>
        </div>
        <div id={contentId} className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
