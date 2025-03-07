/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        slide: {
          "0%, 25%": { transform: "translateY(0%)" },
          "30%, 50%": { transform: "translateY(-25%)" },
          "55%, 75%": { transform: "translateY(-50%)" },
          "80%, 100%": { transform: "translateY(-75%)" },
        },
        swipe: {
          "0%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
          "50%": {
            transform: "translate(-50px, 15px) rotate(-30deg)",
          },
          "100%": {
            transform: "translate(0, 0) rotate(0deg)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideOut: {
          "0%": {
            transform: "translateY(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(-20px)",
            opacity: "0",
          },
        },
      },
      animation: {
        slide: "slide 4s ease-in-out infinite",
        fadein: "fade-in 0.3s ease-out",
        pulseglow: "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        slideIn: "slideIn 0.5s ease-out forwards",
        slideOut: "slideOut 0.4s ease-out forwards",
        swipe: "swipe 1.5s ease-in-out infinite",
      },

      backgroundImage: {
        header: "url('/Images/HEADER.png')", // Path from public folder
        FloaterTagImg: "url('/Images/FloaterImgTag.png')", // Path from public folder
        AboutSecImg1: "url('/Images/AboutSecImg1.png')", // Path from public folder
        AboutSecImg2: "url('/Images/AboutSecImg2.png')", // Path from public folder
        image1: "url('/Images/image1.jpg')",
        image2: "url('/Images/image2.jpg')",
        image3: "url('/Images/image3.jpg')",
        image4: "url('/Images/image4.jpg')",
        image5: "url('/Images/image5.jpg')",
        cto: "url('/Images/CTO.jpg')",

        blured: "url('/Images/blurred.png')",
        pro: "url('/Images/pro.jpg')",
        "gradient-text":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(135, 132, 132, 0.00) 100%)",
      },

      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        deepgray: "#4d4d4d ",
        chalkwhite: "#ededed", // Add your custom color here
        sectiongray: "#f5f5f5",
      },
      boxShadow: {
        smoothshadow:
          "-181px 127px 62px 0px rgba(0, 0, 0, 0.00), -116px 81px 57px 0px rgba(0, 0, 0, 0.01), -65px 46px 48px 0px rgba(0, 0, 0, 0.05), -29px 20px 35px 0px rgba(0, 0, 0, 0.09), -7px 5px 19px 0px rgba(0, 0, 0, 0.10)",
        custom:
          "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px", // Force Material Tailwind to use this breakpoint
        xl: "1280px",
        "2xl": "1536px",
      },
      scrollbar: {
        hide: {
          "-ms-overflow-style": "none", // IE and Edge
          "scrollbar-width": "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, and Opera
          },
        },
      },
    },
  },
  plugins: [
    require("daisyui"),

    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],
});
