import React from 'react';
import { PhoneCall, Calendar, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';

interface FinalHomeCtaProps {
  onOpenConsultation: () => void;
}

export const FinalHomeCta: React.FC<FinalHomeCtaProps> = ({ onOpenConsultation }) => {
  return (
    <section className="w-full bg-gradient-to-br from-[#0B3B7B] via-[#093268] to-[#06244D] text-white py-10 sm:py-16 lg:py-20 relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-medium text-amber-300 mb-3 sm:mb-4">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Strict Statutory Confidentiality Guaranteed</span>
          </div>

          <h2 className="text-[22px] xs:text-[26px] sm:text-[34px] md:text-[40px] font-bold tracking-tight leading-snug">
            Ready for Worry-Free Tax & Compliance Management?
          </h2>

          <p className="mt-2.5 sm:mt-4 text-xs xs:text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Connect directly with CA Krishna Panjiyar's practice. Experience seamless corporate filings, precision audits, and nationwide financial advisory.
          </p>

          {/* Action buttons with 320px-safe flex wrap and min-h-44px */}
          <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-stretch sm:items-center justify-center gap-3">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs xs:text-sm shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all min-h-[44px]"
            >
              <Calendar className="w-4 h-4 text-slate-900" />
              <span>Schedule Direct Consultation</span>
            </button>

            <a
              href={`tel:${(FIRM_DETAILS.phone1 || FIRM_DETAILS.phones?.[0] || '').replace(/[^0-9+]/g, '')}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs xs:text-sm backdrop-blur-sm active:scale-[0.99] transition-all min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>Call: {FIRM_DETAILS.phone1 || FIRM_DETAILS.phones?.[0]}</span>
            </a>
          </div>

          <div className="mt-6 sm:mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-[11px] xs:text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Fast 24-Hour Response</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>ICAI-Compliant Practice</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Pan-India Virtual Desk</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
