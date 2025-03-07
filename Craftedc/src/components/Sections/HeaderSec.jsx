// Import necessary components and dependencies
import React from "react";
import Button from "../Buttons/Button";
import Nabvar from "../NabVbar/Nabvar";

export default function HeaderSec() {
  return (
    <header>
      {/* Full-width header with background image - 837px height */}
      <div
        id="header"
        className="w-fill relative min-h-[837px] bg-header bg-cover bg-center"
      >
        <Nabvar />

        {/* Tagline - Desktop only */}
        <p className="absolute top-[200px] hidden w-full max-w-[375px] text-left font-poppins text-[9px] font-[200] leading-[16px] tracking-[0.8px] text-[#C9C9C9] md:left-[100px] md:top-[180px] lg:left-[150px] lg:top-[265px] lg:block lg:text-[10px]">
          Discover timeless furniture crafted to elevate your spaces Where
          functionality meets unparalleled style.
        </p>

        {/* Bottom content wrapper - Contains heading and CTA buttons */}
        <div className="absolute bottom-[60px] flex w-full flex-col justify-between gap-[20px] px-[20px] sm:px-[40px] lg:bottom-[180px] lg:flex-row lg:gap-0 lg:px-[150px]">
          {/* Left section - Heading and subtitle */}
          <div className="flex flex-col gap-[12px]">
            {/* Subtitle with decorative line */}
            <div className="inline-flex items-center gap-[12px]">
              <div className="w-[124px] border-t-[0.1px] border-[#dddddd]"></div>
              <p className="text-' [8px] h-[11px] w-[119px] font-poppins text-[10px] font-[200] leading-[12px] tracking-[0.9px] text-[#dddddd] lg:text-[12px]">
                Urban living
              </p>
            </div>

            {/* Main heading - Split into two lines for styling */}
            <div className="inline-flex flex-col gap-[6px]">
              <p className="font-poppins text-[40px] font-[200] leading-[50px] tracking-[1px] text-white lg:text-[44px] lg:font-[300] lg:tracking-[1.48px]">
                Reinventing Interior
              </p>
              <p className="font-poppins text-[40px] font-[200] leading-[50px] tracking-[1px] text-[#CCCCCC] lg:text-[44px] lg:font-[300] lg:tracking-[1.48px]">
                Designs
              </p>
            </div>
          </div>

          {/* Right section - CTA buttons */}
          <div className="flex items-end gap-[20px]">
            <Button
              text=" EXPLORE "
              display="flex"
              variant="filledWhite"
              size="variable"
            />
            <Button
              text="SHOP NOW"
              display="flex"
              variant="outlinedWhite"
              size="variable"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
