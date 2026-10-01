import React from 'react';
import { Award, Globe2, Layers, Compass } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      label: 'Professional Expertise',
      value: 'Chartered Accountancy Services',
      sub: 'Regulatory audit & corporate taxation standards',
      icon: Award
    },
    {
      label: 'Service Coverage',
      value: 'PAN India Support',
      sub: 'Multi-state compliance & remote digital desk',
      icon: Globe2
    },
    {
      label: 'Core Focus',
      value: 'Tax | Compliance | Accounting',
      sub: 'Direct tax, GST, MCA & statutory filings',
      icon: Layers
    },
    {
      label: 'Approach',
      value: 'Accuracy | Integrity | Growth',
      sub: 'Disciplined methodology & trusted client relationships',
      icon: Compass
    }
  ];

  return (
    <section className="w-full bg-[#F7F9FC] border-b border-[#D9E2EC] py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-2.5 xs:p-3 sm:p-5 rounded-xl border border-[#D9E2EC] shadow-2xs flex flex-col justify-between hover:border-[#0969C7] transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
                  <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[#667085] truncate">
                    {item.label}
                  </span>
                  <div className="p-1 sm:p-1.5 rounded-md bg-[#EEF5FC] text-[#062A5A] shrink-0">
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div>
                  <h4 className="font-manrope font-bold text-xs xs:text-sm sm:text-[17px] text-[#062A5A] tracking-tight leading-snug">
                    {item.value}
                  </h4>
                  <p className="text-[10px] xs:text-[11px] sm:text-xs text-[#667085] mt-0.5 sm:mt-1 leading-snug sm:leading-relaxed line-clamp-2">
                    {item.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
