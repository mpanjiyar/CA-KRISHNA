import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone, X } from 'lucide-react';
import { GENERAL_FAQS, FIRM_DETAILS } from '../data/firmData';

interface FaqSectionProps {
  onOpenConsultation: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenConsultation }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAllModal, setShowAllModal] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Close modal with Escape key & lock scroll
  useEffect(() => {
    if (!showAllModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAllModal(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showAllModal]);

  return (
    <section id="faq-section" className="w-full bg-[#F7F9FC] py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC] scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-4xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-5 h-[2px] bg-[#0969C7]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Common Queries
            </span>
            <span className="w-5 h-[2px] bg-[#0969C7]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[34px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Frequently Asked Questions
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
            Clear answers regarding our Chartered Accountancy engagement, fees, statutory procedures and timelines.
          </p>
        </div>

        {/* 8 FAQs Accordion */}
        <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-10 text-left">
          {GENERAL_FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#D9E2EC] shadow-2xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-3.5 px-4 sm:py-4 sm:px-6 flex items-center justify-between text-left gap-3 sm:gap-4 hover:bg-slate-50 transition-colors min-h-[48px]"
                  aria-expanded={isOpen}
                >
                  <span className="font-manrope font-semibold text-xs xs:text-sm sm:text-base text-[#062A5A] leading-snug">
                    {faq.question}
                  </span>
                  <div className={`p-1 rounded-full text-[#0969C7] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-6 sm:pb-4 pt-1 text-xs xs:text-sm text-[#172033]/85 leading-relaxed border-t border-slate-100 bg-[#FFFFFF]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View All FAQs and Direct Query Assistance */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            onClick={() => setShowAllModal(true)}
            className="w-full sm:w-auto px-5 py-3 text-xs xs:text-sm font-semibold text-[#062A5A] bg-white border border-[#D9E2EC] hover:bg-[#EEF5FC] rounded-xl transition-colors shadow-2xs min-h-[44px] flex items-center justify-center"
          >
            View All FAQs &amp; Statutory Guidelines
          </button>

          <a
            href={`tel:${FIRM_DETAILS.phone1}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs xs:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shadow-2xs min-h-[44px]"
          >
            <Phone size={15} className="text-[#F28C18]" />
            <span>Speak With CA Krishna Panjiyar</span>
          </a>
        </div>

      </div>

      {/* Extended All FAQs Modal */}
      {showAllModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAllModal(false);
          }}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-[#D9E2EC] overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto text-left">
            <div className="p-4 sm:p-6 border-b border-[#D9E2EC] flex items-center justify-between bg-[#F7F9FC]">
              <div>
                <h3 className="font-manrope font-bold text-sm sm:text-lg text-[#062A5A]">
                  Chartered Accountancy FAQs &amp; Engagement Policies
                </h3>
                <p className="text-[11px] xs:text-xs text-[#667085] mt-0.5">
                  PANJIYAR KRISHNA &amp; CO. &middot; Compliance Guide
                </p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-lg min-h-[40px] min-w-[40px] flex items-center justify-center"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left">
              {GENERAL_FAQS.map((faq, i) => (
                <div key={i} className="pb-3.5 border-b border-slate-100 last:border-0">
                  <h4 className="font-semibold text-xs xs:text-sm sm:text-base text-[#062A5A] mb-1">
                    {faq.question}
                  </h4>
                  <p className="text-xs xs:text-sm text-[#667085] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 sm:p-4 border-t border-[#D9E2EC] bg-[#F7F9FC] flex justify-end">
              <button
                onClick={() => setShowAllModal(false)}
                className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 min-h-[38px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
