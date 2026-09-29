import React, { useState } from 'react';
import { 
  Rocket, 
  ShoppingBag, 
  Factory, 
  Building2, 
  Briefcase, 
  Activity, 
  Cpu, 
  PackageCheck, 
  Utensils, 
  Building,
  ArrowRight
} from 'lucide-react';
import { INDUSTRIES_SERVED } from '../data/firmData';

interface IndustriesSectionProps {
  onOpenConsultation: () => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onOpenConsultation }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  const getIndustryIcon = (name: string) => {
    switch (name) {
      case 'Startups & Entrepreneurs':
        return <Rocket className="w-5 h-5 text-[#0969C7]" />;
      case 'Retail & Trading':
        return <ShoppingBag className="w-5 h-5 text-[#0969C7]" />;
      case 'Manufacturing':
        return <Factory className="w-5 h-5 text-[#0969C7]" />;
      case 'Real Estate & Infrastructure':
        return <Building2 className="w-5 h-5 text-[#0969C7]" />;
      case 'Professional Services':
        return <Briefcase className="w-5 h-5 text-[#0969C7]" />;
      case 'Healthcare & Pharma':
        return <Activity className="w-5 h-5 text-[#0969C7]" />;
      case 'Technology & SaaS':
        return <Cpu className="w-5 h-5 text-[#0969C7]" />;
      case 'FMCG & Distribution':
        return <PackageCheck className="w-5 h-5 text-[#0969C7]" />;
      case 'Hospitality & Restaurants':
        return <Utensils className="w-5 h-5 text-[#0969C7]" />;
      default:
        return <Building className="w-5 h-5 text-[#0969C7]" />;
    }
  };

  return (
    <section id="industries-section" className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC] scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Sector Expertise
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Industries We Serve
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
            Every sector encounters distinct tax rules, depreciation models and regulatory reporting requirements. We craft sector-specific solutions tailored to your operational realities.
          </p>
        </div>

        {/* 10 Industry Cards: 1 col on xs, 2 on sm, 3 on md, 5 on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {INDUSTRIES_SERVED.map((ind, idx) => {
            const isSelected = selectedIndustry === ind.name;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => setSelectedIndustry(isSelected ? null : ind.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedIndustry(isSelected ? null : ind.name);
                  }
                }}
                className={`p-3.5 xs:p-4 sm:p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-[#0969C7] min-h-[150px] ${
                  isSelected
                    ? 'bg-[#EEF5FC] border-[#0969C7] shadow-xs ring-1 ring-[#0969C7]'
                    : 'bg-white border-[#D9E2EC] hover:border-[#0969C7]/50 hover:bg-[#F7F9FC]'
                }`}
              >
                <div>
                  <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-lg bg-[#EEF5FC] flex items-center justify-center mb-2.5">
                    {getIndustryIcon(ind.name)}
                  </div>

                  <h3 className="font-manrope font-bold text-sm xs:text-base text-[#062A5A] mb-1 leading-snug">
                    {ind.name}
                  </h3>

                  <p className="text-xs text-[#667085] leading-relaxed line-clamp-2">
                    {ind.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-[#0969C7]">
                  <span>{isSelected ? 'Selected' : 'View Advisory'}</span>
                  <ArrowRight size={12} className={isSelected ? 'rotate-90 transition-transform' : ''} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Detail Card if an industry is clicked */}
        {selectedIndustry && (
          <div className="mt-6 sm:mt-8 p-4 xs:p-5 sm:p-7 rounded-2xl bg-[#062A5A] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 animate-in fade-in duration-200">
            <div className="text-left">
              <div className="flex items-center gap-2 text-[11px] xs:text-xs uppercase tracking-wider text-[#F28C18] font-bold mb-1">
                <span>Active Sector Scope</span>
                <span>&middot;</span>
                <span>{selectedIndustry}</span>
              </div>
              <h4 className="font-manrope font-bold text-base xs:text-lg sm:text-xl text-white">
                Comprehensive Compliance &amp; Tax Solutions for {selectedIndustry}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                We handle statutory audit readiness, GST reconciliations, transaction structuring, and dedicated business consulting tailored for this sector.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-4 xs:px-5 py-2.5 text-xs sm:text-sm font-semibold bg-[#F28C18] hover:bg-[#d97c14] text-white rounded-xl transition-colors min-h-[42px]"
              >
                Consult Sector CA
              </button>
              <button
                onClick={() => setSelectedIndustry(null)}
                className="px-3 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white min-h-[42px]"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
