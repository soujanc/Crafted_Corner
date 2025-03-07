import React from "react";

export default function Featurepoints({
  point,
  subPoint,
  iconColor = "#4D4D4D",
  pointColor = "#4D4D4D",
  subPointColor = "#858585",
}) {
  return (
    <div className="hidden md:flex items-center gap-2 w-[389px]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`size-5 text-[${iconColor}]`}
      >
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>
      <div className="flex gap-1">
        <p
          className={`font-poppins text-[10px] lg:text-[12px] font-[500] tracking-[0.24px] leading-[16px] text-[${pointColor}]`}
        >
          {point}
        </p>
        <p
          className={`font-poppins text-[10px] lg:text-[12px] font-[300] tracking-[0.24px] leading-[16px] text-[${subPointColor}]`}
        >
          - {subPoint}
        </p>
      </div>
    </div>
  );
}
