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
    <section className="w-full bg-[#F7F9FC] border-b border-[#D9E2EC] py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-3.5 xs:p-4 sm:p-5 rounded-xl border border-[#D9E2EC] shadow-2xs flex flex-col justify-between hover:border-[#0969C7] transition-colors text-left"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10.5px] xs:text-xs font-semibold uppercase tracking-wider text-[#667085]">
                    {item.label}
                  </span>
                  <div className="p-1.5 rounded-md bg-[#EEF5FC] text-[#062A5A]">
                    <Icon size={15} />
                  </div>
                </div>

                <div>
                  <h4 className="font-manrope font-bold text-sm xs:text-[15px] sm:text-[17px] text-[#062A5A] tracking-tight leading-snug">
                    {item.value}
                  </h4>
                  <p className="text-[11px] xs:text-xs text-[#667085] mt-1 leading-relaxed">
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
