import React, { useState, useEffect } from 'react';

/**
 * ScrollProgressBar:
 * A subtle, very small scroll progress indicator line fixed at the very top of the viewport (z-50).
 * Displays on every page and updates in real-time as the user scrolls.
 * Features a refined gradient matching the firm's brand identity:
 * Royal Navy (#062A5A) -> Accent Blue (#0969C7) -> Amber Gold (#F28C18).
 */
export const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (height > 0) {
        const scrolled = (winScroll / height) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrolled)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial calculate
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[2.5px] pointer-events-none bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-[#062A5A] via-[#0969C7] to-[#F28C18] transition-[width] duration-75 ease-out shadow-xs"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
