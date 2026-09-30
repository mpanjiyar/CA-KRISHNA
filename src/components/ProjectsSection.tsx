import React from 'react';
import { Briefcase, CheckCircle2, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

interface ProjectsSectionProps {
  onOpenConsultation: () => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onOpenConsultation }) => {
  const { projects } = useFirmData();

  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects-section" className="w-full bg-[#F7F9FC] py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7]">
              Proven Track Record
            </span>
            <span className="w-4 xs:w-5 h-[2px] bg-[#F28C18]" />
          </div>

          <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
            Key Mandates &amp; Client Projects
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-lg text-[#667085] leading-relaxed">
            Illustrative sample of recent corporate audits, litigation defenses, loan syndications, and startup engagements executed under CA Krishna Panjiyar.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-[#D9E2EC] p-5 sm:p-6 shadow-2xs card-hover-lift hover:border-[#0969C7] flex flex-col justify-between text-left relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#062A5A] to-[#0969C7] opacity-80" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] xs:text-[11px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[#EEF5FC] text-[#0969C7]">
                    {proj.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock size={12} className="text-[#F28C18]" />
                    {proj.turnaroundTime}
                  </span>
                </div>

                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5 leading-snug group-hover:text-[#0969C7] transition-colors">
                  {proj.title}
                </h3>

                <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-slate-400 shrink-0" />
                  <span className="truncate">{proj.clientType}</span>
                </p>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Key Deliverables */}
                {proj.deliverables && proj.deliverables.length > 0 && (
                  <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                      Key Outcomes:
                    </span>
                    {proj.deliverables.map((del, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 size={13} className="text-[#159447] shrink-0 mt-0.5" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-[11px] text-[#159447] font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  <ShieldCheck size={13} />
                  {proj.status} ({proj.year})
                </span>

                <button
                  onClick={onOpenConsultation}
                  className="font-semibold text-[#0969C7] hover:underline flex items-center gap-1 text-xs"
                >
                  Consult Similar &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-[#062A5A] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h4 className="font-manrope font-bold text-base sm:text-lg">
              Have a similar tax, audit, or loan mandate?
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Get in touch directly with our managing partners for confidential evaluation.
            </p>
          </div>
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#F28C18] hover:bg-[#e07d10] text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            Schedule Partner Review
          </button>
        </div>

      </div>
    </section>
  );
};
