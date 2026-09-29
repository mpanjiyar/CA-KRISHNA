import React from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/firmData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="w-full py-10 sm:py-16 lg:py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-full text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            Client Reviews & Trust
          </div>
          <h2 className="text-[22px] xs:text-[26px] sm:text-[32px] md:text-[36px] font-bold text-slate-900 tracking-tight leading-snug">
            Trusted by Entrepreneurs, Corporate Leaders & Individuals
          </h2>
          <p className="mt-2 text-xs xs:text-sm sm:text-base text-slate-600 leading-relaxed">
            Real feedback from growing businesses, startups, and salaried professionals who depend on our precision and advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-xl p-4 xs:p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-0.5">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-xs xs:text-sm text-slate-700 italic leading-relaxed mb-4">
                  "{t.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs xs:text-sm font-semibold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] xs:text-xs text-slate-500">{t.role} • {t.company}</p>
                </div>
                <span className="text-[10px] xs:text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                  {t.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
