import React, { lazy, Suspense, useState, useEffect } from "react";
import SmoothScroller from "../components/SmoothScroller/SmoothScrool";
import Preloader from "../Pages/Preloader";
const HeaderSec = lazy(() => import("../components/Sections/HeaderSec"));
const Toppick = lazy(() => import("../components/Sections/Toppick"));
const AboutSec = lazy(() => import("../components/Sections/AboutSec"));
const GallerySec = lazy(() => import("../components/Sections/GallerySec"));
const Shop = lazy(() => import("../components/Sections/Shop"));
const CTOsectio = lazy(() => import("../components/Sections/CTOsectio"));
const NewsletterSec = lazy(
  () => import("../components/Sections/NewsletterSec"),
);
const Futer = lazy(() => import("../components/footer/Futer"));
//reemoved this because it fels incesccary
// const LoadingFallback = () => (
//   <div className="flex min-h-screen items-center justify-center">
//     <img
//       className="h-8 w-8 animate-spin rounded-full"
//       src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
//       alt=""
//     />
//   </div>
// );

/**
 * Homepage component that shows a preloader on first page load
 * @returns {React.ReactElement} The rendered homepage
 */
export default function Homepage() {
  const [showPreloader, setShowPreloader] = useState(() => {
    // Check if it's the first time loading
    const hasVisited = localStorage.getItem("siteVisited");
    return !hasVisited;
  });

  const handlePreloaderComplete = () => {
    // Mark content as loaded after preloader
    setShowPreloader(false);
    localStorage.setItem("siteVisited", "true");
  };

  return (
    <SmoothScroller>
      {showPreloader ? (
        <Preloader onComplete={handlePreloaderComplete} />
      ) : (
        <Suspense fallback={null}>
          <div className="scrollbar-hide min-h-screen w-full ">
            <HeaderSec />
            <Toppick />
            <AboutSec />
            <GallerySec />
            <Shop />
            <CTOsectio />
            <NewsletterSec />
            <Futer />
          </div>
        </Suspense>
      )}
    </SmoothScroller>
  );
}
