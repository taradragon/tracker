
import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out" onClick={onClose}>
      <div 
        className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
        style={{animationName: 'modalShowAnim', animationDuration: '0.3s', animationFillMode: 'forwards'}}
      >
        <style>
          {`
            @keyframes modalShowAnim {
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}
        </style>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-sky-400">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
