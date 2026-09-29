import React from 'react';
import { CaEmblem } from './CaLogo';
import { FIRM_DETAILS } from '../data/firmData';

export const BrandStatement: React.FC = () => {
  return (
    <section className="w-full bg-[#062A5A] text-white py-10 sm:py-16 lg:py-20 relative overflow-hidden border-y border-[#0969C7]/30">
      {/* Background Graphic Lines echoing the visiting card back */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-15 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border-[1.5px] border-[#F28C18]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border-[1.5px] border-[#159447]" />
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0969C7] to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Firm Name */}
        <h3 className="font-brand text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight text-white mb-1.5 sm:mb-2">
          {FIRM_DETAILS.name}
        </h3>
        <p className="text-[11px] xs:text-xs uppercase tracking-widest text-[#F28C18] font-semibold mb-4 sm:mb-6">
          Chartered Accountants &middot; Mumbai
        </p>

        {/* Core Brand Tagline: Responsive padding & font size to eliminate 320px overflow */}
        <div className="py-2 px-3 xs:px-6 xs:py-2.5 sm:px-8 rounded-xl bg-[#031C3D]/80 border border-[#0969C7]/40 mb-4 sm:mb-5 shadow-lg max-w-full">
          <h2 className="font-manrope text-[13px] xs:text-base sm:text-2xl md:text-3xl font-extrabold tracking-wider text-white uppercase whitespace-nowrap">
            Accuracy &nbsp;<span className="text-[#F28C18]">|</span>&nbsp; Integrity &nbsp;<span className="text-[#159447]">|</span>&nbsp; Growth
          </h2>
        </div>

        {/* Supporting Statement */}
        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed font-light">
          Professional guidance for smarter financial and business decisions.
        </p>

        {/* Micro Credential */}
        <div className="mt-6 sm:mt-8 flex items-center gap-2 text-[11px] xs:text-xs text-slate-300 flex-wrap justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#159447] shrink-0" />
          <span>PAN India Network in Accounting, Taxation &amp; Litigation</span>
        </div>
      </div>
    </section>
  );
};
