import React from 'react';
import { useMedia } from '../context/MediaContext';
import { useFirmData } from '../context/FirmDataContext';

/**
 * OfficialFirmLogo:
 * Dynamically displays the configured firm logo (from MediaContext / local uploads)
 * or defaults to the official ICAI emblem.
 */
export const OfficialFirmLogo: React.FC<{
  sizePx?: number;
  className?: string;
  alt?: string;
  source?: 'header' | 'footer' | 'custom';
  customUrl?: string;
}> = ({
  sizePx,
  className = '',
  alt = 'Official Emblem of The Institute of Chartered Accountants of India',
  source = 'header',
  customUrl
}) => {
  const { settings } = useMedia();

  let logoUrl = settings.headerLogo || '/icai-emblem.svg';
  if (source === 'footer') {
    logoUrl = settings.footerLogo || settings.headerLogo || '/icai-emblem.svg';
  } else if (source === 'custom' && customUrl) {
    logoUrl = customUrl;
  }

  const style = sizePx ? { width: `${sizePx}px`, height: `${sizePx}px` } : undefined;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
      style={style}
      aria-label={alt}
    >
      <img
        key={logoUrl}
        src={logoUrl}
        alt={alt}
        className="w-full h-full object-contain drop-shadow-xs transition-all duration-200"
        loading="eager"
        decoding="async"
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== '/icai-emblem.svg') {
            target.src = '/icai-emblem.svg';
          }
        }}
      />
    </div>
  );
};

export const CaEmblem = OfficialFirmLogo;
export const CaIndiaLogo = OfficialFirmLogo;

/**
 * BrandHeaderLockup:
 * Official Navigation Brand Lockup for PANJIYAR KRISHNA & CO.
 * Guarantees EXACTLY ONE single company logo is displayed.
 */
export const BrandHeaderLockup: React.FC<{
  theme?: 'dark' | 'light';
  source?: 'header' | 'footer';
  onClick?: () => void;
  className?: string;
}> = ({ theme = 'light', source = 'header', onClick, className = '' }) => {
  const { firmDetails } = useFirmData();
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
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group py-0.5 select-none focus-visible:outline-2 focus-visible:outline-[#0969C7] rounded-lg min-w-0 transition-opacity hover:opacity-95 ${className}`}
      role="button"
      tabIndex={0}
      aria-label={`${firmDetails.name} – ${firmDetails.designation} Home`}
    >
      {/* EXACTLY ONE Company Logo */}
      <div className="shrink-0 flex items-center justify-center">
        <OfficialFirmLogo 
          source={source} 
          className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 group-hover:scale-105 transition-transform" 
        />
      </div>

      {/* Firm Typography Lockup */}
      <div className="flex flex-col text-left justify-center min-w-0 leading-tight">
        <span
          className={`font-brand text-[13.5px] xs:text-[15px] sm:text-[17px] xl:text-[18.5px] font-bold tracking-tight truncate ${
            isDark ? 'text-white' : 'text-[#062A5A]'
          }`}
        >
          {firmDetails.name}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`text-[9.5px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase truncate ${
              isDark ? 'text-slate-300' : 'text-[#0969C7]'
            }`}
          >
            {firmDetails.designation}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] shrink-0" />
          <span
            className={`text-[9px] xs:text-[10px] hidden sm:inline-block font-normal truncate ${
              isDark ? 'text-slate-400' : 'text-[#667085]'
            }`}
          >
            {firmDetails.address.locality}, {firmDetails.address.city}
          </span>
        </div>
      </div>
    </div>
  );
};
