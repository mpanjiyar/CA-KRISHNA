import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';
import { Interactive3DIndiaMap } from './Interactive3DIndiaMap';

interface PanIndiaSectionProps {
  onOpenConsultation?: (regionName?: string) => void;
}

export const PanIndiaSection: React.FC<PanIndiaSectionProps> = ({ onOpenConsultation }) => {
  const [activeZone, setActiveZone] = useState<'West' | 'North' | 'South' | 'East' | 'Central' | 'Northeast'>('West');

  const REGIONAL_ZONES = [
    {
      id: 'West' as const,
      title: 'West India (Headquarter Hub)',
      states: 'Maharashtra (Mumbai HO, Pune, Nashik, Nagpur), Gujarat (Ahmedabad, Surat), Goa, DNH & Daman & Diu',
      highlight: 'Direct Partner Presence & Maharashtra Sales Tax / Gumasta / PT / RERA & Bank CMA expertise',
      services: ['Statutory Audit & Tax Audit', 'Direct Income Tax Filing', 'GST Compliance & Refunds', 'CMA & Bank Loan Documentation']
    },
    {
      id: 'North' as const,
      title: 'North India',
      states: 'Delhi NCR (Liaison Desk), Punjab, Haryana, Rajasthan, Uttar Pradesh, Uttarakhand, Himachal, J&K, Ladakh',
      highlight: 'Centralized MCA ROC filings, Faceless Assessment dispute handling & corporate tax litigation',
      services: ['Corporate ROC & Annual Filings', 'Faceless Tax Notice Resolution', 'Startup DPIIT Advisory', 'Multi-State GST Consolidation']
    },
    {
      id: 'South' as const,
      title: 'South India',
      states: 'Karnataka (Bengaluru), Tamil Nadu (Chennai), Telangana (Hyderabad), Kerala, Andhra Pradesh, Puducherry',
      highlight: 'Tech startups, SaaS export compliance (15CA/CB), transfer pricing and cross-border advisory',
      services: ['SaaS Export Invoicing & 15CA/CB', 'Cross-Border Tax Advisory', 'DPIIT & Angel Tax Exemption', 'Remote Bookkeeping Outsourcing']
    },
    {
      id: 'East' as const,
      title: 'East India',
      states: 'West Bengal (Kolkata), Odisha, Bihar, Jharkhand',
      highlight: 'Manufacturing, trading, steel and mining sector statutory audit & GST input reconciliation',
      services: ['Inventory & Stock Audit', 'Manufacturing GST Inverted Duty', 'MSME Udyam Prioritization', 'Project Loan CMA Models']
    },
    {
      id: 'Central' as const,
      title: 'Central India',
      states: 'Madhya Pradesh (Indore, Bhopal), Chhattisgarh (Raipur)',
      highlight: 'Agricultural & retail business accounting, tax optimization, and working capital advisory',
      services: ['MSME Bank Finance Modeling', 'Partnership & LLP Structuring', 'GST E-Way Bill Advisory', 'Presumptive Tax Planning']
    },
    {
      id: 'Northeast' as const,
      title: 'Northeast India (Associate Hub)',
      states: 'Assam (Guwahati Branch), Meghalaya, Tripura, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Sikkim',
      highlight: 'Dedicated Guwahati regional desk, tea estate corporate taxation & special category state tax benefits',
      services: ['Special Tax Regime Planning', 'Tea & Agro-Industry Accounting', 'Remote Virtual Audit Desk', 'Government Tender Financials']
    }
  ];

  const currentZoneData = REGIONAL_ZONES.find(z => z.id === activeZone) || REGIONAL_ZONES[0];

  return (
    <section id="pan-india-section" className="w-full bg-[#031C3D] text-white py-12 sm:py-16 lg:py-22 border-b border-[#062A5A] relative overflow-hidden scroll-mt-24 sm:scroll-mt-28">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none select-none"
        style={{
          backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading & Introduction */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#F28C18]">
              Nationwide Professional Coverage
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
          </div>

          <h2 className="font-manrope text-[24px] xs:text-[28px] sm:text-[34px] md:text-[40px] font-bold text-white tracking-tight leading-tight mb-2.5 sm:mb-3">
            Interactive 3D Network of India
          </h2>

          <p className="text-xs xs:text-sm sm:text-base text-slate-200 leading-relaxed font-light">
            {FIRM_DETAILS.supportingPositioning} Explore our physical offices and comprehensive statutory compliance coverage across all 28 Indian States &amp; 8 Union Territories.
          </p>
        </div>

        {/* Major Regions Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-10 p-1.5 sm:p-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 max-w-4xl mx-auto">
          {REGIONAL_ZONES.map((zone) => {
            const isActive = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`px-3 xs:px-3.5 sm:px-4 py-1.5 xs:py-2 text-[11px] xs:text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 min-h-[40px] flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0969C7] text-white shadow-lg'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#F28C18]' : 'bg-slate-400'}`} />
                <span>{zone.id} India</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Split: Active Regional Desk & Interactive 3D India Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
          
          {/* Left Column: Active Zone Card */}
          <div className="lg:col-span-5 flex flex-col justify-between text-left">
            <div className="bg-white/5 rounded-2xl p-5 xs:p-6 sm:p-7 border border-white/10 shadow-xl flex flex-col justify-between h-full">
              
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-[10px] xs:text-[11px] uppercase font-bold text-[#F28C18] tracking-wider block">
                      Regional Scope
                    </span>
                    <h3 className="font-manrope font-bold text-lg xs:text-xl sm:text-2xl text-white">
                      {currentZoneData.title}
                    </h3>
                  </div>
                  <span className="text-[10px] xs:text-xs px-2.5 py-1 rounded-full bg-[#159447]/20 text-[#159447] border border-[#159447]/30 font-semibold shrink-0">
                    Active Desk
                  </span>
                </div>

                {/* Covered States */}
                <div className="mb-4">
                  <span className="text-[11px] xs:text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-1.5">
                    Commercial Centers &amp; Covered States:
                  </span>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed bg-[#062A5A]/60 p-3 rounded-xl border border-white/10">
                    {currentZoneData.states}
                  </p>
                </div>

                {/* Regional Highlight */}
                <div className="mb-4">
                  <span className="text-[11px] xs:text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-1">
                    Strategic CA Advisory Advantage:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                    {currentZoneData.highlight}
                  </p>
                </div>

                {/* Services Breakdown in this Region */}
                <div className="mb-5">
                  <span className="text-[11px] xs:text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                    Key Practice Areas in {activeZone} India:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentZoneData.services.map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-200 bg-white/5 p-2 rounded-lg border border-white/5">
                        <CheckCircle2 size={13} className="text-[#159447] shrink-0" />
                        <span className="truncate">{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action for Region */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                  <MapPin size={13} className="text-[#F28C18] shrink-0" />
                  <span>Virtual &bull; Physical Consultation</span>
                </div>
                {onOpenConsultation && (
                  <button
                    onClick={() => onOpenConsultation(`${activeZone} India Advisory`)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#0969C7] hover:bg-[#085cb0] active:scale-[0.98] rounded-xl transition-all shadow-md min-h-[42px]"
                  >
                    <span>Consult for {activeZone} India</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Right Column: Premium Interactive 3D India Map */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center w-full min-h-[580px] lg:min-h-[640px]">
            <Interactive3DIndiaMap
              selectedZone={activeZone}
              onSelectZone={(zone) => setActiveZone(zone)}
              onOpenConsultation={onOpenConsultation}
            />
          </div>

        </div>

        {/* Bottom Trust Highlight Banner */}
        <div className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="font-manrope font-bold text-lg sm:text-xl text-[#F28C18] block">28 States</span>
            <span className="text-[11px] text-slate-300">Statutory Tax &amp; Audit Filing</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="font-manrope font-bold text-lg sm:text-xl text-white block">8 UTs</span>
            <span className="text-[11px] text-slate-300">Union Territory Coverage</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="font-manrope font-bold text-lg sm:text-xl text-[#159447] block">3 Office Hubs</span>
            <span className="text-[11px] text-slate-300">Mumbai HO &bull; Guwahati &bull; Delhi</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <span className="font-manrope font-bold text-lg sm:text-xl text-[#0969C7] block">100% Faceless</span>
            <span className="text-[11px] text-slate-300">IT &amp; GST Online Integration</span>
          </div>
        </div>

      </div>
    </section>
  );
};
