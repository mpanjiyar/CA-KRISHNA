import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';

interface LocationAndheriPageProps {
  onOpenConsultation: () => void;
  onSelectService: (serviceId: string) => void;
}

export const LocationAndheriPage: React.FC<LocationAndheriPageProps> = ({
  onOpenConsultation,
  onSelectService
}) => {
  return (
    <div className="w-full bg-white text-left min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-[#667085] mb-6 flex items-center gap-1.5 flex-wrap">
          <span>Home</span> / <span className="text-[#0969C7] font-semibold">Chartered Accountants in Andheri, Mumbai</span>
        </div>

        {/* H1 & Local Intro */}
        <div className="border-b border-[#D9E2EC] pb-8 sm:pb-10 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-[#F28C18]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Verified Head Office &middot; Andheri West
            </span>
          </div>

          <h1 className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-bold text-[#062A5A] tracking-tight leading-[1.12] mb-4">
            Chartered Accountants in Andheri, Mumbai
          </h1>

          <p className="text-base sm:text-lg text-[#172033]/90 leading-relaxed max-w-3xl mb-6 sm:mb-8 font-normal">
            Looking for an established Chartered Accountant in Andheri West? <strong className="font-semibold text-[#062A5A]">PANJIYAR KRISHNA &amp; CO.</strong> provides trusted income tax filing, corporate audit, GST compliance, company registration, and loan documentation services from our office at Bombay Bazaar, Andheri (W), Mumbai.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl shadow-sm transition-colors min-h-[44px]"
            >
              <span>Book Appointment at Andheri Office</span>
              <ArrowRight size={15} />
            </button>

            <a
              href={`tel:${FIRM_DETAILS.phone1}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#062A5A] bg-[#EEF5FC] hover:bg-[#D9E2EC] rounded-xl transition-colors border border-[#D9E2EC] min-h-[44px]"
            >
              <Phone size={15} className="text-[#F28C18]" />
              <span>Call: {FIRM_DETAILS.phone1}</span>
            </a>
          </div>
        </div>

        {/* CA Services in Andheri Section */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-3 sm:mb-4 tracking-tight">
            CA Services in Andheri, Mumbai
          </h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed mb-6">
            Situated in the bustling commercial heart of Andheri West, our firm caters to retail entrepreneurs, exporters, healthcare clinics, IT consultancies, and manufacturing businesses situated across Andheri, Juhu, Lokhandwala, Versova, Oshiwara, and MIDC.
          </p>

          {/* Grid of Key Local Practice Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col justify-between">
              <div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                  Income Tax Services in Andheri
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                  Personal and corporate ITR filing, capital gains computation from property sales, and direct assistance with faceless tax notices.
                </p>
              </div>
              <button
                onClick={() => onSelectService('income-tax')}
                className="text-xs font-semibold text-[#0969C7] hover:underline text-left flex items-center gap-1 min-h-[36px]"
              >
                Learn More &rarr;
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col justify-between">
              <div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                  GST Services in Andheri
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                  Maharashtra GST registration, GSTR-1 &amp; 3B monthly returns, input credit reconciliation, and dispute representation.
                </p>
              </div>
              <button
                onClick={() => onSelectService('gst-services')}
                className="text-xs font-semibold text-[#0969C7] hover:underline text-left flex items-center gap-1 min-h-[36px]"
              >
                Learn More &rarr;
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col justify-between">
              <div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                  Accounting Services in Andheri
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                  Cloud and on-premise ledger maintenance, periodic bank reconciliations, Tally/Zoho accounting, and management MIS reports.
                </p>
              </div>
              <button
                onClick={() => onSelectService('accounting')}
                className="text-xs font-semibold text-[#0969C7] hover:underline text-left flex items-center gap-1 min-h-[36px]"
              >
                Learn More &rarr;
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col justify-between">
              <div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                  Audit &amp; Assurance
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                  Statutory audit under Companies Act 2013, Tax Audit under Section 44AB, internal control evaluations, and stock verification.
                </p>
              </div>
              <button
                onClick={() => onSelectService('audit-assurance')}
                className="text-xs font-semibold text-[#0969C7] hover:underline text-left flex items-center gap-1 min-h-[36px]"
              >
                Learn More &rarr;
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col justify-between">
              <div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                  Business &amp; Company Registration
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                  Private Limited company formation, LLP agreements, Maharashtra Gumasta license, MSME registration, and Professional Tax.
                </p>
              </div>
              <button
                onClick={() => onSelectService('roc-compliance')}
                className="text-xs font-semibold text-[#0969C7] hover:underline text-left flex items-center gap-1 min-h-[36px]"
              >
                Learn More &rarr;
              </button>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col justify-between">
              <div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                  Loan &amp; Financing Support
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed mb-4">
                  Bank-ready CMA data, projected balance sheets, DSCR calculations, and CA net worth certificates for Mumbai bank branches.
                </p>
              </div>
              <button
                onClick={() => onSelectService('loan-financing')}
                className="text-xs font-semibold text-[#0969C7] hover:underline text-left flex items-center gap-1 min-h-[36px]"
              >
                Learn More &rarr;
              </button>
            </div>

          </div>
        </section>

        {/* Our Andheri Office Details & Map */}
        <section className="mb-10 sm:mb-14 p-6 sm:p-8 rounded-2xl bg-[#EEF5FC] border border-[#D9E2EC]">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-6 tracking-tight">
            Our Andheri Office
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center mb-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#F28C18] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="text-[#062A5A] block mb-0.5">Physical Address:</strong>
                  <span>102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058, Maharashtra</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#0969C7] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="text-[#062A5A] block mb-0.5">Working Hours:</strong>
                  <span>Monday to Saturday: 9:30 AM to 7:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#159447] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="text-[#062A5A] block mb-0.5">Direct Lines:</strong>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`tel:${FIRM_DETAILS.phone1}`} className="text-[#062A5A] font-semibold hover:underline">
                      {FIRM_DETAILS.phone1}
                    </a>
                    <span>/</span>
                    <a href={`tel:${FIRM_DETAILS.phone2}`} className="text-[#062A5A] font-semibold hover:underline">
                      {FIRM_DETAILS.phone2}
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#0969C7] shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <strong className="text-[#062A5A] block mb-0.5">Email:</strong>
                  <a href={`mailto:${FIRM_DETAILS.email}`} className="text-[#062A5A] hover:underline break-all">
                    {FIRM_DETAILS.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#D9E2EC] h-60 sm:h-64 bg-slate-200 shadow-xs">
              <iframe
                title="Andheri Office Map"
                src="https://maps.google.com/maps?q=102%20Shourie%20Complex%20Bombay%20Bazaar%20Andheri%20West%20Mumbai%20400058&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Contact CA Krishna Panjiyar CTA */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#062A5A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h3 className="font-manrope font-bold text-lg sm:text-xl lg:text-2xl text-white mb-1">
              Contact CA Krishna Panjiyar in Andheri
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Founder &amp; Chartered Accountant &middot; Practice Office at Shourie Complex
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenConsultation}
              className="flex-1 sm:flex-none px-5 py-3 text-xs sm:text-sm font-semibold bg-white text-[#062A5A] hover:bg-slate-100 rounded-xl transition-colors min-h-[44px]"
            >
              Book Consultation
            </button>
            <a
              href={`tel:${FIRM_DETAILS.phone1}`}
              className="flex-1 sm:flex-none px-5 py-3 text-xs sm:text-sm font-semibold bg-[#0969C7] text-white hover:bg-[#085cb0] rounded-xl transition-colors text-center min-h-[44px]"
            >
              Call Now
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
