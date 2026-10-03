import React from 'react';
import { Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { CaEmblem } from './CaLogo';
import { useMedia } from '../context/MediaContext';
import { useFirmData } from '../context/FirmDataContext';

export const FounderSection: React.FC = () => {
  const { settings } = useMedia();
  const { firmDetails } = useFirmData();
  const [imageError, setImageError] = React.useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [settings.founderPhoto]);
  return (
    <section className="w-full bg-[#F7F9FC] py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-5xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Card Container for Founder Profile */}
        <div className="bg-white rounded-2xl shadow-xs border border-[#D9E2EC] p-4 xs:p-5 sm:p-8 md:p-10 relative overflow-hidden">
          
          {/* Subtle Navy Geometric Corner Accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#062A5A]/5 rounded-bl-full pointer-events-none" />
          <div className="absolute top-0 left-0 w-20 xs:w-24 h-1.5 bg-[#F28C18]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-center">
            
            {/* Left Column: Visual CA Crest & Avatar Card */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative mb-3 sm:mb-4">
                {/* Circular Profile Frame with ICAI Colors or Uploaded Photo - Enlarged for prestige */}
                <div className="w-44 h-44 xs:w-52 xs:h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-[#062A5A] via-[#0969C7] to-[#F28C18]/60 p-1.5 sm:p-2 shadow-lg flex items-center justify-center overflow-hidden ring-4 ring-[#EEF5FC]">
                  <div className={`w-full h-full rounded-full bg-white flex flex-col items-center justify-center overflow-hidden ${settings.founderPhoto && !imageError ? 'p-0' : 'p-3'}`}>
                    {settings.founderPhoto && !imageError ? (
                      <img
                        key={settings.founderPhoto}
                        src={settings.founderPhoto}
                        alt={firmDetails.founder}
                        className="w-full h-full object-cover object-center rounded-full"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <>
                        <CaEmblem className="w-16 h-16 sm:w-20 sm:h-20" />
                        <span className="text-[10px] sm:text-[11px] font-bold text-[#062A5A] uppercase tracking-wider mt-1">
                          ICAI Member
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Verified Badge Icon */}
                <div 
                  className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 flex items-center justify-center filter drop-shadow-md transition-transform hover:scale-110" 
                  title="Verified Chartered Accountant (ICAI Member)"
                  aria-label="Verified Badge"
                >
                  <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" 
                      fill="#0969C7" 
                      stroke="#FFFFFF" 
                      strokeWidth="1.2" 
                    />
                    <path 
                      d="m9 12 2 2 4-4" 
                      fill="none"
                      stroke="#FFFFFF" 
                      strokeWidth="2.4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>
              </div>

              <span className="font-brand font-bold text-base sm:text-lg text-[#062A5A]">
                {firmDetails.founder}
              </span>
              <span className="text-[11px] xs:text-xs uppercase tracking-wider font-semibold text-[#0969C7] mt-0.5">
                {firmDetails.founderTitle}
              </span>
              <span className="text-[11px] xs:text-xs text-[#667085] mt-0.5">
                {firmDetails.address.locality}, {firmDetails.address.city}
              </span>
            </div>

            {/* Right Column: Founder Narrative & Direct Contact Buttons */}
            <div className="md:col-span-8 flex flex-col text-left">
              <div className="inline-flex items-center gap-1.5 mb-1.5 text-[#0969C7]">
                <Award size={15} />
                <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold">
                  Leadership &amp; Practice Oversight
                </span>
              </div>

              <h2 className="font-manrope text-[20px] xs:text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#062A5A] tracking-tight leading-tight mb-1">
                Meet {firmDetails.founder}
              </h2>

              <h3 className="text-xs xs:text-sm sm:text-base font-semibold text-[#0969C7] mb-2.5 sm:mb-3">
                {firmDetails.founderTitle}
              </h3>

              <p className="text-xs xs:text-sm sm:text-base text-[#172033]/90 leading-[1.65] mb-5 font-normal">
                {firmDetails.founder} leads <strong className="font-semibold text-[#062A5A]">{firmDetails.name}</strong> with a focus on accuracy, professional integrity, responsive service and long-term client relationships. Specializing in corporate taxation, GST litigation, and strategic bank financing, he brings direct partner oversight to every client file.
              </p>

              {/* Verified Contact Buttons - 2 Columns on mobile */}
              <div className="grid grid-cols-2 sm:flex sm:flex-row flex-wrap items-stretch sm:items-center gap-2 xs:gap-2.5">
                <a
                  href={`tel:${firmDetails.phone1}`}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] active:scale-[0.98] rounded-xl transition-all shadow-xs min-h-[40px] sm:min-h-[44px]"
                >
                  <Phone size={13} className="text-[#F28C18] shrink-0" />
                  <span className="truncate">Call Firm</span>
                </a>

                <a
                  href={`mailto:${firmDetails.email}`}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-[#172033] hover:text-[#062A5A] hover:bg-slate-100 active:scale-[0.98] border border-[#D9E2EC] rounded-xl transition-all min-h-[40px] sm:min-h-[44px]"
                >
                  <Mail size={13} className="text-[#159447] shrink-0" />
                  <span>Email Us</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
