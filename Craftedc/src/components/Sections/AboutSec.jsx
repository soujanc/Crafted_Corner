import React from "react";
// Importing custom components and Framer Motion for animations
import SectionTag from "../Buttons/SectionTag";
import SectionHeadText from "../Typography/SectionHeadText";
import SectionSubText from "../Typography/SectionSubText";
import FloaterImgTag from "../Typography/FloaterImgTag";
import Button from "../Buttons/Button";
import Featurepoints from "../Typography/Featurepoints";
import { motion } from "framer-motion";

export default function AboutSec() {
  return (
    <section>
      {/* Main container with responsive padding and background */}
      <div className="w-fill h-max-[774px] px-[16px] sm:px-[40px] lg:px-[150px] py-[80px] lg:py-[150px] items-center bg-sectiongray">
        {/* Flex container for two main columns - content and images */}
        <div className="flex flex-col-reverse gap-8 sm:gap-12 md:gap-0 md:flex-row justify-between">
          {/* Left column - Content section */}
          <div className="w-full md:w-1/2 flex flex-col gap-6 sm:gap-8 md:gap-[64px] justify-center items-center md:items-start text-center md:text-left">
            <div className="flex flex-col gap-4 md:gap-[24px] lg:gap-[32px] items-center md:items-start">
              {/* Section header components */}
              <SectionTag text="About Us" />
              <SectionHeadText
                text1="Why Choose Crafted"
                text2="Corner"
                stacked={true}
              />
              {/* Description text */}
              <SectionSubText text="At Crafted Corner, we blend traditional craftsmanship with modern design sensibilities. Our commitment to quality, attention to detail, and customer satisfaction sets us apart in delivering exceptional handcrafted furniture and home decor pieces." />

              {/* Features and CTA button container */}
              <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 lg:gap-[56px]">
                {/* Feature points list */}
                <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-[28px]">
                  <Featurepoints
                    point="Fast delivery"
                    subPoint="quick and reliable service"
                  />
                  <Featurepoints
                    point="Fast delivery"
                    subPoint="quick and reliable service"
                  />
                  <Featurepoints
                    point="Fast delivery"
                    subPoint="quick and reliable service"
                  />
                </div>
                {/* Call-to-action button */}
                <Button
                  text="Get Started"
                  icon={true}
                  variant="outlinedBlack"
                  size="variable"
                  display="flex"
                />
              </div>
            </div>
          </div>

          {/* Right column - Images section */}
          <div className="relative flex justify-center md:justify-start gap-2 sm:gap-3 md:gap-[12px]">
            {/* Floating tag overlay on images */}
            <FloaterImgTag
              text1="Best In-Class"
              text2="Craftmanship"
              top="24px"
              left="-50px"
              className="hidden md:block"
            />
            {/* Main large image with hover effect */}
            <div className="w-full h-[450px] md:w-[280px] md:h-[390px] lg:w-[399px] lg:h-[557px] overflow-hidden">
              <div className="w-full h-full bg-AboutSecImg1 bg-cover bg-center transition-transform duration-1000 hover:br hover:scale-110"></div>
            </div>

            {/* Secondary image (hidden on mobile) with hover effect */}
            <div className="w-[117px] hidden md:block h-[390px] lg:w-[167px] lg:h-[557px] overflow-hidden">
              <motion.div className="w-full h-full bg-AboutSecImg2 bg-cover bg-center transition-transform duration-1000 hover:scale-110"></motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
