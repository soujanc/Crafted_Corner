import React, { useState } from 'react';

const Modal = ({ 
  title, 
  children, 
  trigger,
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const variantStyles = {
    default: {
      header: 'text-gray-700',
      confirmButton: 'bg-blue-500 hover:bg-blue-600 text-white',
      cancelButton: 'border border-gray-200 text-gray-600 hover:bg-gray-50'
    },
    destructive: {
      header: 'text-red-700',
      confirmButton: 'bg-red-500 hover:bg-red-600 text-white',
      cancelButton: 'border border-gray-200 text-gray-600 hover:bg-gray-50'
    }
  };

  const styles = variantStyles[variant];

  if (!trigger) return null;

  const triggerComponent = trigger({
    onClick: openModal
  });

  return (
    <>
      {triggerComponent}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className={`text-[14px] font-medium ${styles.header}`}>
                {title}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {children({ 
              closeModal, 
              isOpen,
              styles 
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
