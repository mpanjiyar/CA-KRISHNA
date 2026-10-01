import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, PhoneCall, ArrowDown } from 'lucide-react';
import { CaEmblem } from './CaLogo';
import { useFirmData } from '../context/FirmDataContext';
import { useMedia } from '../context/MediaContext';

interface HeroProps {
  onOpenConsultation: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultation,
  onExploreServices
}) => {
  const { firmDetails, websiteText } = useFirmData();
  const { settings } = useMedia();
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <section className="relative w-full bg-white overflow-hidden pt-5 pb-10 sm:pt-8 sm:pb-14 lg:py-18 border-b border-[#D9E2EC]">
      {/* Background Graphic: Visiting-Card Inspired Curved & Diagonal Navy Shapes */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(#062A5A 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Diagonal navy swoop on top-right echoing visiting card geometry */}
        <div className="hidden lg:block absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#062A5A]/5 via-[#0969C7]/5 to-transparent blur-2xl" />
        <div className="hidden lg:block absolute bottom-0 right-10 w-72 h-72 bg-[#EEF5FC] rounded-tl-[100px] -z-10 opacity-70" />
      </div>

      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Description & Actions */}
          <div className="lg:col-span-7 flex flex-col text-left animate-fade-slide-up">
            
            {/* Professional Kicker with Card Brand Accent */}
            <div className="inline-flex items-center gap-1.5 xs:gap-2 mb-2.5 sm:mb-3 text-[#062A5A] flex-wrap">
              <span className="w-4 xs:w-5 sm:w-6 h-[2px] xs:h-[2.5px] bg-[#F28C18]" />
              <span className="font-brand font-bold text-[11px] xs:text-xs sm:text-sm tracking-wider xs:tracking-widest uppercase text-[#062A5A]">
                {firmDetails.name}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] xs:text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-[#0969C7]">
                {firmDetails.designation}
              </span>
            </div>

            {/* H1 - Balanced responsive typography for 320px–430px */}
            <h1 className="font-manrope text-[22px] xs:text-[26px] sm:text-[34px] md:text-[42px] lg:text-[48px] font-extrabold text-[#062A5A] tracking-tight leading-[1.18] mb-3 sm:mb-5 text-balance">
              {websiteText.heroHeadline}
            </h1>

            {/* Supporting Text */}
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#172033]/85 leading-[1.65] mb-5 sm:mb-7 max-w-2xl font-normal">
              {websiteText.heroSubheadline}
            </p>

            {/* CTA Buttons - Stacks cleanly on mobile, inline on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-7">
              <button
                onClick={onOpenConsultation}
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs xs:text-sm sm:text-[15px] font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] active:scale-[0.98] rounded-xl shadow-xs transition-all duration-150 border-b-2 border-transparent hover:border-[#F28C18] min-h-[46px]"
              >
                <span>Book a Consultation</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 text-xs xs:text-sm sm:text-[15px] font-semibold text-[#062A5A] bg-[#EEF5FC] hover:bg-[#D9E2EC] active:scale-[0.98] rounded-xl border border-[#D9E2EC] transition-colors min-h-[46px]"
              >
                <span>Explore Our Services</span>
              </button>

              <a
                href={`tel:${firmDetails.phone1}`}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#0969C7] hover:text-[#062A5A] hover:bg-slate-50 rounded-xl transition-colors min-h-[42px]"
              >
                <PhoneCall size={14} className="text-[#F28C18]" />
                <span>Call {firmDetails.phone1}</span>
              </a>
            </div>

            {/* Direct Trust Signals */}
            <div className="pt-3 sm:pt-4 border-t border-[#D9E2EC]/70 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] xs:text-xs sm:text-[13px] text-[#667085]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#159447] shrink-0" />
                <span>ICAI Regulation Compliant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#159447] shrink-0" />
                <span>Direct Partner Oversight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#159447] shrink-0" />
                <span>Andheri (W), Mumbai</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#0969C7] shrink-0" />
                <span>PAN India Remote Desk</span>
              </div>
            </div>

          </div>

          {/* Right Column: CA India Logo Treatment with Visiting Card Geometry */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full max-w-full animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
            {/* Visiting Card Visual Container */}
            <div className="relative w-full max-w-[400px] bg-gradient-to-br from-[#062A5A] via-[#031C3D] to-[#062A5A] rounded-2xl shadow-xl overflow-hidden p-4 xs:p-5 sm:p-7 text-white border border-[#0969C7]/30 card-hover-lift">
              
              {/* Card Geometric Lines and Curves */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-[#0969C7]/30 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 border-4 border-[#F28C18]/20 rounded-full pointer-events-none" />
              
              {/* Gold / Orange Accent Ribbon */}
              <div className="absolute top-0 left-5 sm:left-7 w-16 sm:w-20 h-1.5 bg-[#F28C18]" />

              {/* Main Card Content */}
              <div className="relative z-10 flex flex-col items-center text-center pt-2">
                {/* Official Firm Crest / Hero Badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 backdrop-blur-xs p-2 border border-white/20 shadow-md flex items-center justify-center mb-2.5 overflow-hidden">
                  <img
                    key={settings.heroBadge || settings.headerLogo || '/icai-emblem.svg'}
                    src={settings.heroBadge || settings.headerLogo || '/icai-emblem.svg'}
                    alt="Official Firm Crest"
                    className="w-full h-full object-contain filter drop-shadow-xs"
                  />
                </div>

                {/* Firm Name */}
                <h3 className="font-brand text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-white mb-0.5">
                  {firmDetails.name}
                </h3>
                <p className="text-[11px] xs:text-xs sm:text-sm text-[#EEF5FC] font-medium tracking-widest uppercase mb-2.5 sm:mb-3">
                  {firmDetails.designation}
                </p>

                {/* Card Hairline Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D9E2EC]/30 to-transparent my-2" />

                {/* Founder Title Badge */}
                <div className="flex items-center gap-1.5 xs:gap-2 mb-2.5 sm:mb-3 flex-wrap justify-center text-xs sm:text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#159447] shrink-0" />
                  <span className="font-semibold text-white tracking-wide">
                    {firmDetails.founder}
                  </span>
                  <span className="text-[11px] xs:text-xs text-slate-300">
                    &middot; {firmDetails.founderTitle}
                  </span>
                </div>

                {/* Visiting Card Front Tagline Pill */}
                <div className="bg-[#031C3D]/90 px-3 py-1.5 xs:py-2 rounded-lg border border-[#0969C7]/40 w-full">
                  <p className="font-manrope text-[11px] xs:text-xs sm:text-sm font-bold tracking-wider uppercase text-[#F28C18]">
                    {firmDetails.tagline}
                  </p>
                </div>

                {/* Office Address on Card */}
                <p className="text-[10px] xs:text-[11px] text-slate-300 mt-2.5 sm:mt-3 leading-relaxed font-light">
                  {firmDetails.address.line1}, {firmDetails.address.line2}
                </p>
              </div>

              {/* Secure Certificate Tag */}
              <div className="mt-3.5 sm:mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] xs:text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#159447]" />
                  Verified ICAI Practice
                </span>
                <span className="text-[#F28C18] font-semibold">
                  PAN India Desk
                </span>
              </div>
            </div>

            {/* Tagline Underneath as specified: Accuracy | Integrity | Growth */}
            <div className="mt-3 text-center">
              <span className="font-manrope text-[11px] xs:text-xs sm:text-sm font-bold tracking-wider text-[#062A5A] uppercase">
                Accuracy &nbsp;|&nbsp; Integrity &nbsp;|&nbsp; Growth
              </span>
            </div>
          </div>

        </div>

        {/* Top-of-Page Scroll Indication ("↓ Scroll to Explore") */}
        <div
          className={`mt-8 sm:mt-12 flex flex-col items-center justify-center transition-all duration-300 ${
            hasScrolled ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <button
            onClick={onExploreServices}
            aria-label="Scroll to explore services"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 hover:text-[#062A5A] transition-all text-xs font-semibold group cursor-pointer shadow-2xs"
          >
            <span className="text-[11px] xs:text-xs uppercase tracking-wider">Scroll to Explore</span>
            <span className="w-5 h-5 rounded-full bg-[#062A5A]/10 text-[#062A5A] flex items-center justify-center group-hover:bg-[#062A5A] group-hover:text-white transition-colors">
              <ArrowDown className="w-3 h-3 animate-bounce" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
