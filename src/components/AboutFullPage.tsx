import React from 'react';
import { ShieldCheck, Target } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';
import { CaEmblem } from './CaLogo';

interface AboutFullPageProps {
  onOpenConsultation: () => void;
  onNavigateToIndustries: () => void;
  onNavigateToContact: () => void;
}

export const AboutFullPage: React.FC<AboutFullPageProps> = ({
  onOpenConsultation,
  onNavigateToIndustries,
  onNavigateToContact
}) => {
  return (
    <div className="w-full bg-white text-left min-h-screen py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-[#667085] mb-6 flex items-center gap-1.5 flex-wrap">
          <span>Home</span> / <span className="text-[#0969C7] font-semibold">About PANJIYAR KRISHNA &amp; CO.</span>
        </div>

        {/* H1 & Header */}
        <div className="border-b border-[#D9E2EC] pb-8 sm:pb-10 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-5 h-[2px] bg-[#F28C18]" />
            <span className="text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Firm Overview &amp; Leadership
            </span>
          </div>

          <h1 className="font-manrope text-[28px] sm:text-[38px] lg:text-[44px] font-bold text-[#062A5A] tracking-tight leading-[1.12] mb-4 sm:mb-5">
            About PANJIYAR KRISHNA &amp; CO.
          </h1>

          <p className="text-base sm:text-lg text-[#172033]/90 leading-relaxed max-w-3xl font-normal">
            PANJIYAR KRISHNA &amp; CO. is an established Chartered Accountancy firm headquartered in Andheri (W), Mumbai. We provide end-to-end accounting, taxation, GST, audit, corporate compliance, and business financing solutions across India with a relentless focus on accuracy and client trust.
          </p>
        </div>

        {/* Section: Our Firm */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-3 sm:mb-4 tracking-tight">
            Our Firm
          </h2>
          <p className="text-sm sm:text-base text-[#172033]/85 leading-relaxed mb-5 font-normal">
            At PANJIYAR KRISHNA &amp; CO., we combine professional Chartered Accountancy expertise with a practical understanding of business, taxation, accounting and regulatory compliance. Our focus is to provide accurate, transparent and dependable financial solutions that help individuals and businesses make informed decisions and grow with confidence.
          </p>
          <div className="p-5 sm:p-6 rounded-2xl bg-[#EEF5FC] border border-[#D9E2EC] text-xs sm:text-sm text-[#062A5A] leading-relaxed">
            <p>
              &ldquo;{FIRM_DETAILS.supportingPositioning}&rdquo;
            </p>
          </div>
        </section>

        {/* Section: CA Krishna Panjiyar */}
        <section className="mb-10 sm:mb-14 p-6 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-white border border-[#D9E2EC] shadow-sm mb-3">
                <CaEmblem sizePx={72} />
              </div>
              <h3 className="font-brand font-bold text-base sm:text-lg text-[#062A5A]">
                {FIRM_DETAILS.founder}
              </h3>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#0969C7]">
                {FIRM_DETAILS.founderTitle}
              </p>
            </div>

            <div className="md:col-span-8">
              <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#062A5A] mb-1.5 tracking-tight">
                CA Krishna Panjiyar
              </h2>
              <p className="text-xs font-semibold text-[#0969C7] uppercase tracking-wider mb-3">
                Founder &amp; Chartered Accountant
              </p>
              <p className="text-xs sm:text-sm text-[#172033]/90 leading-relaxed mb-5">
                CA Krishna Panjiyar leads PANJIYAR KRISHNA &amp; CO. with a focus on accuracy, professional integrity, responsive service and long-term client relationships. Under his leadership, the firm has established a reputation for meticulous regulatory documentation, proactive tax planning, and strategic loan syndication.
              </p>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`tel:${FIRM_DETAILS.phone1}`}
                  className="px-4 py-2 text-xs font-semibold bg-[#062A5A] text-white rounded-lg hover:bg-[#031C3D] min-h-[38px] flex items-center"
                >
                  Call {FIRM_DETAILS.phone1}
                </a>
                <a
                  href={`tel:${FIRM_DETAILS.phone2}`}
                  className="px-4 py-2 text-xs font-semibold bg-[#EEF5FC] text-[#062A5A] border border-[#D9E2EC] rounded-lg min-h-[38px] flex items-center"
                >
                  Call {FIRM_DETAILS.phone2}
                </a>
                <a
                  href={`mailto:${FIRM_DETAILS.email}`}
                  className="px-4 py-2 text-xs font-semibold text-[#0969C7] hover:underline min-h-[38px] flex items-center break-all"
                >
                  {FIRM_DETAILS.email}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Mission & Vision */}
        <section className="mb-10 sm:mb-14 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#D9E2EC] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEF5FC] text-[#0969C7] flex items-center justify-center mb-4">
              <Target size={20} />
            </div>
            <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A] mb-2">
              Our Mission
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              To deliver unambiguous, error-free financial and compliance solutions that liberate entrepreneurs and business leaders to focus squarely on core enterprise expansion with zero regulatory anxiety.
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-white border border-[#D9E2EC] shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#EEF5FC] text-[#159447] flex items-center justify-center mb-4">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A] mb-2">
              Our Vision
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              To stand as India&apos;s most dependable Chartered Accountancy practice, renowned for combining rigorous technical discipline with genuine client care, transparent ethics, and PAN India digital agility.
            </p>
          </div>
        </section>

        {/* Section: Our Professional Values (Accuracy, Integrity, Growth) */}
        <section className="mb-10 sm:mb-14">
          <h2 className="font-manrope text-xl sm:text-2xl lg:text-3xl font-bold text-[#062A5A] mb-5 sm:mb-6 tracking-tight">
            Our Professional Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC]">
              <div className="text-xs font-bold text-[#0969C7] uppercase tracking-wider mb-2">
                First Pillar
              </div>
              <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                Accuracy
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Precision down to the last decimal in tax calculations, ledger balances, and statutory disclosures. We believe exactness is non-negotiable.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC]">
              <div className="text-xs font-bold text-[#159447] uppercase tracking-wider mb-2">
                Second Pillar
              </div>
              <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                Integrity
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Upholding the fiduciary oath of the Chartered Accountant. Transparent client counsel, absolute confidentiality, and ethical advocacy.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC]">
              <div className="text-xs font-bold text-[#F28C18] uppercase tracking-wider mb-2">
                Third Pillar
              </div>
              <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-2">
                Growth
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                Structuring entities and balance sheets not just for present survival, but for long-term scalability, bankability, and valuation.
              </p>
            </div>
          </div>
        </section>

        {/* Section: Industries We Serve Link & Contact Our Team */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC]">
          <div>
            <h3 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A] mb-1">
              Ready to collaborate?
            </h3>
            <p className="text-xs sm:text-sm text-[#667085]">
              Contact CA Krishna Panjiyar at our Andheri (W) office.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onNavigateToIndustries}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-[#062A5A] bg-white border border-[#D9E2EC] rounded-xl hover:bg-slate-100 min-h-[44px]"
            >
              Industries Served
            </button>
            <button
              onClick={onOpenConsultation}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl min-h-[44px]"
            >
              Book Consultation
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
