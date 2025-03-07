import React from "react";
import PropTypes from "prop-types";

export default function FloaterImgTag({
  text1,
  text2,
  top = "0px",
  left = "0px",
}) {
  return (
    <div
      className="hidden md:inline-flex absolute z-50   pl-[4px] pr-[14px] py-[4px] gap-[23px] items-center bg-white shadow-smoothshadow"
      style={{ top, left }}
    >
      <div className="w-[39px] h-[39px] bg-FloaterTagImg bg-cover bg-center"></div>
      <div className="flex flex-row gap-1">
        <p className="text-[8px] font-poppins font-light text-[#262626] leading-[18px] tracking-[0.48px]">
          {text1}{" "}
        </p>
        <p className="text-[8px] font-poppins font-medium text-[#636363] leading-[18px] tracking-[0.48px]">
          {text2}
        </p>
      </div>
    </div>
  );
}

FloaterImgTag.propTypes = {
  text1: PropTypes.string.isRequired,
  text2: PropTypes.string.isRequired,
  top: PropTypes.string,
  left: PropTypes.string,
};

// display: inline-flex;
// padding: 4px 14px 4px 4px;
// align-items: center;
// gap: 23px;
// Style

// background: #FFF;

// box-shadow: -181px 127px 62px 0px rgba(0, 0, 0, 0.00), -116px 81px 57px 0px rgba(0, 0, 0, 0.01), -65px 46px 48px 0px rgba(0, 0, 0, 0.05), -29px 20px 35px 0px rgba(0, 0, 0, 0.09), -7px 5px 19px 0px rgba(0, 0, 0, 0.10);
