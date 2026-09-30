import React from 'react';
import { 
  FileCheck2, 
  BarChart3, 
  BookOpen, 
  Coins, 
  Calculator, 
  AlertCircle, 
  Scale, 
  TrendingUp, 
  ArrowRight,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { useFirmData } from '../context/FirmDataContext';

interface SpecializedSectionsProps {
  onOpenConsultation: () => void;
  onSelectService: (serviceId: string) => void;
}

export const SpecializedSections: React.FC<SpecializedSectionsProps> = ({
  onOpenConsultation,
  onSelectService
}) => {
  const { firmDetails } = useFirmData();
  return (
    <div className="w-full">
      {/* 1. Accounting Section */}
      <section className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8 sm:mb-12 text-left">
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7] mb-1.5 block">
              Core Practice Area
            </span>
            <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
              Reliable Accounting &amp; Bookkeeping Solutions
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
              Maintain accurate financial records with structured bookkeeping, accounting and financial reporting support designed to help you understand your business performance and stay prepared for tax and compliance requirements.
            </p>
          </div>

          {/* Three Feature Cards: 1 on mobile, 3 on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-7">
            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC] text-left hover:border-[#0969C7] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FC] text-[#062A5A] flex items-center justify-center mb-3">
                  <BookOpen size={19} />
                </div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5">
                  Daily Accounting
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  Disciplined purchase and sales ledger updates, bank reconciliations, vendor ledger tallying, and expense classification.
                </p>
              </div>
            </div>

            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC] text-left hover:border-[#0969C7] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FC] text-[#062A5A] flex items-center justify-center mb-3">
                  <FileCheck2 size={19} />
                </div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5">
                  Financial Statements
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  Audit-ready Balance Sheets, Profit &amp; Loss statements, cash flow statements, and trial balance summaries in accordance with accounting standards.
                </p>
              </div>
            </div>

            <div className="p-4 xs:p-5 sm:p-6 rounded-2xl bg-[#F7F9FC] border border-[#D9E2EC] text-left hover:border-[#0969C7] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#EEF5FC] text-[#062A5A] flex items-center justify-center mb-3">
                  <BarChart3 size={19} />
                </div>
                <h3 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A] mb-1.5">
                  MIS &amp; Reporting
                </h3>
                <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
                  Monthly management information dashboards, working capital status, profitability analysis, and budget variance monitoring.
                </p>
              </div>
            </div>
          </div>

          <div className="text-left">
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shadow-xs min-h-[44px]"
            >
              <span>Discuss Your Accounting Requirements</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Tax Section (Split Layout) */}
      <section className="w-full bg-[#062A5A] text-white py-10 sm:py-16 lg:py-20 border-b border-[#031C3D]">
        <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#F28C18] mb-1.5 block">
                Direct &amp; Indirect Practice
              </span>
              <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-white tracking-tight leading-tight mb-3">
                Taxation Services
              </h2>
              <p className="text-slate-200 text-xs xs:text-sm sm:text-base leading-relaxed mb-5 font-light">
                Strategic tax computation and proactive compliance across personal, corporate, GST, and international tax frameworks to eliminate risk and avoid compounding penalties.
              </p>
              
              <div className="space-y-2 mb-6 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>Timely quarterly and annual statutory filing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>Proactive advance tax and TDS calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>Faceless assessment representation &amp; notice drafting</span>
                </div>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-[#062A5A] bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-sm min-h-[44px]"
              >
                Talk to a Tax Professional
              </button>
            </div>

            {/* Right Side: 6 Tax Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
              {[
                { title: 'Income Tax', desc: 'ITR filing, capital gains calculations, HUF & firm returns', icon: Calculator, srvId: 'income-tax' },
                { title: 'TDS', desc: 'Form 24Q, 26Q, 27Q filing, TRACES rectification & 16/16A generation', icon: Coins, srvId: 'tds-services' },
                { title: 'GST', desc: 'GSTR-1, 3B, 9 & 9C returns, ITC matching & refund applications', icon: FileSpreadsheet, srvId: 'gst-services' },
                { title: 'Tax Planning', desc: 'Legitimate tax minimization strategies for HNIs, LLPs & corporates', icon: TrendingUp, srvId: 'income-tax' },
                { title: 'Tax Notices', desc: 'Analysis and structured evidence replies to 143(1), 148 & 142(1) notices', icon: AlertCircle, srvId: 'income-tax' },
                { title: 'Tax Advisory', desc: 'Cross-border remittances, 15CA/CB, transfer pricing & restructuring', icon: Scale, srvId: 'income-tax' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => onSelectService(item.srvId)}
                    className="p-3.5 xs:p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[#F28C18] hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon size={17} className="text-[#F28C18]" />
                      <h4 className="font-manrope font-bold text-sm xs:text-base text-white">
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Audit Section */}
      <section className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8 sm:mb-12 text-left">
            <span className="text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7] mb-1.5 block">
              Statutory Governance
            </span>
            <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
              Audit &amp; Assurance
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
              Professional audit support focused on accuracy, compliance, documentation and meaningful financial insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-7">
            {[
              { title: 'Statutory Audit', desc: 'Independent verification under Companies Act 2013 ensuring true and fair view of accounts.' },
              { title: 'Tax Audit', desc: 'Mandatory Section 44AB audits, compiling Form 3CA/3CB and comprehensive Form 3CD schedules.' },
              { title: 'Internal Audit', desc: 'Evaluating operational efficiency, risk management frameworks, and internal financial controls.' },
              { title: 'Stock Audit', desc: 'Physical verification and valuation of inventory for management and bank lenders.' },
              { title: 'Financial Review', desc: 'Interim financial inspections, ratio health checks, and lender compliance verifications.' },
              { title: 'Due Diligence', desc: 'Pre-acquisition financial, tax and secretarial investigation for investors and buyers.' }
            ].map((card, i) => (
              <div
                key={i}
                className="p-4 xs:p-5 rounded-xl bg-[#F7F9FC] border border-[#D9E2EC] text-left hover:border-[#0969C7] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-lg bg-[#EEF5FC] text-[#062A5A] flex items-center justify-center font-bold text-xs mb-2.5 font-mono">
                    0{i + 1}
                  </div>
                  <h3 className="font-manrope font-bold text-sm xs:text-base text-[#062A5A] mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-left">
            <button
              onClick={() => onSelectService('audit-assurance')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#062A5A] hover:text-[#0969C7] transition-colors min-h-[44px]"
            >
              <span>Explore full audit standards and documentation requirements &rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Loan & Financing Section */}
      <section className="w-full bg-[#F7F9FC] py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-8 sm:mb-12 text-left">
            <div className="inline-flex items-center gap-2 text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7] mb-1.5">
              <span className="w-4 h-[2px] bg-[#F28C18]" />
              <span>Capital &amp; Credit Advisory</span>
            </div>
            <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
              Loan &amp; Financing Support
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed">
              Prepare accurate financial statements, projections and business documentation required for financing and loan applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-7">
            {[
              { title: 'Financial Statements', desc: 'Audited balance sheets and profit & loss registers formatted for credit underwriters.' },
              { title: 'Projected Financials', desc: '5-year realistic revenue, expense and cash flow forecasting models.' },
              { title: 'CMA Data', desc: 'Comprehensive Credit Monitoring Arrangement tables analyzing operational ratios.' },
              { title: 'Loan Documentation', desc: 'Sanction letter compliance, asset collateral listings, and net worth attestations.' },
              { title: 'Bank Finance Support', desc: 'Liaison with nationalized, private and cooperative banks for limit sanctions.' }
            ].map((c, i) => (
              <div
                key={i}
                className="p-3.5 xs:p-4 rounded-xl bg-white border border-[#D9E2EC] text-left hover:border-[#0969C7] shadow-2xs transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="w-2 h-2 rounded-full bg-[#0969C7] mb-2" />
                  <h3 className="font-manrope font-bold text-xs xs:text-sm sm:text-base text-[#062A5A] mb-1 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-xs text-[#667085] leading-relaxed">
                    {c.desc}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] font-semibold text-[#0969C7]">
                  Bank Standard
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 xs:p-5 sm:p-6 rounded-2xl bg-white border border-[#D9E2EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
            <div className="text-left">
              <h4 className="font-manrope font-bold text-xs xs:text-sm sm:text-base text-[#062A5A]">
                Applying for Cash Credit (CC), Term Loan, or MSME Enhancement?
              </h4>
              <p className="text-[11px] xs:text-xs sm:text-sm text-[#667085] mt-0.5">
                Our CMA models provide bank credit managers with the clarity needed for faster appraisal.
              </p>
            </div>
            <button
              onClick={onOpenConsultation}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shrink-0 min-h-[42px]"
            >
              Discuss Loan File
            </button>
          </div>
        </div>
      </section>

      {/* 5. Startup Advisory Section */}
      <section className="w-full bg-white py-10 sm:py-16 lg:py-20 border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-3.5 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
            
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 text-[11px] xs:text-xs uppercase tracking-widest font-semibold text-[#0969C7] mb-1.5">
                <span className="w-4 h-[2px] bg-[#159447]" />
                <span>Venture Financial Foundations</span>
              </div>
              
              <h2 className="font-manrope text-[22px] xs:text-[26px] sm:text-[32px] lg:text-[38px] font-bold text-[#062A5A] tracking-tight leading-tight mb-2 sm:mb-3">
                Start Your Business With the Right Financial Foundation
              </h2>

              <p className="text-xs xs:text-sm sm:text-base text-[#667085] leading-relaxed mb-5">
                From business structuring and registration to accounting, taxation and ongoing compliance, <strong className="font-semibold text-[#062A5A]">{firmDetails.name}</strong> provides practical support to help startups establish strong financial systems.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6 text-xs sm:text-sm text-[#172033]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>DPIIT Startup India Recognition &amp; Section 80-IAC</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>Pvt Ltd / LLP Incorporation &amp; Secretarial Setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>Founder Cap Table &amp; Equity Structuring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-[#159447] shrink-0" />
                  <span>Investor Due Diligence &amp; Data Room Preparation</span>
                </div>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl transition-colors shadow-xs min-h-[44px]"
              >
                <span>Talk to a Startup Advisor</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="lg:col-span-5 bg-[#EEF5FC] rounded-2xl p-4 xs:p-5 sm:p-7 border border-[#D9E2EC] text-left">
              <h4 className="font-manrope font-bold text-xs xs:text-sm sm:text-base text-[#062A5A] mb-1.5">
                Early Stage Starter Checklist
              </h4>
              <p className="text-xs text-[#667085] mb-3 leading-relaxed">
                Avoid costly restructurings down the road by getting your tax regime and entity formation right from day zero.
              </p>
              
              <div className="space-y-2">
                <div className="p-2.5 xs:p-3 bg-white rounded-xl border border-[#D9E2EC] flex items-center justify-between text-xs">
                  <span className="font-medium text-[#062A5A]">1. Entity Selection</span>
                  <span className="text-[#0969C7] font-semibold">LLP vs Pvt Ltd</span>
                </div>
                <div className="p-2.5 xs:p-3 bg-white rounded-xl border border-[#D9E2EC] flex items-center justify-between text-xs">
                  <span className="font-medium text-[#062A5A]">2. Statutory Licensing</span>
                  <span className="text-[#0969C7] font-semibold">GST + MSME + PT</span>
                </div>
                <div className="p-2.5 xs:p-3 bg-white rounded-xl border border-[#D9E2EC] flex items-center justify-between text-xs">
                  <span className="font-medium text-[#062A5A]">3. Accounting Framework</span>
                  <span className="text-[#0969C7] font-semibold">Cloud Ledger Setup</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
