import React from "react";

/**
 * Represents the properties for the ScetionColorTag component
 * 
 * @typedef {Object} ScetionColorTagProps
 * @property {string} [text="Color"] - Text label for the color indicator
 * @property {string} [color="#CCCCCC"] - Hex color code for the circular indicator
 * @property {string} [className=""] - Additional CSS classes for styling
 */

export default function ScetionColorTag({
  text = "blue",
  color = "#CCCCCC",
  className = "",
}) {
  return (
    <div
      className={`
      w-fit
      h-fit
      inline-flex
      px-2 md:px-2
      py-[0.5px] 
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
      text-[8px] lg:text-[10px]
      font-light
      leading-[20px]
      tracking-[1.2px]
    "
      >
        {text}
      </p>
      <div
        className="w-[12px] h-[12px] rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
