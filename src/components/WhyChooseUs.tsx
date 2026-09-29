import React from 'react';
import { Target, Shield, Cog, Headphones, Globe, TrendingUp } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Accuracy',
      desc: 'Careful handling of financial, taxation and compliance requirements.',
      icon: Target,
      accent: '#0969C7'
    },
    {
      title: 'Integrity',
      desc: 'Professional and transparent client relationships rooted in ICAI ethics.',
      icon: Shield,
      accent: '#159447'
    },
    {
      title: 'Practical Approach',
      desc: 'Solutions designed around real business requirements and commercial realities.',
      icon: Cog,
      accent: '#062A5A'
    },
    {
      title: 'Responsive Support',
      desc: 'Clear communication, prompt turnaround and direct partner accessibility.',
      icon: Headphones,
      accent: '#F28C18'
    },
    {
      title: 'PAN India Network',
      desc: 'Service support for clients across India through digitized workflows.',
      icon: Globe,
      accent: '#0969C7'
    },
    {
      title: 'Growth Focused',
      desc: 'Helping clients manage compliance while focusing on sustainable business growth.',
      icon: TrendingUp,
      accent: '#159447'
    }
  ];

  return (
    <section className="w-full bg-[#F7F9FC] py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Client Advantages
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Why {FIRM_DETAILS.name}?
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
            Delivering disciplined financial clarity so you can conduct business with certainty.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-xl p-4 xs:p-5 sm:p-6 border border-[#D9E2EC] shadow-2xs hover:border-[#0969C7] transition-all duration-150 flex flex-col justify-between text-left"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${pt.accent}15`, color: pt.accent }}
                    >
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-mono text-slate-300">0{i + 1}</span>
                  </div>

                  <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5 tracking-tight">
                    {pt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                    {pt.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs font-medium text-[#0969C7]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pt.accent }} />
                  <span>Standard of Practice</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
