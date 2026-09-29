import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  PhoneCall, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { CORE_SERVICES, FIRM_DETAILS, PROCESS_STEPS } from '../data/firmData';
import { ServiceItem } from '../types';

interface ServiceDetailPageProps {
  serviceId: string;
  onBack: () => void;
  onSelectRelated: (serviceId: string) => void;
  onOpenConsultation: () => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onBack,
  onSelectRelated,
  onOpenConsultation
}) => {
  const service: ServiceItem = CORE_SERVICES.find((s) => s.id === serviceId) || CORE_SERVICES[0];
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const relatedServices = CORE_SERVICES.filter((s) => service.relatedServiceIds.includes(s.id));

  return (
    <div className="w-full bg-white text-left min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#667085] mb-6 sm:mb-8 flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1 hover:text-[#062A5A] transition-colors font-medium min-h-[36px]"
          >
            <ArrowLeft size={14} />
            <span>All Services</span>
          </button>
          <span>/</span>
          <span className="text-[#0969C7] font-semibold">{service.name}</span>
        </div>

        {/* H1 & Intro */}
        <div className="border-b border-[#D9E2EC] pb-8 sm:pb-10 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-4 h-[2px] bg-[#F28C18]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              {service.category} Practice
            </span>
          </div>

          <h1 className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-bold text-[#062A5A] tracking-tight leading-[1.15] mb-4 sm:mb-5">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#172033]/90 leading-relaxed max-w-3xl font-normal mb-6 sm:mb-8">
            {service.fullDesc}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <span>Talk to a Chartered Accountant</span>
              <ArrowRight size={15} />
            </button>

            <a
              href={`tel:${FIRM_DETAILS.phone1}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-[#062A5A] bg-[#EEF5FC] hover:bg-[#D9E2EC] rounded-xl transition-colors border border-[#D9E2EC] min-h-[44px]"
            >
              <PhoneCall size={15} className="text-[#F28C18]" />
              <span>Direct Call: {FIRM_DETAILS.phone1}</span>
            </a>
          </div>
        </div>

        {/* H2: What Are Our [Service Name]? */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-3 sm:mb-4 tracking-tight">
            What Are Our {service.name}?
          </h2>
          <p className="text-sm sm:text-base text-[#172033]/85 leading-relaxed mb-6 font-normal">
            At PANJIYAR KRISHNA &amp; CO., our {service.name.toLowerCase()} deliver structured statutory compliance, meticulous reconciliation, and strategic risk-mitigation. We analyze your transactions through the dual prism of regulatory adherence and tax optimization, ensuring full transparency with regulatory authorities such as the Income Tax Department, GST Network, and the Ministry of Corporate Affairs (MCA).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {service.deliverables.map((deliv, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] flex items-start gap-3">
                <CheckCircle2 size={18} className="text-[#159447] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-[#172033] leading-snug">{deliv}</span>
              </div>
            ))}
          </div>
        </section>

        {/* H2: Who Can Benefit From Our Services? */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-3 sm:mb-4 tracking-tight">
            Who Can Benefit From Our Services?
          </h2>
          <p className="text-sm sm:text-base text-[#667085] leading-relaxed mb-5">
            Our practice structures this engagement to address the specific statutory thresholds, business models, and operational complexities across various client categories:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {service.targetAudience.map((aud, i) => (
              <div key={i} className="p-3.5 sm:p-4 rounded-xl bg-white border border-[#D9E2EC] flex items-center gap-3 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#0969C7]" />
                <span className="text-xs sm:text-sm font-semibold text-[#062A5A]">{aud}</span>
              </div>
            ))}
          </div>
        </section>

        {/* H2: [Service Name] We Provide */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-5 tracking-tight">
            {service.name} We Provide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {service.subServices.map((sub, i) => (
              <div key={i} className="p-5 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] text-left">
                <div className="flex items-center gap-2 text-xs font-mono text-[#0969C7] mb-1.5 font-bold">
                  <span>0{i + 1}</span>
                  <span>&middot;</span>
                  <span>Practice Component</span>
                </div>
                <h3 className="font-manrope font-bold text-sm sm:text-base text-[#062A5A] mb-1">
                  {sub}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  Handled with full compliance check, documentation archiving, and verification under ICAI guidelines.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* H2: Documents Required */}
        <section className="mb-10 sm:mb-14 p-6 sm:p-7 rounded-2xl bg-[#EEF5FC] border border-[#D9E2EC]">
          <div className="flex items-center gap-2 mb-2 text-[#062A5A]">
            <FileText size={20} className="text-[#0969C7]" />
            <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#062A5A] tracking-tight">
              Documents Required
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#667085] mb-5">
            To ensure swift processing and zero error, please have the following documents ready for our verification review:
          </p>
          <ul className="space-y-2.5">
            {service.documentsRequired.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#172033]">
                <CheckCircle2 size={16} className="text-[#159447] shrink-0 mt-0.5" />
                <span>{doc}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* H2: Our Process */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-4 tracking-tight">
            Our Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-[#D9E2EC] bg-[#F7F9FC]">
                <div className="text-xs font-bold text-[#F28C18] mb-1">
                  Phase {step.step}
                </div>
                <h3 className="font-manrope font-bold text-sm sm:text-base text-[#062A5A] mb-1">
                  {step.title}
                </h3>
                <p className="text-xs text-[#667085] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* H2: Why Choose PANJIYAR KRISHNA & CO.? */}
        <section className="mb-10 sm:mb-14 p-6 sm:p-8 rounded-2xl bg-[#062A5A] text-white">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">
            Why Choose PANJIYAR KRISHNA &amp; CO.?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm text-slate-200">
            <div>
              <h4 className="font-bold text-white mb-1">Direct Partner Involvement</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                CA Krishna Panjiyar directly reviews high-value returns, scrutiny notices, and financial models.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">Zero Mathematical Compromise</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Multiple levels of review ensure complete reconciliation between books and department portals.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-1">PAN India Virtual Desk</h4>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Secure digital document exchange enabling seamless compliance support anywhere in India.
              </p>
            </div>
          </div>
        </section>

        {/* H2: Frequently Asked Questions */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-5 tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <div key={i} className="border border-[#D9E2EC] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between font-semibold text-sm sm:text-base text-[#062A5A] hover:bg-slate-50 min-h-[48px]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown size={18} className={`text-[#0969C7] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-[#172033]/85 leading-relaxed bg-[#F7F9FC] border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* H2: Related Services */}
        {relatedServices.length > 0 && (
          <section className="mb-12 sm:mb-16">
            <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#062A5A] mb-5 tracking-tight">
              Related Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel.id)}
                  className="p-5 rounded-xl border border-[#D9E2EC] hover:border-[#0969C7] hover:bg-[#EEF5FC] transition-all cursor-pointer group"
                >
                  <h3 className="font-manrope font-bold text-sm sm:text-base text-[#062A5A] group-hover:text-[#0969C7] mb-1">
                    {rel.name}
                  </h3>
                  <p className="text-xs text-[#667085] line-clamp-2 mb-3">
                    {rel.shortDesc}
                  </p>
                  <span className="text-xs font-semibold text-[#0969C7] flex items-center gap-1">
                    View Service <ArrowRight size={12} />
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA: Talk to a Chartered Accountant */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 text-left">
          <div>
            <h3 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A] mb-1">
              Need assistance with {service.name}?
            </h3>
            <p className="text-xs sm:text-sm text-[#667085]">
              Schedule a one-on-one session with CA Krishna Panjiyar to review your requirements.
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl shadow-xs transition-colors shrink-0 min-h-[44px]"
          >
            Talk to a Chartered Accountant
          </button>
        </div>

      </div>
    </div>
  );
};
