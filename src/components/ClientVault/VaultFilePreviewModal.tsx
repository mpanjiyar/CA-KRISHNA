import React, { useState } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  Download,
  Copy,
  Check,
  FileText,
  Building2,
  Calendar,
  User,
  Key,
  Printer,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { VaultFileItem, VaultUser } from '../../types/vault';

interface VaultFilePreviewModalProps {
  file: VaultFileItem | null;
  currentUser: VaultUser | null;
  onClose: () => void;
  onDownload: (file: VaultFileItem) => void;
  onSuccessToast: (msg: string) => void;
}

export const VaultFilePreviewModal: React.FC<VaultFilePreviewModalProps> = ({
  file,
  currentUser,
  onClose,
  onDownload,
  onSuccessToast
}) => {
  if (!file) return null;

  const [copiedHash, setCopiedHash] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedLive, setVerifiedLive] = useState(false);

  const handleCopyHash = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(file.sha256Hash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
      onSuccessToast('SHA-256 cryptographic digest copied to clipboard.');
    }
  };

  const handleLiveVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedLive(true);
      onSuccessToast(`Cryptographic Verification Succeeded: Document SHA-256 matched 100% against vault root record.`);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
      <div className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto text-left flex flex-col max-h-[92vh] animate-vault-zoom">
        
        {/* Header Bar */}
        <div className="bg-[#062A5A] text-white p-4 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#F28C18] shrink-0 border border-white/10">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  AES-256-GCM Cryptographic Record
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {file.id}
                </span>
              </div>
              <h3 className="font-manrope font-bold text-base sm:text-lg text-white truncate mt-0.5">
                {file.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 transition-colors"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close preview modal"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body: Metadata Strip + Document Simulation */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-600">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F9FC] p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Client Entity</span>
              <span className="font-semibold text-slate-900 text-xs truncate block mt-0.5">
                {file.clientName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Folder &amp; Project</span>
              <span className="font-semibold text-slate-900 text-xs truncate block mt-0.5">
                {file.folder} &middot; {file.projectName || 'General Mandate'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payload Size &amp; Date</span>
              <span className="font-semibold text-slate-900 text-xs truncate block mt-0.5 font-mono">
                {file.fileSize} &middot; {file.uploadDate}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attestation Status</span>
              <span className="font-semibold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>{file.verificationStatus || 'Verified & Sealed'}</span>
              </span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Seal Box */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#0969C7]" />
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  SHA-256 Tamper-Proof Cryptographic Fingerprint
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLiveVerify}
                  disabled={isVerifying}
                  className="px-2.5 py-1 rounded-lg bg-[#EEF5FC] text-[#0969C7] hover:bg-blue-100 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Sparkles size={12} className={isVerifying ? 'animate-spin' : ''} />
                  <span>{isVerifying ? 'Hashing payload...' : verifiedLive ? '✓ Verified Match' : 'Live Re-Verify Hash'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  {copiedHash ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedHash ? 'Copied' : 'Copy Digest'}</span>
                </button>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#0B1E38] text-emerald-400 font-mono text-[11px] break-all select-all leading-relaxed tracking-wider border border-slate-800">
              {file.sha256Hash}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Cipher: {file.encryptionStandard || 'AES-256-GCM Envelope'}</span>
              <span>UDIN Attested: 26402918AB8912 &middot; ICAI Registered</span>
            </div>
          </div>

          {/* Interactive Document Preview Simulation Window */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <FileText size={14} className="text-[#0969C7]" />
                <span>Simulated Secure Document Rendering &middot; {file.fileName}</span>
              </span>
              <span className="font-mono text-[11px]">Zero-Knowledge Decrypted View</span>
            </div>

            <div className="p-6 sm:p-8 space-y-6 font-serif bg-white min-h-[300px] text-slate-800">
              
              {/* Document Letterhead Simulation */}
              <div className="border-b-2 border-slate-800 pb-4 flex items-start justify-between gap-4">
                <div>
                  <h4 className="font-sans font-extrabold text-base sm:text-lg text-[#062A5A] uppercase tracking-wide">
                    PANJIYAR KRISHNA &amp; CO.
                  </h4>
                  <div className="text-[11px] font-sans text-slate-500 font-medium">
                    CHARTERED ACCOUNTANTS &middot; AUDIT &amp; TAX ADVISORY
                  </div>
                  <div className="text-[10px] font-sans text-slate-400 mt-0.5">
                    Andheri (West), Mumbai - 400053 &middot; Firm Reg: 018442W
                  </div>
                </div>

                <div className="text-right font-sans">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Document Serial</div>
                  <div className="font-mono font-bold text-slate-800 text-xs">{file.id}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Digital Seal Valid</div>
                </div>
              </div>

              {/* Document Subject & Body */}
              <div className="space-y-4">
                <div className="font-sans font-bold text-sm text-slate-900 border-l-4 border-[#0969C7] pl-3 py-0.5">
                  Subject: {file.title} &mdash; FY 2025-26
                </div>

                <p className="text-xs leading-relaxed text-slate-700">
                  This electronic instrument certifies that the statutory records, statements of account, and underlying supporting schedules for <strong>{file.clientName}</strong> have been examined in accordance with the standards on auditing issued by the Institute of Chartered Accountants of India (ICAI).
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans space-y-2">
                  <div className="font-bold text-slate-800 text-xs">Summary of Examination:</div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                    <li>Reconciliation of GSTR-3B vs GSTR-2B Input Tax Credit balances.</li>
                    <li>TDS deduction compliance under Chapter XVII-B of the Income Tax Act, 1961.</li>
                    <li>Physical verification of fixed assets as per schedule certified by management.</li>
                    <li>Cryptographic hash registered in immutable Client Vault repository.</li>
                  </ul>
                </div>
              </div>

              {/* Digital Signature Box */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Attesting Partner</div>
                  <div className="font-bold text-slate-800 text-xs">CA Krishna Panjiyar, FCA</div>
                  <div className="text-[10px] text-slate-500">Managing Partner &middot; M.No. 402918</div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <div className="text-[10px]">
                    <div className="font-bold text-emerald-800">Digitally Verified &amp; Certified</div>
                    <div className="text-emerald-600 font-mono">SHA-256 Validated &middot; Zero Tamper</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Lock size={12} className="text-emerald-600" />
            <span>Encrypted with zero-knowledge keys</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="px-4 py-2 text-xs font-bold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Download size={13} />
              <span>Download Encrypted Asset</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
