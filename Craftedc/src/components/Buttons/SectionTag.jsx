import React from "react";

/**
 * SectionTag Component
 * 
 * Renders a lightweight, responsive tag/label with customizable styling
 * 
 * @param {Object} props - Component properties
 * @param {string} props.text - The text to display inside the tag
 * @param {string} [props.className=''] - Additional CSS classes to customize the tag's appearance
 * @returns {JSX.Element} A styled tag/label component
 * 
 * @example
 * // Basic usage
 * <SectionTag text="New" />
 * 
 * @example
 * // With custom classes
 * <SectionTag 
 *   text="Featured" 
 *   className="bg-blue-100 text-blue-800" 
 * />
 */
export default function SectionTag({ text, className = "" }) {
  return (
    <div
      className={`
        w-fit
        inline-flex
        px-2 md:px-3
        py-[0.5px] lg:py-[1px]
        items-center
        gap-[8px] lg:gap-[11px]
        rounded-[20px] md:rounded-[26px]
        border-[1px] border-[#E2E2E2]
        bg-white
        ${className}
    `.trim()}
    >
      <p
        className="
        text-[#8B8B8B]
        font-poppins
        text-[8px] lg:text-[8px]
        font-light
        leading-[20px]
        tracking-[1.2px]
      "
      >
        {text}
      </p>
    </div>
  );
}