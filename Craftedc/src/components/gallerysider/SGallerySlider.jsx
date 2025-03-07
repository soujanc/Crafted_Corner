import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Keyboard, Mousewheel } from "swiper/modules";

export default function SGallerySlider() {
  /**
   * Reference to the main Swiper instance for slide control the larger one which is only slider in mobilescreens
   * @type {React.MutableRefObject<Swiper | null>}
   */
  const [swiperRef, setSwiperRef] = useState(null);

  const [showSwipeHint, setShowSwipeHint] = useState(true);

  /**
   * Reference to the secondary Swiper the middle swiper
   * @type {React.MutableRefObject<Swiper | null>}
   */
  const [secondSwiperRef, setSecondSwiperRef] = useState(null);

  /**
   * Reference to the tertiary Swiper instance the last slider to the right end
   * @type {React.MutableRefObject<Swiper | null>}
   */
  const [thirdSwiperRef, setThirdSwiperRef] = useState(null);
  // Memoize images to prevent unnecessary re-renders
  const images = useMemo(
    () => [
      { id: 1, name: "image1" },
      { id: 2, name: "image2" },
      { id: 3, name: "image3" },
      { id: 4, name: "image4" },
      { id: 5, name: "image5" },
    ],
    [],
  );

  /**
   * Tracks the currently displayed image ID in the gallery
   * @type {number}
   * @default 1
   */
  const [currentImageId, setCurrentImageId] = useState(1);

  /**
   * Prevents multiple simultaneous slide transitions
   * @type {boolean}
   * @default false
   */
  const [isScrolling, setIsScrolling] = useState(false);
  /**
   * Tracks the current progress of the Swiper slider.
   *
   * @type {number}
   * @state
   * @description
   * - Represents the slider's progress as a decimal value between 0 and 1
   * - 0 indicates the start of the slider
   * - 1 indicates the end of the slider
   * - Useful for creating custom progress bars or tracking slide progression
   *
   * @example
   * // When the slider is halfway through, progress will be 0.5
   * console.log(progress); // 0.5
   */
  const [progress, setProgress] = useState(0);

  /**
   * Navigates to the next slide across multiple Swiper instances
   *
   * @description
   * - Prevents multiple simultaneous slide transitions
   * - Synchronizes sliding across three different Swiper instances
   * - Uses a timeout to manage scrolling state and prevent rapid transitions
   *
   * @throws {Error} If Swiper instances are not properly initialized
   * @returns {void}
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleNextSlide = useCallback(() => {
    try {
      if (isScrolling) return; // Prevent action if already scrolling
      // Lock scrolling to prevent multiple simultaneous transitions
      setIsScrolling(true);
      // Slide the main Swiper (primary large slider)
      // Checks if swiperRef exists and has slideNext method to prevent potential errors
      if (swiperRef && swiperRef.slideNext) {
        swiperRef.slideNext();
      }
      // Slide the secondary Swiper (middle slider)
      // Ensures the Swiper instance is available before calling slideNext
      if (secondSwiperRef && secondSwiperRef.slideNext) {
        secondSwiperRef.slideNext();
      }
      // Slide the tertiary Swiper (right-end slider)
      // Validates the Swiper instance before attempting to slide
      if (thirdSwiperRef && thirdSwiperRef.slideNext) {
        thirdSwiperRef.slideNext();
      }
      // Reset scrolling state after the slide animation completes
      // Timeout matches the Swiper transition speed to ensure smooth interaction
      setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    } catch (error) {
      console.error("Error in handleNextSlide:", error);
      // Reset scrolling state in case of an error
      setIsScrolling(false);
    } // Match this with your swiper speed (1300ms)
  }, [swiperRef, secondSwiperRef, thirdSwiperRef, isScrolling]);

  /**
   * Navigates to the previous slide across multiple Swiper instances
   *
   * @description
   * - Prevents multiple simultaneous slide transitions
   * - Synchronizes sliding across three different Swiper instances
   * - Uses a timeout to manage scrolling state and prevent rapid transitions
   *
   * @details
   * Follows the same pattern as handleNextSlide:
   * - Early return if already scrolling
   * - Lock scrolling state
   * - Validate and slide each Swiper instance
   * - Reset scrolling state after animation
   *
   * @throws {Error} If Swiper instances are not properly initialized
   * @returns {void}
   */
  const handlePrevSlide = useCallback(() => {
    try {
      if (isScrolling) return;

      setIsScrolling(true);

      if (swiperRef && swiperRef.slidePrev) {
        swiperRef.slidePrev();
      }
      if (secondSwiperRef && secondSwiperRef.slidePrev) {
        secondSwiperRef.slidePrev();
      }
      if (thirdSwiperRef && thirdSwiperRef.slidePrev) {
        thirdSwiperRef.slidePrev();
      }

      setTimeout(() => {
        setIsScrolling(false);
      }, 1300);
    } catch (error) {
      console.error("Error in handlePrevSlide:", error);
      // Reset scrolling state in case of an error
      setIsScrolling(false);
    }
  }, [swiperRef, secondSwiperRef, thirdSwiperRef, isScrolling]);

  /**
   * Renders Swiper slides from a list of images
   *
   * @description
   * - Transforms an array of image objects into SwiperSlide components
   * - Optimized with useCallback for performance
   * - Supports lazy loading and async image decoding
   *
   * @param {Array<{id: number, name: string}>} imageList - Array of image objects to render
   * @returns {Array<JSX.Element>} Array of SwiperSlide components
   *
   * @example
   * const images = [
   *   { id: 1, name: 'product1' },
   *   { id: 2, name: 'product2' }
   * ];
   * const slides = renderSlides(images);
   */
  const renderSlides = useCallback(
    (imageList) =>
      imageList.map((image) => (
        <SwiperSlide key={image.id}>
          <div className="relative h-full w-full bg-gray-400 bg-cover bg-center">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src={`/Images/${image.name}.jpg`}
              alt={`Image ${image.id}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </SwiperSlide>
      )),
    [],
  );

  // Render the component
  return (
    <div className="w-full">
      <div className="flex w-full flex-row items-start gap-0 md:gap-[12px]">
        {/**
         * Main Swiper configuration for gallery slider
         *
         * @description
         * - Responsive image slider with advanced interaction controls
         * - Supports keyboard and mousewheel navigation
         * - Implements responsive touch behavior
         *
         * @configuration
         * - Modules: Keyboard and Mousewheel for enhanced navigation
         * - Centered slides with parallax effect
         * - Adaptive touch interactions based on screen size
         *
         * @key-features
         * - Infinite loop navigation
         * - Dynamic slide tracking
         * - Responsive dimensions for different screen sizes
         * - Performance-optimized rendering
         *
         * @breakpoints
         * - Mobile (0px): Touch and simulate touch enabled
         * - Tablet/Desktop (768px+): Touch interactions disabled
         *
         * @event-handlers
         * - onSwiper: Captures Swiper instance reference
         * - onSlideChange: Updates current image ID dynamically
         * - onSlideChange:
         *   * Dynamically updates current image ID
         *   * Uses realIndex to track actual slide position in looped mode
         *   * Ensures current image ID is always in sync with visible slide
         */}
        <div className="relative w-full md:w-fit">
          <Swiper
            modules={[Keyboard, Mousewheel]}
            onSwiper={setSwiperRef}
            spaceBetween={12}
            slidesPerView={1}
            centeredSlides={true}
            parallax={true}
            speed={1000}
            loop={true}
            watchOverflow={true}
            className="mySwiper h-[450px] w-full md:aspect-square md:h-[458px] md:w-[500px] lg:h-[527px] lg:w-[576px]"
            allowTouchMove={false}
            simulateTouch={false}
            onProgress={(swiper, progress) => setProgress(progress)}
            breakpoints={{
              0: {
                allowTouchMove: true,
                simulateTouch: true,
              },
              768: {
                allowTouchMove: false,
                simulateTouch: false,
              },
            }}
            onSlideChange={(swiper) => {
              setCurrentImageId(images[swiper.realIndex].id); //tracking the currently displayed image id for sync
            }}
          >
            {renderSlides(images)}
          </Swiper>

          {showSwipeHint && (
            <div className="absolute right-0 top-1/2 z-10 md:hidden">
              
              <svg
                stroke-width="1.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-swipe h-8 w-8 text-white"
              >
                <path
                  d="M7.5 12L5.49591 14.6721C4.91845 15.4421 4.97127 16.5141 5.6216 17.2236L9.4055 21.3515C9.78431 21.7647 10.3183 22 10.8789 22C11.9651 22 13.7415 22 15.5 22C17.9 22 19.5 20 19.5 18C19.5 18 19.5 18 19.5 18C19.5 18 19.5 11.1429 19.5 9.42859"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M16.5 9.99995C16.5 9.99995 16.5 9.87483 16.5 9.42852C16.5 7.1428 19.5 7.1428 19.5 9.42852"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M13.5 9.99998C13.5 9.99998 13.5 9.17832 13.5 8.2857C13.5 5.99998 16.5 5.99998 16.5 8.2857C16.5 8.50885 16.5 9.2054 16.5 9.42855C16.5 9.87487 16.5 9.99998 16.5 9.99998"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10.5 10.0001C10.5 10.0001 10.5 8.61584 10.5 7.50005C10.5 5.21434 13.5 5.21434 13.5 7.50005C13.5 7.50005 13.5 7.50005 13.5 7.50005C13.5 7.50005 13.5 8.06261 13.5 8.28577C13.5 9.17839 13.5 10.0001 13.5 10.0001"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M10.5 10C10.5 10 10.5 8.61578 10.5 7.5C10.5 6.34156 10.5 4.68968 10.5 3.49899C10.5 2.67056 9.82843 2 9 2V2C8.17157 2 7.5 2.67157 7.5 3.5V12V15"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </div>
          )}

          {/* Modern Flat-Lined Swiper Indicator */}
          {/* * Creates a mobile-friendly slide indicator for the image gallery.
           *
           * @description
           * Generates a row of horizontal lines representing each slide in the gallery.
           * - Maps through the images array to create an indicator line for each image
           * - Uses dynamic styling to highlight the current active slide
           *
           * @component
           * @example
           * // Visual representation:
           * // [■□□] - First slide active
           * // [□■□] - Second slide active
           * // [□□■] - Third slide active
           *
           * @styling
           * - Height: 2.5px
           * - Rounded edges
           * - Responsive width (40% of container)
           * - Transition effects
           * - Color variations (white/white with opacity)
           *
           * @accessibility
           * - Provides visual feedback about current slide position
           * - Improves user experience on mobile devices
           *
           * @performance
           * - Uses lightweight, pure CSS transitions
           * - Minimal computational overhead*/}
          <div className="absolute bottom-5 left-1/2 z-10 flex w-[40%] -translate-x-1/2 transform items-center justify-center space-x-2 md:hidden">
            {images.map((_, index) => (
              <div
                key={index}
                className={`h-[2.5px] w-full rounded-full transition-all duration-300 ease-in-out ${
                  index === swiperRef?.realIndex ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
        {/**
         * Secondary Swiper configuration for synchronized gallery navigation
         *
         * @description
         * - Hidden on mobile, visible on medium and larger screens
         * - Complements the main Swiper for enhanced gallery interaction
         *
         * @configuration
         * - Centered single slide view
         * - Synchronized with main Swiper through loop and initial slide
         * - Disabled touch interactions for precise control
         *
         * @keyfeatures
         * - Responsive display (hidden on mobile, flex on md screens)
         * - Initial slide set to provide visual context
         * - Consistent with main Swiper's rendering approach
         *
         * @responsive-behavior
         * - Width: 0 on mobile, flex-1 on medium screens
         * - Aspect ratio maintained as square
         *
         * @performance
         * - Optimized rendering with renderSlides callback
         * - Minimal DOM footprint when not in use
         *
         * @visual-sync
         * - Matches main Swiper's loop and speed characteristics
         * - Provides secondary view of gallery images
         */}

        <Swiper
          modules={[Keyboard, Mousewheel]}
          onSwiper={setSecondSwiperRef}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          speed={1000}
          loop={true}
          className="hidden aspect-square w-0 md:flex md:flex-1"
          allowTouchMove={false}
          simulateTouch={false}
          initialSlide={1}
        >
          {renderSlides(images)}
        </Swiper>

        {/**
         * Tertiary Swiper configuration for synchronized gallery navigation
         *
         * @description
         * - Structurally identical to the secondary Swiper
         * - Provides third perspective in gallery image display
         * - Complements main Swiper for enhanced gallery interaction
         *
         * @configuration
         * - Mirrors secondary Swiper's setup
         * - Centered single slide view
         * - Synchronized with main Swiper through loop and initial slide
         *
         * @key-differences
         * - Initial slide set to 2 (third image in sequence)
         * - Adds visual depth to gallery navigation
         *
         * @similarities-with-secondary-swiper
         * - Responsive display (hidden on mobile, flex on md screens)
         * - Disabled touch interactions
         * - Optimized rendering approach
         *
         * @visual-sync
         * - Matches main Swiper's loop and speed characteristics
         * - Provides tertiary view of gallery images
         */}
        <Swiper
          modules={[Keyboard, Mousewheel]}
          onSwiper={setThirdSwiperRef}
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          speed={1000}
          loop={true}
          className="relative hidden aspect-square w-0 md:flex md:flex-1"
          allowTouchMove={false}
          simulateTouch={false}
          initialSlide={2}
        >
          {renderSlides(images)}

          {/**
           * Gallery Navigation Buttons
           *
           * @description
           * - Provides previous and next slide navigation controls
           * - Responsive design (hidden on mobile, visible on medium screens)
           *
           * @key-features
           * - Dynamically disabled during slide transitions
           * - Accessibility-enhanced with aria labels
           * - SVG icons for visual navigation
           *
           * @interaction-states
           * - Hover effect for better user experience
           * - Opacity and cursor changes based on scrolling state
           *
           * @accessibility
           * - Aria labels for screen readers
           * - SVG icons with aria-hidden for decorative elements
           *
           * @responsive-behavior
           * - Hidden on mobile screens
           * - Displayed as flex on medium and larger screens
           */}

          <div className="absolute bottom-1 right-1 z-10 hidden gap-2 text-white md:flex">
            <button
              className={`h-10 w-10 ${
                isScrolling ? "opacity-50" : "cursor-pointer hover:opacity-75"
              }`}
              onClick={handlePrevSlide}
              aria-label="Previous slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-full w-full"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-4.28 9.22a.75.75 0 0 0 0 1.06l3 3a.75.75 0 1 0 1.06-1.06l-1.72-1.72h5.69a.75.75 0 0 0 0-1.5h-5.69l1.72-1.72a.75.75 0 0 0-1.06-1.06l-3 3Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              className={`h-10 w-10 ${
                isScrolling ? "opacity-50" : "cursor-pointer hover:opacity-75"
              }`}
              onClick={handleNextSlide}
              aria-label="Next slide"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-full w-full"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </Swiper>
      </div>
    </div>
  );
}
