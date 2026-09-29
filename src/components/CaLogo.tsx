import React from 'react';

/**
 * Official ICAI Firm Emblem Component
 * The authentic Institute of Chartered Accountants of India emblem uploaded by the user:
 * - 16 fluted petals with terracotta outline & red radiating striations
 * - Central deep navy blue circular medallion
 * - Golden mythical Garuda (eagle of vigilance) with outstretched spread wings
 * - Green pedestal base
 * - Flowing scroll ribbon with Sanskrit inscription "य एष सुप्तेषु जागर्ति"
 * - Outer circular title "THE INSTITUTE OF CHARTERED ACCOUNTANTS OF INDIA"
 * 
 * Uses vector SVG (/icai-emblem.svg) with fallback to high-fidelity vector definitions
 * ensuring crisp rendering at every resolution (retina, mobile, 4K).
 */
export const OfficialFirmLogo: React.FC<{
  sizePx?: number;
  className?: string;
  alt?: string;
}> = ({
  sizePx = 44,
  className = '',
  alt = 'Official Emblem of The Institute of Chartered Accountants of India'
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: sizePx, height: sizePx }}
      aria-label={alt}
    >
      <img
        src="/icai-emblem.svg"
        alt={alt}
        width={sizePx}
        height={sizePx}
        className="w-full h-full object-contain drop-shadow-sm transition-transform duration-200"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export const CaEmblem = OfficialFirmLogo;
export const CaIndiaLogo = OfficialFirmLogo;

/**
 * BrandHeaderLockup:
 * The official Navigation Brand Lockup for PANJIYAR KRISHNA & CO.
 * Features:
 * - The authentic, high-res ICAI Emblem as uploaded by the user
 * - Responsively sized across mobile (36px), tablet (42px), and desktop (48px)
 * - Rock-solid alignment preventing line wraps, overflow, or vertical shift
 * - Clear contrast in both light (Header navbar) and dark (Footer) modes
 */
export const BrandHeaderLockup: React.FC<{
  theme?: 'dark' | 'light';
  onClick?: () => void;
  className?: string;
}> = ({ theme = 'light', onClick, className = '' }) => {
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`inline-flex items-center gap-2.5 xs:gap-3 sm:gap-3.5 cursor-pointer group py-0.5 select-none focus-visible:outline-2 focus-visible:outline-[#0969C7] rounded-lg min-w-0 transition-opacity hover:opacity-95 ${className}`}
      role="button"
      tabIndex={0}
      aria-label="PANJIYAR KRISHNA & CO. – Chartered Accountants Home"
    >
      {/* Official ICAI Emblem Logo Container with Responsive Breakpoint Sizing */}
      <div className="shrink-0 flex items-center justify-center">
        {/* Mobile (320px - 479px): 36px */}
        <OfficialFirmLogo sizePx={36} className="xs:hidden group-hover:scale-105 transition-transform" />
        {/* Medium Mobile / Small Tablet (480px - 639px): 42px */}
        <OfficialFirmLogo sizePx={42} className="hidden xs:flex sm:hidden group-hover:scale-105 transition-transform" />
        {/* Tablet & Desktop (640px+): 48px */}
        <OfficialFirmLogo sizePx={48} className="hidden sm:flex group-hover:scale-105 transition-transform" />
      </div>

      {/* Firm Typography Lockup */}
      <div className="flex flex-col text-left justify-center min-w-0 leading-tight">
        <span
          className={`font-brand text-[13.5px] xs:text-[15px] sm:text-[17px] xl:text-[18.5px] font-bold tracking-tight truncate ${
            isDark ? 'text-white' : 'text-[#062A5A]'
          }`}
        >
          PANJIYAR KRISHNA &amp; CO.
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`text-[9.5px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase truncate ${
              isDark ? 'text-slate-300' : 'text-[#0969C7]'
            }`}
          >
            Chartered Accountants
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] shrink-0" />
          <span
            className={`text-[9px] xs:text-[10px] hidden sm:inline-block font-normal truncate ${
              isDark ? 'text-slate-400' : 'text-[#667085]'
            }`}
          >
            Andheri (W), Mumbai
          </span>
        </div>
      </div>
    </div>
  );
};
