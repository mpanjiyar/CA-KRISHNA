import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * ScrollToTopButton:
 * Fixed back-to-top button on the bottom-right side of the viewport.
 * Remains hidden when near the top of the page.
 * Appears smoothly once user scrolls down > 300px.
 * Smoothly scrolls back to top when clicked.
 */
export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to Top"
      title="Back to Top"
      className="fixed right-3 xs:right-4 sm:right-6 bottom-20 md:bottom-6 z-40 flex items-center justify-center w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-[#062A5A] hover:bg-[#031C3D] text-white border border-[#F28C18]/60 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 active:scale-95 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969C7]"
    >
      {/* Up Arrow Icon */}
      <ArrowUp className="w-5 h-5 text-[#F28C18] group-hover:text-amber-300 transition-colors" />

      {/* Accessible Tooltip for Hover */}
      <span className="sr-only">Back to Top</span>
    </button>
  );
};
