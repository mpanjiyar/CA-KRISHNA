import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Lock, AlertCircle } from 'lucide-react';
import { FIRM_DETAILS } from '../data/firmData';

export type ComplianceModalTab = 'privacy' | 'terms' | 'disclaimer';

interface ComplianceModalProps {
  isOpen: boolean;
  initialTab?: ComplianceModalTab;
  onClose: () => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<ComplianceModalTab>(initialTab);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-5 sm:p-7 text-left my-6 animate-in zoom-in-95 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#062A5A] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={20} className="text-[#F28C18]" />
            </div>
            <div>
              <h2 className="font-manrope font-bold text-base sm:text-lg text-[#062A5A]">
                Regulatory &amp; Compliance Information
              </h2>
              <p className="text-[11px] text-slate-500">
                {FIRM_DETAILS.name} &middot; Chartered Accountants
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs mt-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#062A5A] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Lock size={13} className={activeTab === 'privacy' ? 'text-[#F28C18]' : ''} />
            <span>Privacy Policy</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-[#062A5A] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText size={13} className={activeTab === 'terms' ? 'text-[#F28C18]' : ''} />
            <span>Terms of Engagement</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('disclaimer')}
            className={`flex-1 py-2 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-[#062A5A] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertCircle size={13} className={activeTab === 'disclaimer' ? 'text-[#F28C18]' : ''} />
            <span>ICAI Disclaimer</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto pr-1 py-4 text-xs sm:text-[13px] text-slate-600 space-y-4 leading-relaxed flex-1">
          {activeTab === 'privacy' && (
            <div className="space-y-3.5">
              <h3 className="font-bold text-sm text-[#062A5A]">1. Client Data Confidentiality &amp; Protection</h3>
              <p>
                {FIRM_DETAILS.name} is committed to safeguarding the privacy and proprietary financial data of our corporate and individual clients. All records, income statements, audit papers, and PAN/GST particulars submitted to our office are maintained in strict confidentiality pursuant to the Chartered Accountants Act, 1949 and ethical standards of the ICAI.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">2. Client Vault Encryption &amp; Zero Plaintext</h3>
              <p>
                All documents submitted through our digital Client Vault are encrypted in transit via TLS 1.3 and at rest with AES-256 envelope security. Passwords and credentials are cryptographically derived using WebCrypto PBKDF2 with 100,000 SHA-256 rounds and random salt. Passphrases are never stored or logged in plain text.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">3. Non-Disclosure &amp; Information Sharing</h3>
              <p>
                We do not sell, rent, or transfer client personal or financial information to third parties. Information is disclosed solely to statutory authorities (Income Tax Department, GSTN, MCA, RBI) strictly as mandated by Indian Law and upon client authorization.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">4. Grievance Redressal</h3>
              <p>
                For questions regarding your data privacy, contact CA Krishna Panjiyar at <strong className="text-[#062A5A]">{FIRM_DETAILS.email}</strong> or call <strong className="text-[#062A5A]">{FIRM_DETAILS.phone1}</strong>.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <h3 className="font-bold text-sm text-[#062A5A]">1. Scope of Professional Engagement</h3>
              <p>
                All professional assignments—including Statutory Audit, Tax Audit (Form 3CD), GST Compliance, ROC Filings, and Project Loan Syndication—are governed by a formal Letter of Engagement signed between the client and {FIRM_DETAILS.name}.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">2. Client Responsibilities</h3>
              <p>
                Clients agree to furnish true, authentic, and complete books of account, bank statements, vouchers, and supporting records within statutory deadlines to ensure timely statutory filings. {FIRM_DETAILS.name} shall not be liable for penalties arising from client delay or misrepresentation.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">3. Professional Fees &amp; Retainers</h3>
              <p>
                Professional fees are determined in adherence to the guidelines and recommended fee structures formulated by the Institute of Chartered Accountants of India (ICAI). Invoices are payable in accordance with mutually agreed billing schedules.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">4. Jurisdiction</h3>
              <p>
                Any legal proceeding arising out of or in connection with the services rendered by the firm shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
              </p>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <span className="font-semibold text-xs leading-relaxed">
                  Mandatory ICAI Code of Ethics Disclosure under Chartered Accountants Act, 1949
                </span>
              </div>

              <h3 className="font-bold text-sm text-[#062A5A]">1. Informational Purpose Only</h3>
              <p>
                As per the regulatory guidelines issued by the Institute of Chartered Accountants of India (ICAI), Chartered Accountants in practice are not permitted to advertise or solicit work in any manner. This website is hosted solely to provide general professional information regarding the practice profile, areas of practice, and office contact information of {FIRM_DETAILS.name}.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">2. No Advertisement or Solicitation</h3>
              <p>
                The user acknowledges that access to this website is voluntary and of their own accord. Any material downloaded or information obtained from this site does not constitute an advertisement, solicitation, personal communication, invitation, or legal/tax advice.
              </p>

              <h3 className="font-bold text-sm text-[#062A5A]">3. No Professional-Client Relationship</h3>
              <p>
                Transmission of information from this site or receipt thereof does not create a Chartered Accountant-client relationship. Visitors must consult a qualified professional with specific facts before acting upon any information presented on this website.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 shrink-0 text-xs">
          <span className="text-slate-400">
            ICAI Practice Code Compliant
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Close &amp; Understand
          </button>
        </div>
      </div>
    </div>
  );
};
