// src/components/Preloader/Preloader.jsx
import React, { useState, useEffect } from "react";

const Preloader = ({ onComplete }) => {
  const [percentage, setPercentage] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  const [iconTranslate, setIconTranslate] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const icons = [
    () => (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700"
      >
        <path
          d="M4 7L4 17"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M1 7L23 7"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M4 10L20 10"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M20 7L20 17"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    ),
    () => (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700"
      >
        <path
          d="M2 16L2 19"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M4 9V7C4 5.89543 4.89543 5 6 5L18 5C19.1046 5 20 5.89543 20 7V9"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M20 9C18.8954 9 18 9.89543 18 11V13H6V11C6 9.89543 5.10457 9 4 9C2.89543 9 2 9.89543 2 11V17H22V11C22 9.89543 21.1046 9 20 9Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M22 16L22 19"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    ),
    () => (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700"
      >
        <path
          d="M6.87172 3.42759L4.23172 12.2276C4.11623 12.6126 4.4045 13 4.80642 13L19.1936 13C19.5955 13 19.8838 12.6126 19.7683 12.2276L17.1283 3.42759C17.0521 3.1738 16.8185 3 16.5536 3L7.44642 3C7.18145 3 6.94786 3.1738 6.87172 3.42759Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M12 17L12 15"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M8.6 21H15.4C15.7314 21 15.9949 20.7315 15.9423 20.4043C15.763 19.2896 15.0263 17 12 17C8.97369 17 8.23702 19.2896 8.0577 20.4043C8.00506 20.7315 8.26863 21 8.6 21Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    ),
    () => (
      <svg
        width="24px"
        height="24px"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700"
      >
        <path
          d="M21 14H3"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M3 8H21"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M11 17H13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M11 11H13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M11 5H13"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M21 2.6V19.4C21 19.7314 20.7314 20 20.4 20H3.6C3.26863 20 3 19.7314 3 19.4V2.6C3 2.26863 3.26863 2 3.6 2H20.4C20.7314 2 21 2.26863 21 2.6Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M17.5 20V22"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M6.5 20V22"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    ),
    () => (
      <svg
        width="24px"
        height="24px"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700"
      >
        <path
          d="M9 14L8 14"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M16 14L15 14"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M12 2H20.4C20.7314 2 21 2.26863 21 2.6V21.4C21 21.7314 20.7314 22 20.4 22H12M12 2H3.6C3.26863 2 3 2.26863 3 2.6V21.4C3 21.7314 3.26863 22 3.6 22H12M12 2V22"
          stroke="currentColor"
          stroke-width="1.5"
        ></path>
      </svg>
    ),
    () => (
      <svg
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-700"
      >
        <path
          d="M4 18L4 21"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M5 10V5C5 3.89543 5.89543 3 7 3L17 3C18.1046 3 19 3.89543 19 5V10"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M19.5 10C18.1193 10 17 11.1193 17 12.5V14H7V12.5C7 11.1193 5.88071 10 4.5 10C3.11929 10 2 11.1193 2 12.5C2 13.7095 2.85888 14.7184 4 14.95V18H20V14.95C21.1411 14.7184 22 13.7095 22 12.5C22 11.1193 20.8807 10 19.5 10Z"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
        <path
          d="M20 18L20 21"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
    ),
  ];

  useEffect(() => {
    /**
     * Manages icon cycling and loading percentage for the preloader
     *
     * @description This effect handles two primary animations:
     * 1. Cyclic icon rotation
     * 2. Progressive loading percentage
     *
     * Icon Cycling Mechanism:
     * - Rotates through icons at a fixed interval (1200ms)
     * - Each icon transition involves a slide-out and slide-in animation
     * - Uses setIconTranslate to trigger visual transition
     * - Ensures smooth icon replacement with a 400ms transition delay
     *
     * Loading Percentage Mechanism:
     * - Incrementally increases percentage from 0 to 100
     * - Uses a small interval (60ms) for smooth progression
     * - Triggers completion sequence when 100% is reached
     *
     * Completion Sequence:
     * - Stops all intervals
     * - Sets isComplete state
     * - Calls onComplete callback to signal preloader finish
     *
     * @fires setIconTranslate - Triggers icon transition animation
     * @fires setCurrentIcon - Rotates through available icons
     * @fires setPercentage - Increments loading progress
     * @fires setIsComplete - Marks preloader as finished
     *
     * @returns {Function} Cleanup function to clear intervals
     */
    const iconInterval = setInterval(() => {
      // Trigger icon transition animation
      setIconTranslate(true);

      // Wait before changing icon to allow transition
      setTimeout(() => {
        setCurrentIcon((prevIcon) => (prevIcon + 1) % icons.length);
        setIconTranslate(false);
      }, 400);
    }, 1200);

    // Loading percentage progression
    const interval = setInterval(() => {
      setPercentage((prevPercentage) => {
        if (prevPercentage >= 100) {
          // Cleanup and completion sequence
          clearInterval(interval);
          clearInterval(iconInterval);

          setIsComplete(true);
          onComplete();

          return 100;
        }
        return prevPercentage + 1;
      });
    }, 60);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(iconInterval);
    };
  }, [onComplete]);
  return (
    <div className="duration-5000 fixed inset-0 z-50 flex w-full items-center justify-center bg-white opacity-100 transition-opacity ease-out">
      <div className="flex flex-col items-center justify-center">
        <div
          className={`icon-container mb-4 ${
            iconTranslate
              ? "animate-slideOut" // Slide out animation
              : "animate-slideIn" // Slide in animation
          } ${isComplete ? "animate-slideOut" : ""}`}
        >
          {icons[currentIcon]()}
        </div>

        <div className="mb-2 h-0.5 w-60 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-0.5 rounded-full bg-gray-700 transition-all duration-200"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-normal mb-1 font-poppins text-[10px] tracking-wider text-gray-500">
          Hold tight, magic is happening......
        </p>
      </div>
    </div>
  );
};

export default Preloader;
