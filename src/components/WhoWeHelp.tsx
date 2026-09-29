import React from 'react';
import { User, Store, Lightbulb, Stethoscope, Building, Landmark, CheckCircle2 } from 'lucide-react';
import { WHO_WE_HELP } from '../data/firmData';

interface WhoWeHelpProps {
  onOpenConsultation: () => void;
}

export const WhoWeHelp: React.FC<WhoWeHelpProps> = ({ onOpenConsultation }) => {
  const getIcon = (title: string) => {
    switch (title) {
      case 'Individuals':
        return <User className="w-5 h-5 text-[#0969C7]" />;
      case 'Businesses':
        return <Store className="w-5 h-5 text-[#0969C7]" />;
      case 'Startups':
        return <Lightbulb className="w-5 h-5 text-[#0969C7]" />;
      case 'Professionals':
        return <Stethoscope className="w-5 h-5 text-[#0969C7]" />;
      case 'Companies':
        return <Building className="w-5 h-5 text-[#0969C7]" />;
      case 'Borrowers':
        return <Landmark className="w-5 h-5 text-[#0969C7]" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#0969C7]" />;
    }
  };

  return (
    <section className="w-full bg-[#F7F9FC] py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Client Cohorts
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Who We Help
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
            Tailored Chartered Accountancy solutions designed around the specific regulatory thresholds, compliance frequencies, and financial requirements of each category.
          </p>
        </div>

        {/* 6 Segment Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {WHO_WE_HELP.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 xs:p-5 sm:p-6 border border-[#D9E2EC] shadow-2xs flex flex-col justify-between text-left hover:border-[#0969C7] transition-colors"
            >
              <div>
                <div className="w-9 h-9 xs:w-10 xs:h-10 rounded-lg bg-[#EEF5FC] flex items-center justify-center mb-3">
                  {getIcon(item.title)}
                </div>

                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5 tracking-tight">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#0969C7]">
                <span>Specialized Practice</span>
                <span className="text-[#F28C18]">&rarr;</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Consultation Link */}
        <div className="mt-8 text-center">
          <button
            onClick={onOpenConsultation}
            className="inline-flex items-center gap-2 text-xs xs:text-sm font-semibold text-[#062A5A] hover:text-[#0969C7] transition-colors min-h-[44px] py-1"
          >
            <span>Have a specific requirement? Connect with our team</span>
            <span className="text-[#F28C18]">&rarr;</span>
          </button>
        </div>

      </div>
    </section>
  );
};
