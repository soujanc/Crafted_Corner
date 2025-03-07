import React from "react";

/**
 * SectionHeadText - A component for displaying two text elements with flexible layout options
 * @param {string} text1 - Primary text (displayed in deeper gray)
 * @param {string} text2 - Secondary text (displayed in lighter gray)
 * @param {boolean} stacked - If true, texts stack vertically on mobile and go horizontal on large screens
 * @param {boolean} strictlyStacked - If true, texts remain stacked vertically on all screen sizes
 * @param {string} text1Color - Custom color for text1 (defaults to deepgray)
 * @param {string} text2Color - Custom color for text2 (defaults to #8C8C8C)
 */
export default function SectionHeadText({
  text1,
  text2,
  stacked = false,
  strictlyStacked = false,
  text1Color = "text-deepgray",
  text2Color = "text-[#8C8C8C]",
}) {
  return (
    // Outer container with max width and vertical spacing
    <div className="flex flex-col gap-2 max-w-[600px]">
      {/* Inner container handling the layout logic */}
      <div
        className={`flex ${
          strictlyStacked
            ? "flex-col" // Always stack vertically
            : stacked
            ? "flex-col lg:flex-row" // Stack on mobile, horizontal on large screens
            : "flex-row" // Always horizontal
        } gap-[8px] md:gap-[10px]`}
      >
        {/* Primary text - customizable color */}
        <p className={`font-poppins font-[300] md:font-[400] lg:font-[500] text-[24px] lg:text-[28px] leading-[26px] ${text1Color}`}>
          {text1}
        </p>
        {/* Secondary text - customizable color */}
        <p className={`font-poppins font-[300] md:font-[400] lg:font-[500] text-[24px] lg:text-[28px] leading-[26px] ${text2Color}`}>
          {text2}
        </p>
      </div>
    </div>
  );
}
