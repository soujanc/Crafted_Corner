import React from "react";

import Button from "../Buttons/Button";
export default function CTOsectio() {
  return (
    <section>
      <div className="relative w-fill lg:h-[464px] md:h-[300px] h-[300px] bg-cto bg-fixed bg-cover  bg-center flex flex-col gap-[24px] justify-center items-center ">
        <p class="hidden lg:block absolute top-20 left-50 font-poppins text-[60px] sm:text-[80px] md:text-[60px] lg:text-[120px] font-light sm:font-normal md:font-medium lg:font-normal leading-[60px] sm:leading-[70px] md:leading-[80px] lg:leading-[90px] tracking-[4.8px] bg-gradient-text bg-clip-text text-transparent">
          CRAFTED CORNER
        </p>
        <div className="flex flex-col gap-[8px] px-4">
          {" "}
          <h1 className="text-white text-center font-poppins text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] tracking-[0px] font-medium leading-[1.2]">
            Crafted just for you
          </h1>
          <p className="text-white text-center font-poppins text-[8px] sm:text-[8px] md:text-[10px] lg:text-[10px] font-light leading-[1.5] tracking-[0.4px] max-w-[300px] md:max-w-[550px] mx-auto">
            Discover timeless furniture crafted to elevate your spaces Where
            functionality meets unparalleled style.
          </p>
        </div>
        <Button text="Shop Now" size="variable" variant="filledWhite" />
      </div>
    </section>
  );
}
