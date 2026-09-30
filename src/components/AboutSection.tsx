import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Landmark, Scale, FileText } from 'lucide-react';
import { CaEmblem } from './CaLogo';
import { useFirmData } from '../context/FirmDataContext';

interface AboutSectionProps {
  onLearnMore: () => void;
  onOpenConsultation: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onLearnMore,
  onOpenConsultation
}) => {
  const { firmDetails, websiteText } = useFirmData();
  return (
    <section className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Narrative & Pillars */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
              <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
                About The Firm
              </span>
            </div>

            <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-[1.18] mb-3.5 sm:mb-5">
              {firmDetails.mainPositioning}
            </h2>

            <p className="text-xs xs:text-sm sm:text-[16px] text-[#172033]/90 leading-[1.65] mb-4 sm:mb-5">
              {websiteText.aboutPillarsText}
            </p>

            <p className="text-xs xs:text-sm text-[#667085] leading-[1.6] mb-6 sm:mb-7">
              Based in {firmDetails.address.locality}, {firmDetails.address.city}, our practice serves a diverse portfolio spanning ambitious startups, established manufacturers, retail merchants, service professionals, and corporate entities nationwide through robust digital audit workflows and direct partner advisory.
            </p>

            {/* 3 Core Commitments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="p-3.5 xs:p-4 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC]">
                <div className="flex items-center gap-2 mb-1.5 text-[#062A5A]">
                  <Scale size={16} className="text-[#0969C7] shrink-0" />
                  <h4 className="font-manrope font-bold text-xs xs:text-sm">Accuracy</h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#667085] leading-relaxed">
                  Zero-tolerance for reporting discrepancies in tax returns and statutory ledgers.
                </p>
              </div>

              <div className="p-3.5 xs:p-4 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC]">
                <div className="flex items-center gap-2 mb-1.5 text-[#062A5A]">
                  <Shield size={16} className="text-[#159447] shrink-0" />
                  <h4 className="font-manrope font-bold text-xs xs:text-sm">Integrity</h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#667085] leading-relaxed">
                  Transparent client advisory rooted in the highest ethical standards of the ICAI.
                </p>
              </div>

              <div className="p-3.5 xs:p-4 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC]">
                <div className="flex items-center gap-2 mb-1.5 text-[#062A5A]">
                  <Landmark size={16} className="text-[#F28C18] shrink-0" />
                  <h4 className="font-manrope font-bold text-xs xs:text-sm">Growth</h4>
                </div>
                <p className="text-[11px] xs:text-xs text-[#667085] leading-relaxed">
                  Guiding sustainable scaling through proactive tax planning and financial modeling.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
              <button
                onClick={onLearnMore}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shadow-xs min-h-[44px]"
              >
                <span>Know More About Us</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-[#0969C7] hover:text-[#062A5A] hover:bg-[#EEF5FC] rounded-xl transition-colors border border-[#D9E2EC] min-h-[44px]"
              >
                <span>Request Client Discussion</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual CA Workspace Mockup & Integrated Founder Badge */}
          <div className="lg:col-span-5 flex flex-col items-center w-full">
            {/* Styled Architectural Workspace Composition */}
            <div className="w-full max-w-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#062A5A] via-[#0969C7]/90 to-[#031C3D] p-1 shadow-xl">
              
              {/* Internal Mockup Display Container */}
              <div className="bg-[#031C3D] rounded-[14px] p-3.5 xs:p-4 sm:p-6 text-white relative overflow-hidden">
                {/* Visual architectural blueprint lines */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-[#0969C7]/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#F28C18]/10 rounded-full blur-xl pointer-events-none" />

                {/* Workspace Header Graphic */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5">
                  <div className="min-w-0">
                    <div className="text-[10px] xs:text-[11px] font-semibold uppercase tracking-wider text-[#F28C18] truncate">
                      Chartered Accountancy
                    </div>
                    <div className="text-sm xs:text-base font-bold text-white font-brand truncate">
                      PANJIYAR KRISHNA &amp; CO.
                    </div>
                  </div>
                  <div className="text-[9.5px] xs:text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-200 shrink-0">
                    MUMBAI
                  </div>
                </div>

                {/* Conceptual CA Ledger and File Stack Mockup */}
                <div className="space-y-2 mb-3.5">
                  <div className="p-2.5 xs:p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded bg-[#0969C7]/30 text-white shrink-0">
                        <FileText size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">Direct &amp; Indirect Tax Filings</div>
                        <div className="text-[9.5px] xs:text-[10px] text-slate-400 truncate">ITR 1-7 &middot; GSTR-1, 3B, 9 &amp; 9C</div>
                      </div>
                    </div>
                    <span className="text-[9.5px] xs:text-[10px] text-[#159447] font-semibold flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={11} /> Compliant
                    </span>
                  </div>

                  <div className="p-2.5 xs:p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded bg-[#F28C18]/20 text-[#F28C18] shrink-0">
                        <Landmark size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">CMA &amp; Project Financing Models</div>
                        <div className="text-[9.5px] xs:text-[10px] text-slate-400 truncate">Bank Working Capital &amp; Term Loans</div>
                      </div>
                    </div>
                    <span className="text-[9.5px] xs:text-[10px] text-[#F28C18] font-semibold shrink-0">Bank-Ready</span>
                  </div>

                  <div className="p-2.5 xs:p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1 rounded bg-[#159447]/20 text-[#159447] shrink-0">
                        <Shield size={15} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">Statutory &amp; Internal Audit</div>
                        <div className="text-[9.5px] xs:text-[10px] text-slate-400 truncate">ICAI Assurance &amp; Risk Governance</div>
                      </div>
                    </div>
                    <span className="text-[9.5px] xs:text-[10px] text-slate-300 font-semibold shrink-0">Rigorous</span>
                  </div>
                </div>

                {/* Office Location Address Strip */}
                <div className="pt-2.5 border-t border-white/10 text-[10px] xs:text-[11px] text-slate-400 flex items-center justify-between gap-2">
                  <span className="truncate">102, Shourie Complex, Bombay Bazaar</span>
                  <span className="text-slate-300 font-medium shrink-0">Andheri (W)</span>
                </div>
              </div>
            </div>

            {/* Dedicated Leadership Card */}
            <div className="w-full max-w-[420px] mt-3 bg-white rounded-xl shadow-xs border border-[#D9E2EC] p-3 flex items-center gap-2.5 xs:gap-3">
              <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-full bg-[#062A5A] text-white flex items-center justify-center font-bold text-xs xs:text-sm shrink-0 shadow-2xs">
                KP
              </div>
              <div className="text-left min-w-0 flex-1">
                <h5 className="font-manrope font-bold text-xs xs:text-sm text-[#062A5A] leading-tight truncate">
                  {firmDetails.founder}
                </h5>
                <p className="text-[10.5px] xs:text-xs text-[#0969C7] font-medium mt-0.5 truncate">
                  {firmDetails.founderTitle}
                </p>
              </div>
              <span className="text-[10px] xs:text-[11px] font-semibold text-[#159447] bg-[#159447]/10 px-2 py-0.5 rounded-full shrink-0">
                ICAI Verified
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
