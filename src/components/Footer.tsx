import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';
import { BrandHeaderLockup } from './CaLogo';
import { PageRoute } from '../types';

interface FooterProps {
  onNavigate: (route: PageRoute, serviceId?: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsultation }) => {
  return (
    <footer className="w-full bg-[#031C3D] text-white border-t border-[#062A5A] pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 lg:pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 pb-8 sm:pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Logo (lg:col-span-4) */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col text-left">
            <div className="mb-4">
              <BrandHeaderLockup theme="dark" onClick={() => onNavigate('home')} />
            </div>

            <p className="text-xs xs:text-sm text-slate-300 leading-relaxed mb-5 font-light max-w-sm">
              PANJIYAR KRISHNA &amp; CO. is a dedicated Chartered Accountancy practice delivering excellence in tax advisory, statutory compliance, audit, and strategic financial planning across India.
            </p>

            <div className="p-3 xs:p-3.5 rounded-xl bg-white/5 border border-white/10 max-w-sm">
              <div className="text-[10px] xs:text-[11px] uppercase tracking-wider text-[#F28C18] font-bold mb-1">
                Firm Creed
              </div>
              <p className="font-manrope font-bold text-xs xs:text-sm text-white tracking-wide">
                {FIRM_DETAILS.tagline}
              </p>
            </div>
          </div>

          {/* Column 2: Services (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col text-left">
            <h4 className="font-manrope font-bold text-xs uppercase tracking-wider text-[#F28C18] mb-3 sm:mb-4">
              Services
            </h4>
            <ul className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'income-tax')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Income Tax
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'gst-services')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  GST
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'tds-services')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  TDS
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'audit-assurance')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Audit
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'accounting')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Accounting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'roc-compliance')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  ROC &amp; Compliance
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Business & Advisory (lg:col-span-2) */}
          <div className="lg:col-span-2 flex flex-col text-left">
            <h4 className="font-manrope font-bold text-xs uppercase tracking-wider text-[#F28C18] mb-3 sm:mb-4">
              Business
            </h4>
            <ul className="space-y-1.5 xs:space-y-2 text-xs xs:text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'registrations-licenses')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Registrations
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'registrations-licenses')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Licenses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'loan-financing')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Loan &amp; Financing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'startup-advisory')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Startup Advisory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('service-detail', 'accounting')}
                  className="hover:text-white transition-colors py-1 text-left min-h-[32px] inline-flex items-center"
                >
                  Financial Statements
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('location-andheri')}
                  className="hover:text-white transition-colors py-1 text-left text-sky-400 font-medium min-h-[32px] inline-flex items-center"
                >
                  Andheri CA Office
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Office (lg:col-span-4) */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col text-left">
            <h4 className="font-manrope font-bold text-xs uppercase tracking-wider text-[#F28C18] mb-3 sm:mb-4">
              Contact &amp; Office
            </h4>

            <div className="space-y-3 text-xs xs:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#F28C18] shrink-0" />
                <div className="flex items-center gap-2 flex-wrap">
                  <a href={`tel:${FIRM_DETAILS.phone1}`} className="hover:underline text-white font-medium py-1">
                    {FIRM_DETAILS.phone1}
                  </a>
                  <span>/</span>
                  <a href={`tel:${FIRM_DETAILS.phone2}`} className="hover:underline text-white font-medium py-1">
                    {FIRM_DETAILS.phone2}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail size={15} className="text-sky-400 shrink-0" />
                <a href={`mailto:${FIRM_DETAILS.email}`} className="hover:underline text-white break-all py-1">
                  {FIRM_DETAILS.email}
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  102, Shourie Complex, Bombay Bazaar, Andheri (W), Mumbai – 400058, Maharashtra
                </span>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#062A5A] bg-white hover:bg-slate-100 rounded-lg transition-colors min-h-[44px] flex items-center justify-center active:scale-[0.99]"
              >
                Schedule Appointment
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Compliance Disclaimer */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left text-[11px] xs:text-xs">
            &copy; 2026 {FIRM_DETAILS.name} All Rights Reserved.
          </p>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400 flex-wrap justify-center text-[11px] xs:text-xs">
            <span className="hover:text-white cursor-pointer py-1">Privacy Policy</span>
            <span>&middot;</span>
            <span className="hover:text-white cursor-pointer py-1">Terms of Engagement</span>
            <span>&middot;</span>
            <span className="hover:text-white cursor-pointer py-1">Statutory Disclaimer</span>
          </div>
        </div>

        {/* ICAI Mandatory Statutory Disclaimer */}
        <p className="mt-5 sm:mt-6 text-[10px] xs:text-[11px] text-slate-400/80 leading-relaxed text-center max-w-4xl mx-auto">
          Disclaimer: As per the guidelines issued by the Institute of Chartered Accountants of India (ICAI), this website is intended solely for informative purposes and not for the purpose of advertising or soliciting work. The information provided herein does not constitute professional advice.
        </p>

      </div>
    </footer>
  );
};
