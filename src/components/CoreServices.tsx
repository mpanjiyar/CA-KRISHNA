import React from 'react';
import { 
  FileSpreadsheet, 
  Receipt, 
  Percent, 
  FileCheck2, 
  FileSignature, 
  TrendingUp, 
  BookOpenCheck, 
  Rocket,
  ArrowRight
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

interface CoreServicesProps {
  onSelectService: (serviceId: string) => void;
  onOpenConsultation: () => void;
}

export const CoreServices: React.FC<CoreServicesProps> = ({
  onSelectService,
  onOpenConsultation
}) => {
  const { services } = useFirmData();
  // Mapping icons to service cards
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'income-tax':
        return <FileSpreadsheet className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'gst-services':
        return <Receipt className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'tds-services':
        return <Percent className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'audit-assurance':
        return <FileCheck2 className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'registrations-licenses':
        return <FileSignature className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'loan-financing':
        return <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'accounting':
        return <BookOpenCheck className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      case 'startup-advisory':
        return <Rocket className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
      default:
        return <FileSpreadsheet className="w-5 h-5 xs:w-6 xs:h-6 text-[#0969C7]" />;
    }
  };

  return (
    <section id="services-section" className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC] scroll-mt-24 sm:scroll-mt-28">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Practicing Spectrum
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Our Services
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#667085] leading-relaxed">
            Professional Solutions for Your Accounting, Taxation, Compliance &amp; Growth Requirements
          </p>
        </div>

        {/* 8 Service Cards Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => onSelectService(service.id)}
              className="group relative bg-white rounded-xl p-3 xs:p-3.5 sm:p-6 border border-[#D9E2EC] shadow-2xs flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[#0969C7] overflow-hidden text-left"
            >
              {/* Orange line animation on top edge upon hover */}
              <div className="absolute top-0 left-0 w-full h-[2.5px] sm:h-[3px] bg-[#F28C18] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />

              <div>
                {/* Icon Container with subtle upward movement */}
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-12 sm:h-12 rounded-lg bg-[#EEF5FC] flex items-center justify-center mb-2 sm:mb-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:bg-[#062A5A]/5">
                  {getServiceIcon(service.id)}
                </div>

                {/* Service Name */}
                <h3 className="font-manrope font-bold text-xs xs:text-sm sm:text-[16px] md:text-[17px] text-[#062A5A] tracking-tight mb-1 group-hover:text-[#0969C7] transition-colors leading-snug line-clamp-1 sm:line-clamp-none">
                  {service.name}
                </h3>

                {/* Short 2-line Description */}
                <p className="text-[10px] xs:text-[11px] sm:text-sm text-[#667085] leading-snug sm:leading-relaxed line-clamp-2 mb-2.5 sm:mb-4">
                  {service.shortDesc}
                </p>
              </div>

              {/* Action Link: Learn More -> */}
              <div className="pt-2 sm:pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10.5px] xs:text-xs font-semibold text-[#0969C7] group-hover:text-[#062A5A] transition-colors">
                <span>Details</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Fast Action Prompt */}
        <div className="mt-8 sm:mt-10 p-4 xs:p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col sm:flex-row items-center justify-between gap-3.5 sm:gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-manrope font-bold text-xs xs:text-sm sm:text-base text-[#062A5A]">
              Looking for tailored advisory for your enterprise?
            </h4>
            <p className="text-[11px] xs:text-xs sm:text-sm text-[#667085] mt-0.5">
              Discuss specific tax, audit or financing mandates with CA Krishna Panjiyar.
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shrink-0 shadow-xs min-h-[42px]"
          >
            Schedule Consultation
          </button>
        </div>

      </div>
    </section>
  );
};
