import React, { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

/**
 * Official WhatsApp SVG Icon with authentic speech bubble and telephone handset inside
 */
export const WhatsAppOfficialIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-white' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.26 2.14 7.42L2.05 30l6.78-2.05C10.9 29.25 13.38 30 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm8.07 19.95c-.34.96-1.7 1.83-2.77 2.05-.73.15-1.68.27-4.88-1.06-4.1-1.7-6.73-5.88-6.94-6.16-.2-.28-1.67-2.22-1.67-4.24s1.05-3.02 1.43-3.43c.38-.41.83-.51 1.1-.51.28 0 .55.01.79.02.25.01.59-.1.92.7.34.82 1.16 2.84 1.26 3.05.1.21.17.45.03.73-.14.28-.21.45-.41.69-.21.24-.43.54-.62.72-.21.21-.43.43-.18.86.24.43 1.08 1.78 2.32 2.88 1.6 1.42 2.95 1.86 3.37 2.07.42.21.66.17.91-.1.24-.28 1.05-1.22 1.33-1.64.28-.41.55-.34.93-.21.38.14 2.41 1.14 2.82 1.35.41.21.69.31.79.48.1.18.1 1.02-.24 1.98z" />
  </svg>
);

/**
 * FloatingContactPanel:
 * Fixed floating contact panel on the RIGHT side of the website.
 * Contains 3 circular buttons:
 * 1. Call Icon (phone) with gentle pulsing animation
 * 2. WhatsApp Official Icon with speech bubble & telephone handset
 * 3. Email Icon (mail) with gentle pulsing animation
 * Accessible labels, tooltip previews on desktop hover (flying out to the left), responsive sizing on mobile/tablet.
 */
export const FloatingContactPanel: React.FC = () => {
  const { firmDetails } = useFirmData();
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const phoneNum = firmDetails.phone1 || '6000310815';
  const cleanPhone = phoneNum.replace(/[^0-9+]/g, '');
  const emailAddr = firmDetails.email || 'cakrishanpanjiyar@gmail.com';
  
  const whatsappUrl = `https://wa.me/91${cleanPhone.replace(/^\+91/, '')}?text=${encodeURIComponent(
    `Hello ${firmDetails.founder}, I would like to inquire about your Chartered Accountancy services.`
  )}`;

  return (
    <aside
      aria-label="Floating quick contact options"
      className="hidden md:flex fixed right-3 sm:right-4 md:right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 sm:gap-3.5 select-none pointer-events-none"
    >
      {/* 1. CALL BUTTON */}
      <div
        className="relative pointer-events-auto flex items-center justify-end"
        onMouseEnter={() => setActiveTooltip('call')}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        {activeTooltip === 'call' && (
          <div
            role="tooltip"
            className="hidden sm:flex absolute right-full mr-3 px-3 py-1.5 bg-[#062A5A] text-white text-xs font-semibold rounded-lg shadow-xl border border-white/20 whitespace-nowrap items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-150 z-50 pointer-events-none"
          >
            <span>Call Us</span>
            <span className="text-[11px] text-slate-300 font-normal opacity-90">
              &middot; {phoneNum}
            </span>
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#062A5A]" />
          </div>
        )}

        <span
          className="absolute inset-0 rounded-full animate-ping opacity-35 bg-[#062A5A]/30"
          style={{ animationDuration: '2.8s' }}
        />

        <a
          href={`tel:${cleanPhone}`}
          aria-label={`Call PANJIYAR KRISHNA & CO. at ${phoneNum}`}
          className="relative flex items-center justify-center w-11 h-11 xs:w-12 xs:h-12 sm:w-13 sm:h-13 rounded-full shadow-lg hover:shadow-xl border transition-all duration-200 transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969C7] bg-[#062A5A] hover:bg-[#031C3D] text-white border-amber-400/40"
        >
          <Phone className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#F28C18]" />
        </a>
      </div>

      {/* 2. OFFICIAL WHATSAPP BUTTON */}
      <div
        className="relative pointer-events-auto flex items-center justify-end"
        onMouseEnter={() => setActiveTooltip('whatsapp')}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        {activeTooltip === 'whatsapp' && (
          <div
            role="tooltip"
            className="hidden sm:flex absolute right-full mr-3 px-3 py-1.5 bg-[#062A5A] text-white text-xs font-semibold rounded-lg shadow-xl border border-white/20 whitespace-nowrap items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-150 z-50 pointer-events-none"
          >
            <span>Chat on WhatsApp</span>
            <span className="text-[11px] text-emerald-300 font-medium">
              &middot; Quick Advisory
            </span>
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#062A5A]" />
          </div>
        )}

        <span
          className="absolute inset-0 rounded-full animate-ping opacity-35 bg-[#25D366]/30"
          style={{ animationDuration: '3.2s' }}
        />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with CA Krishna Panjiyar"
          className="relative flex items-center justify-center w-11 h-11 xs:w-12 xs:h-12 sm:w-13 sm:h-13 rounded-full shadow-lg hover:shadow-xl border transition-all duration-200 transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] bg-[#25D366] hover:bg-[#20ba59] text-white border-white/30"
        >
          <WhatsAppOfficialIcon className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-white drop-shadow-xs" />
        </a>
      </div>

      {/* 3. EMAIL BUTTON */}
      <div
        className="relative pointer-events-auto flex items-center justify-end"
        onMouseEnter={() => setActiveTooltip('email')}
        onMouseLeave={() => setActiveTooltip(null)}
      >
        {activeTooltip === 'email' && (
          <div
            role="tooltip"
            className="hidden sm:flex absolute right-full mr-3 px-3 py-1.5 bg-[#062A5A] text-white text-xs font-semibold rounded-lg shadow-xl border border-white/20 whitespace-nowrap items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-150 z-50 pointer-events-none"
          >
            <span>Send Email</span>
            <span className="text-[11px] text-slate-300 font-normal opacity-90">
              &middot; {emailAddr}
            </span>
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-[#062A5A]" />
          </div>
        )}

        <span
          className="absolute inset-0 rounded-full animate-ping opacity-35 bg-[#0969C7]/30"
          style={{ animationDuration: '3.6s' }}
        />

        <a
          href={`mailto:${emailAddr}?subject=Chartered%20Accountancy%20Inquiry%20-%20PANJIYAR%20KRISHNA%20%26%20CO.`}
          aria-label={`Send email to ${emailAddr}`}
          className="relative flex items-center justify-center w-11 h-11 xs:w-12 xs:h-12 sm:w-13 sm:h-13 rounded-full shadow-lg hover:shadow-xl border transition-all duration-200 transform hover:scale-110 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0969C7] bg-[#0969C7] hover:bg-[#0756a3] text-white border-sky-300/40"
        >
          <Mail className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-white" />
        </a>
      </div>
    </aside>
  );
};
