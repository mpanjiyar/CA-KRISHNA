import React from 'react';
import { Search, FileSearch, CheckCircle, LifeBuoy } from 'lucide-react';
import { PROCESS_STEPS } from '../data/firmData';

export const ProcessTimeline: React.FC = () => {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Search className="w-5 h-5 text-[#0969C7]" />;
      case 1:
        return <FileSearch className="w-5 h-5 text-[#0969C7]" />;
      case 2:
        return <CheckCircle className="w-5 h-5 text-[#0969C7]" />;
      case 3:
        return <LifeBuoy className="w-5 h-5 text-[#0969C7]" />;
      default:
        return <Search className="w-5 h-5 text-[#0969C7]" />;
    }
  };

  return (
    <section className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Disciplined Methodology
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            How We Work
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
            A structured, transparent workflow designed to guarantee accuracy, prevent compliance lapses, and keep you informed at every milestone.
          </p>
        </div>

        {/* 4-Step Timeline Grid with Connecting Indicator Line */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-[#D9E2EC] via-[#0969C7]/40 to-[#D9E2EC] -translate-y-8 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative z-10">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="bg-[#F7F9FC] rounded-2xl p-4 xs:p-5 sm:p-6 border border-[#D9E2EC] hover:border-[#0969C7] hover:bg-white transition-all duration-200 shadow-2xs flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Step Badge with Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 xs:w-11 xs:h-11 rounded-xl bg-white group-hover:bg-[#EEF5FC] border border-[#D9E2EC] group-hover:border-[#0969C7] flex items-center justify-center transition-colors">
                      {getStepIcon(idx)}
                    </div>
                    <span className="font-manrope font-extrabold text-xl xs:text-2xl text-[#D9E2EC] group-hover:text-[#0969C7] transition-colors">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5 tracking-tight group-hover:text-[#0969C7] transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-200/60 flex items-center gap-1.5 text-xs text-[#062A5A] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F28C18]" />
                  <span>Phase {step.step} Milestone</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
