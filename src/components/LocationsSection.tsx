import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, Building, Globe, ExternalLink } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

interface LocationsSectionProps {
  onOpenConsultation: () => void;
  onSelectLocation?: (city: string) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({ onOpenConsultation }) => {
  const { offices, firmDetails } = useFirmData();
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  const regions = ['All', 'West', 'North', 'South', 'East', 'Central'];
  const filteredOffices = selectedRegion === 'All' 
    ? offices 
    : offices.filter(o => o.region === selectedRegion);

  return (
    <section id="locations-section" className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Presence &amp; Reach
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#0969C7]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            National Network &amp; Practice Locations
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#667085] leading-relaxed">
            Headquartered in Andheri (W), Mumbai with an established multi-state network providing in-person and digitized chartered accountancy across India.
          </p>

          {/* Region Filter Buttons */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {regions.map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedRegion === reg
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-[#F7F9FC] text-slate-600 hover:bg-[#EEF5FC] border border-[#D9E2EC]'
                }`}
              >
                {reg === 'All' ? 'All Regions' : `${reg} Region`}
              </button>
            ))}
          </div>
        </div>

        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredOffices.map((office) => (
            <div
              key={office.id}
              className={`rounded-2xl p-5 sm:p-6 border card-hover-lift text-left flex flex-col justify-between ${
                office.isHeadquarter
                  ? 'bg-gradient-to-br from-[#EEF5FC] to-white border-[#0969C7] shadow-sm relative'
                  : 'bg-white border-[#D9E2EC] shadow-2xs hover:border-[#0969C7]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md ${
                    office.isHeadquarter
                      ? 'bg-[#062A5A] text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {office.isHeadquarter ? 'Head Office' : `${office.region} Region`}
                  </span>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {office.state}
                  </span>
                </div>

                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1 flex items-center gap-1.5">
                  <Building size={16} className="text-[#0969C7] shrink-0" />
                  <span>{office.city}</span>
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 flex items-start gap-1.5">
                  <MapPin size={14} className="text-[#F28C18] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </p>

                {/* Office Contact Info */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-[#159447] shrink-0" />
                    <a href={`tel:${office.phone}`} className="font-semibold text-slate-800 hover:text-[#0969C7]">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-[#0969C7] shrink-0" />
                    <a href={`mailto:${office.email}`} className="text-slate-600 hover:underline truncate">
                      {office.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock size={13} className="text-slate-400 shrink-0" />
                    <span>{office.hours}</span>
                  </div>
                </div>

                {/* Key Office Services */}
                {office.services && office.services.length > 0 && (
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Services at this desk:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {office.services.map((srv, i) => (
                        <span key={i} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                          {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-2 px-3 text-xs font-semibold text-[#062A5A] bg-[#EEF5FC] hover:bg-[#D9E2EC] rounded-xl transition-colors text-center"
                >
                  Schedule Desk Consultation
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
