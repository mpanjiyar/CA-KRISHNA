import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';

/**
 * OfficialFirmLogo:
 * Dynamically displays the configured firm logo (from SiteContentContext / local uploads)
 * or defaults to the official ICAI emblem.
 */
export const OfficialFirmLogo: React.FC<{
  sizePx?: number;
  className?: string;
  alt?: string;
  source?: 'header' | 'footer' | 'custom' | 'hero';
  customUrl?: string;
}> = ({
  sizePx = 44,
  className = '',
  alt = 'Official Emblem of The Institute of Chartered Accountants of India',
  source = 'header',
  customUrl
}) => {
  const { state } = useSiteContent();

  let logoUrl = state.media.headerLogo || '/icai-emblem.svg';
  if (source === 'footer') {
    logoUrl = state.media.footerLogo || state.media.headerLogo || '/icai-emblem.svg';
  } else if (source === 'hero') {
    logoUrl = state.media.heroBadge || state.media.headerLogo || '/icai-emblem.svg';
  } else if (source === 'custom' && customUrl) {
    logoUrl = customUrl;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden ${className}`}
      style={{ width: sizePx, height: sizePx }}
      aria-label={alt}
    >
      <img
        src={logoUrl}
        alt={alt}
        width={sizePx}
        height={sizePx}
        className="w-full h-full object-contain drop-shadow-xs transition-all duration-200"
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
 * Official Navigation Brand Lockup for PANJIYAR KRISHNA & CO.
 * Pulls firm name, designation, and logo dynamically from live admin state.
 */
export const BrandHeaderLockup: React.FC<{
  theme?: 'dark' | 'light';
  source?: 'header' | 'footer';
  onClick?: () => void;
  className?: string;
}> = ({ theme = 'light', source = 'header', onClick, className = '' }) => {
  const { state } = useSiteContent();
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
      aria-label={`${state.firmDetails.name} Home`}
    >
      {/* Official / Custom Logo Container with Responsive Breakpoint Sizing */}
      <div className="shrink-0 flex items-center justify-center">
        {/* Mobile (320px - 479px): 36px */}
        <OfficialFirmLogo 
          source={source} 
          sizePx={36} 
          className="xs:hidden group-hover:scale-105 transition-transform" 
        />
        {/* Medium Mobile / Small Tablet (480px - 639px): 42px */}
        <OfficialFirmLogo 
          source={source} 
          sizePx={42} 
          className="hidden xs:flex sm:hidden group-hover:scale-105 transition-transform" 
        />
        {/* Tablet & Desktop (640px+): 48px */}
        <OfficialFirmLogo 
          source={source} 
          sizePx={48} 
          className="hidden sm:flex group-hover:scale-105 transition-transform" 
        />
      </div>

      {/* Firm Typography Lockup */}
      <div className="flex flex-col text-left justify-center min-w-0 leading-tight">
        <span
          className={`font-brand text-[13.5px] xs:text-[15px] sm:text-[17px] xl:text-[18.5px] font-bold tracking-tight truncate ${
            isDark ? 'text-white' : 'text-[#062A5A]'
          }`}
        >
          {state.firmDetails.name}
        </span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className={`text-[9.5px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase truncate ${
              isDark ? 'text-slate-300' : 'text-[#0969C7]'
            }`}
          >
            {state.firmDetails.designation || 'Chartered Accountants'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18] shrink-0" />
          <span
            className={`text-[9px] xs:text-[10px] hidden sm:inline-block font-normal truncate ${
              isDark ? 'text-slate-400' : 'text-[#667085]'
            }`}
          >
            {state.firmDetails.address?.city ? `${state.firmDetails.address.locality || ''}, ${state.firmDetails.address.city}` : 'Andheri (W), Mumbai'}
          </span>
        </div>
      </div>
    </div>
  );
};
