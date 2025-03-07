import React from "react";
import SectionTag from "../Buttons/SectionTag";
import SectionHeadText from "../Typography/SectionHeadText";
import SectionSubText from "../Typography/SectionSubText";
import SGallerySlider from "../gallerysider/SGallerySlider";

export default function GallerySec() {
  return (
    <div className=" w-full h-max-[774px] px-[16px] sm:px-[40px] lg:px-[150px] py-[80px] lg:py-[150px]  items-center bg-white">
      <div className="flex flex-col gap-[24px] lg:gap-[32px] items-start">
        <SectionTag text={"gallery"} />
        <div className="flex flex-col gap-4 sm:flex-row  justify-between w-full mb-[16px] sm:mb-[32px]">
          <SectionHeadText
            text1={"Furniture That Speaks "}
            text2={" Elegance, "}
            strictlyStacked={true}
          />
          <SectionSubText
            text={
              "We believe that furniture is more than just a functional piece; it’s an expression of your style and personality. Every item we create is crafted with precision, designed to transform your space into a sanctuary of elegance."
            }
          />
        </div>
        <SGallerySlider />
      </div>
    </div>
  );
}
