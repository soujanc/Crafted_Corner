import React from "react";

export default function SectionSubText({ text }) {
  return (
    <div
      className="flex flex-shrink-0 w-full max-w-[320px]  sm:max-w-[320px] md:max-w-[300px] lg:max-w-[390px]"
      tabIndex={0}
      role="text"
    >
      <p className="text-[10px] lg:text-[11px] font-poppins font-light text-[#858585] leading-relaxed tracking-wider">
        {text}
      </p>
    </div>
  );
}
// color: #858585;

// font-family: Poppins;
// font-size: 12px;
// font-style: normal;
// font-weight: 400;
// line-height: 20px; /* 166.667% */
// letter-spacing: 0.24px;
