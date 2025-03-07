// Import necessary hooks from React
import { useEffect } from "react";
// Import Lenis library for smooth scrolling
import Lenis from "@studio-freight/lenis";

// Define SmoothScroller component that wraps other components
export default function SmoothScroller({ children }) {
  // useEffect hook to handle initialization and cleanup of Lenis
  useEffect(() => {
    // Create new Lenis instance with configuration
    const lenis = new Lenis({
      duration: 1.4,        // Duration of the smooth scroll animation
      smoothWheel: true,    // Enable smooth scrolling for mouse wheel
      smoothTouch: false,   // Disable smooth scrolling for touch devices
      wheelMultiplier: 1.0, // Multiplier for wheel scroll speed
      wrapper: window,      // The scrollable element (window in this case)
      content: document.documentElement // The content to be scrolled (entire document)
    });

    // Define recursive animation frame function
    function raf(time) {
      lenis.raf(time);  // Update Lenis on each animation frame
      requestAnimationFrame(raf);  // Request next animation frame
    }

    // Start the animation loop
    requestAnimationFrame(raf);

    // Cleanup function to destroy Lenis instance when component unmounts
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Render children wrapped in a div with hidden vertical overflow
  return <div style={{ overflowY: "hidden" }}>{children}</div>;
}
