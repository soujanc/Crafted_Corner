import React from "react";
import { useState } from "react";
import SectionHeadText from "../Typography/SectionHeadText";
import SectionSubText from "../Typography/SectionSubText";
import Button from "../Buttons/Button";

export default function NewsletterSec() {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Subscribe");
  const handleClick = () => {
    setLoading(true);
    // Simulate a loading time of 3 seconds
    setTimeout(() => {
      setLoading(false);
      setButtonText("Subscribed"); // Update the button text after loading
    }, 3000);
  };
  return (
    <section>
      <div className="w-fill h-max-[531px] items-center bg-white px-[16px] py-[80px] sm:px-[40px] lg:px-[150px] lg:py-[150px]">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="flex w-fit flex-shrink-0 items-center justify-center gap-[12px]">
            <div className="hidden overflow-hidden md:block md:h-[140px] md:w-[360px] lg:h-[172px] lg:w-[382px]">
              <img
                src="../public/images/left1.png"
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                alt="furniture photo here"
              />
            </div>
            <div className="hidden h-[172px] w-[160px] overflow-hidden lg:block">
              <img
                src="../public/images/left2.png"
                className="h-full w-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                alt="furniture photo here"
              />
            </div>
          </div>
          <div className="flex flex-col gap-[20px] text-center md:text-left">
            <SectionHeadText text1="Subscribe to our" text2="Newsletter" />
            <SectionSubText text="Discover timeless furniture crafted to elevate your spaces Where functionality meets unparalleled style." />
            <div className="flex gap-2">
              <label className="input input-bordered flex h-[36px] flex-1 items-center gap-2 rounded-sm text-[#8C8C8C]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70 hover:opacity-100"
                >
                  <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                  <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                </svg>
                <input
                  type="text"
                  className="grow font-poppins text-[8px] font-light tracking-wide md:text-[10px] lg:text-[11px]"
                  placeholder="Enter your buisness email here"
                />
              </label>
              <Button
                text={buttonText}
                loading={loading}
                loadingText="Loading..."
                onClick={handleClick}
                variant="filledBlackNoHover"
                size="variable"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
