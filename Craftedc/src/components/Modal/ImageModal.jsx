import React from "react";
import PropTypes from "prop-types";

/**
 * Reusable Image Modal Component
 *
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - URL of the image to be displayed
 * @param {function} props.onClose - Function to close the modal
 * @param {string} [props.alt='Enlarged product'] - Alt text for the image
 * @param {string} [props.className=''] - Additional CSS classes
 */
const ImageModal = ({
  imageUrl, // URL of the image to be displayed
  onClose, // Function to close the modal
  alt = "Enlarged product", // Optional alt text for image accessibility
  className = "", // Optional additional CSS classes for custom styling
}) => {
  // Add console log for debugging
  console.log("ImageModal received URL:", imageUrl);

  return (
    <div
      data-dialog-backdrop="image-modal"
      // Full screen overlay with black background and blur effect
      // Allows closing the modal by clicking outside
      className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 opacity-100 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose} // Closes modal when clicking outside
    >
      <div
        // Modal container with white background and shadow
        className="relative m-4 w-3/4 max-w-[800px] rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="relative border-0 p-0">
          {/* Close button positioned at top-right of modal */}
          <button
            onClick={onClose} // Closes the modal when clicked
            // Styling for close button: rounded, semi-transparent background
            className="absolute right-4 top-4 z-10 rounded-full bg-black bg-opacity-50 p-1 text-white transition-all hover:bg-opacity-75"
            aria-label="Close modal"
          >
            {/* SVG close icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3" // Smaller icon size
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Cross icon path */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Enlarged image */}
          <img
            alt={alt}
            // Responsive image sizing and styling
            className={`h-auto max-h-[80vh] w-full rounded-lg object-cover ${className}`}
            src={imageUrl} // Dynamic image source from props
          />
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
ImageModal.propTypes = {
  imageUrl: PropTypes.string.isRequired, //thses are required they generate errors during development about if the type passed is diffrent

  onClose: PropTypes.func.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

export default ImageModal;
