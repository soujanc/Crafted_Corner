import React, { useRef, useEffect, useState } from "react";
import Button from "../Buttons/Button";
import { useNavigate } from "react-router-dom";
import {
  Navbar,
  MobileNav,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
export default function Nabvar() {
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  // State for mobile navigation menu and scroll detection
  const [openNav, setOpenNav] = useState(false); //opening and closing of the three lined button in the corner
  const [scrolled, setScrolled] = useState(false); //sets true when screen is scrolled

  useEffect(() => {
    // Create a media query that checks if screen width is at least 1024px (desktop)
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    // This function runs whenever the screen size changes
    const handleMediaChange = (e) => {
      // e.matches will be true if screen width >= 1024px
      // e.matches will be false if screen width < 1024px
      if (e.matches) {
        // If we're on desktop view, ensure mobile menu is closed
        setOpenNav(false);
      }
    };

    // Add listener to detect screen size changes
    mediaQuery.addEventListener("change", handleMediaChange);

    // Check initial screen size when component mounts
    if (mediaQuery.matches) {
      //at start of the page this happens later whenever scrolled the handlemediachange is triggered later unmounted
      setOpenNav(false);
    }

    // Cleanup: Remove event listener when component unmounts
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    // Function to check how far the page has been scrolled
    const handleScroll = () => {
      // Update scrolled state to true if we've scrolled more than 10px
      // This is used to change navbar appearance on scroll
      setScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    // Cleanup: Remove scroll listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this runs once on mount

  const navList = //list of items displayed on top like shop about etc
    (
      <ul className="mb-[12px] mt-[10px] flex flex-col justify-between gap-4 text-[12px] text-base font-medium leading-[14.44px] tracking-[1.48px] lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-poppins text-[8px] font-[300] leading-none tracking-[1.5px] text-chalkwhite hover:text-white lg:text-[10px]"
        >
          <a href="#" className="flex items-center">
            Shop
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="leading-nonermal p-1 font-poppins text-[8px] font-[300] tracking-[1.5px] text-chalkwhite hover:text-white lg:text-[10px]"
        >
          <a href="#" className="flex items-center">
            About
          </a>
        </Typography>
        <Typography
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-poppins text-[8px] font-[300] leading-none tracking-[1.5px] text-chalkwhite hover:text-white lg:text-[10px]"
        >
          <a href="#" className="flex items-center">
            Contact Us
          </a>
        </Typography>
        <Typography
          as="li"
          onClick={() => navigate("/cart")}
          variant="small"
          color="blue-gray"
          className="p-1 font-poppins text-[8px] font-[300] leading-none tracking-[1.5px] text-chalkwhite hover:text-white lg:hidden lg:text-[10px]"
        >
          <a href="#" className="flex items-center">
            Cart
          </a>
        </Typography>
        <Typography
          as="li"
          onClick={() => navigate("/profile")}
          variant="small"
          color="blue-gray"
          className="p-1 font-poppins text-[8px] font-[300] leading-none tracking-[1.5px] text-chalkwhite hover:text-white lg:hidden lg:text-[10px]"
        >
          <a href="#" className="flex items-center">
            Profile
          </a>
        </Typography>
        <li>
          <div className="mb-2 flex gap-3 lg:hidden">
            {" "}
            {/*here we arranged buttons int row which is only displayed in small mobile opnenave*/}{" "}
            {/* Added flex and gap */}
            <a
              href="#_"
              className="whitespace-no-wrap items-center justify-center rounded-full border-[1.8px] border-transparent bg-deepgray px-6 py-[8px] font-poppins text-[8px] font-[300] leading-[14.44px] tracking-[1.48px] text-white shadow-sm hover:border-deepgray hover:bg-transparent hover:text-deepgray focus:outline-none lg:flex"
              onClick={() => navigate("/login")}
            >
              Login
            </a>
            <a
              href="#_"
              className="whitespace-no-wrap items-center justify-center rounded-full border-[1.8px] border-transparent bg-deepgray px-6 py-[8px] font-poppins text-[8px] font-[300] leading-[14.44px] tracking-[1.48px] text-white shadow-sm hover:border-deepgray hover:bg-transparent hover:text-deepgray focus:outline-none lg:flex"
            >
              Sign up
            </a>
          </div>
        </li>
      </ul>
    );

  return (
    <Navbar
      ref={navbarRef} //ref that injects the custom css while scrolling
      blurred={false}
      shadow={false}
      className={`fixed left-0 top-0 z-[1000] h-max max-w-full rounded-none px-[40px] py-2 transition-all duration-300 lg:px-[150px] lg:py-2 ${
        openNav || scrolled
          ? "bg-white/20 bg-opacity-30 text-white backdrop-blur-md backdrop-saturate-50"
          : "bg-transparent text-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <a
          href="#"
          className="cursor-pointer py-1.5 font-poppins text-[20px] font-[600] tracking-[0.25px] text-[#EDEDED] transition-all duration-300 hover:text-white"
        >
          Crafted Corner
        </a>
        <div className="flex items-center">
          <div className="mr-4 hidden bg-transparent lg:block">{navList}</div>
        </div>
        <div>
          <div className="flex items-center gap-x-[16px]">
            <button
              className="ustify-center hidden items-center rounded-full bg-transparent p-2 text-white transition-colors duration-500 ease-in-out hover:bg-chalkwhite hover:text-deepgray focus:outline-none lg:flex"
              aria-label="Icon button"
              onClick={() => navigate("/cart")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-[22px] w-[22px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </button>
            <button
              className="hidden items-center justify-center rounded-full bg-transparent p-2 text-white transition-colors duration-500 ease-in-out hover:bg-chalkwhite hover:text-deepgray focus:outline-none lg:flex"
              aria-label="Icon button"
              onClick={() => navigate("/profile")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
                className="h-[22px] w-[22px]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>

            <Button
              text="Login"
              display="hidden"
              variant="filledWhite"
              size="variable"
              onClick={() => navigate("/login")}
            />
          </div>
          <IconButton
            variant="text" //this is the small three lined button that rotates into a x
            className="h-6 w-6 items-center text-inherit text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
            ripple={true}
            onClick={() => setOpenNav(!openNav)}
          >
            {openNav ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </IconButton>
        </div>
      </div>
      <Collapse open={openNav} className=" ">
        {" "}
        {/*collapse is the navbar that open p in moble screens vry importannt and reusable*/}
        {navList}
      </Collapse>
    </Navbar>
  );
}
