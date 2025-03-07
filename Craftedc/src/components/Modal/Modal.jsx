import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'; // Add PropTypes for type checking

export default function Modal({
  children,
  trigger: TriggerComponent,
  title = "Modal",
  onClose,
}) {
  // State to manage modal's DOM presence and visibility
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Function to open the modal with smooth transition
  const openModal = () => {
    setIsOpen(true);
    // Slight delay ensures CSS transition is applied smoothly
    setTimeout(() => setIsVisible(true), 10);
  };

  // Function to close the modal with fade-out effect
  const closeModal = () => {
    setIsVisible(false);
    // Wait for transition to complete before removing from DOM
    setTimeout(() => {
      setIsOpen(false);
      // Call optional callback when modal closes
      onClose && onClose();
    }, 300);
  };

  return (
    <>
      {/* Render trigger component if provided */}
      {TriggerComponent && <TriggerComponent onClick={openModal} />}{" "}
      {/* paasing this propwhich is rendered in profile page*/}
      {/* Render modal only when isOpen is true */}
      {isOpen && (
        <dialog
          open
          // CSS classes for modal positioning and styling
          className={`
            modal 
            modal-bottom 
            sm:modal-middle 
            fixed 
            inset-0 
            z-50 
            flex 
            items-center 
            justify-center 
        
            backdrop-blur-sm 
            transform 
            transition-all 
            duration-300 
            ease-in-out
            ${
              // Conditional classes for backdrop visibility
              isVisible
                ? "bg-black/30 backdrop-blur-sm"
                : "bg-black/0 backdrop-blur-0"
            }
          `}
          // Close modal when clicking on backdrop
          onClick={(e) => {
            // Close modal if clicking outside of modal content
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            // CSS classes for modal content styling and transitions
            className={`
               modal-box 
              w-full 
              max-w-md 
              rounded-md 
              bg-white 
              p-0 
              shadow-xl 
              transform 
              transition-all 
              duration-300 
              ease-in-out
              scale-95 
              opacity-0
              ${isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"}
            `}
            // Prevent modal from closing when clicking inside content
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b bg-[#FAFAFA] border-gray-200 p-4">
              <h3 className="text-[16px] font-medium  text-[#4D4D4D]">
                {title}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              {/* Support both function and regular children */}
              {typeof children === "function"
                ? children({ closeModal })
                : children}
            </div>

            {/* Modal Actions */}
          </div>
        </dialog>
      )}
    </>
  );
}

// Add PropTypes for type checking and documentation
Modal.propTypes = {
  // Children can be a node (React element) or a function
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func
  ]).isRequired, // Children are required

  // Trigger component is optional, but should be a component if provided
  trigger: PropTypes.elementType,

  // Title is optional, defaults to "Modal"
  title: PropTypes.string,

  // onClose is an optional function
  onClose: PropTypes.func
};
