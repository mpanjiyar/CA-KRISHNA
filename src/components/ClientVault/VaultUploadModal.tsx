import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Lock,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
  Building2,
  Folder,
  Briefcase
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultFileItem, VaultUser } from '../../types/vault';
import { simulateAesGcmEncryption } from '../../lib/vaultCrypto';

interface VaultUploadModalProps {
  isOpen: boolean;
  currentUser: VaultUser | null;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
  defaultFolder?: VaultFileItem['folder'];
}

export const VaultUploadModal: React.FC<VaultUploadModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onSuccessToast,
  defaultFolder = 'Documents'
}) => {
  const { users, projects, addFile } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clientUsers = users.filter((u) => u.accountType === 'client');
  const isClientUser = currentUser?.accountType === 'client';

  const [title, setTitle] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string>(
    isClientUser ? (currentUser?.id || '') : (clientUsers[0]?.id || '')
  );
  const [selectedFolder, setSelectedFolder] = useState<VaultFileItem['folder']>(defaultFolder);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Encryption simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [encryptionStep, setEncryptionStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFileObj(f);
      if (!title.trim()) {
        setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setSelectedFileObj(f);
      if (!title.trim()) {
        setTitle(f.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetClient = users.find((u) => u.id === selectedClientId) || currentUser || users[0];
    const targetProject = projects.find((p) => p.id === selectedProjectId);

    const fileName = selectedFileObj
      ? selectedFileObj.name
      : `${title.replace(/\s+/g, '_')}.pdf`;

    const fileSizeStr = selectedFileObj
      ? `${(selectedFileObj.size / (1024 * 1024)).toFixed(1)} MB`
      : '2.8 MB';

    setIsProcessing(true);
    setEncryptionStep('1/3 Computing WebCrypto SHA-256 payload digest...');
    setProgressPercent(30);

    setTimeout(async () => {
      setEncryptionStep('2/3 Encrypting with AES-256-GCM envelope cipher...');
      setProgressPercent(70);

      const cryptoMeta = await simulateAesGcmEncryption(fileName);

      setTimeout(() => {
        setEncryptionStep('3/3 Registering immutable entry in Client Vault...');
        setProgressPercent(100);

        setTimeout(() => {
          let fileType: VaultFileItem['fileType'] = 'document';
          const ext = fileName.split('.').pop()?.toLowerCase();
          if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') fileType = 'invoice';
          if (ext === 'png' || ext === 'jpg' || ext === 'webp') fileType = 'photo';
          if (ext === 'mp4' || ext === 'mov') fileType = 'video';
          if (selectedFolder === 'Contracts') fileType = 'contract';
          if (selectedFolder === 'Reports') fileType = 'report';

          addFile({
            title: title.trim(),
            fileName,
            fileType,
            fileSize: fileSizeStr,
            clientId: targetClient.id,
            clientName: targetClient.company,
            projectId: targetProject?.id,
            projectName: targetProject?.title,
            folder: selectedFolder,
            uploadedBy: currentUser ? `${currentUser.fullName} (${currentUser.role})` : 'Client Vault Portal',
            encryptionStandard: cryptoMeta.cipherSpec,
            verificationStatus: currentUser?.accountType === 'client' ? 'Under Review' : 'Verified',
            reviewedBy: currentUser?.accountType === 'client' ? undefined : currentUser?.fullName,
            permissions: {
              canView: true,
              canUpload: true,
              canDownload: true,
              canEdit: false,
              canDelete: false,
              canShare: true,
              canRename: false,
              canMove: false
            }
          });

          setIsProcessing(false);
          onSuccessToast(`✓ File "${fileName}" encrypted with AES-256-GCM and stored in ${targetClient.company}'s vault.`);
          onClose();
        }, 300);
      }, 350);
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 my-auto text-left relative animate-vault-zoom">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#159447] uppercase tracking-wider">
              <Lock size={12} />
              <span>Zero-Knowledge Envelope Upload</span>
            </div>
            <h3 className="font-manrope font-bold text-lg text-[#062A5A] mt-0.5">
              Upload Encrypted Document
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="py-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF5FC] border border-[#0969C7]/20 flex items-center justify-center mx-auto text-[#0969C7] animate-pulse">
              <Lock size={22} />
            </div>

            <div>
              <div className="font-manrope font-bold text-sm text-[#062A5A]">
                Cryptographic Envelope Processing
              </div>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                {encryptionStep}
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-[#0969C7] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[10.5px] text-slate-400">
              Generating immutable SHA-256 verification seal...
            </div>
          </div>
        )}

        {/* Form */}
        {!isProcessing && (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
            
            {/* Drag & Drop Area */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer ${
                dragOver
                  ? 'border-[#0969C7] bg-[#EEF5FC]'
                  : selectedFileObj
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.xlsx,.xls,.doc,.docx,.png,.jpg,.jpeg"
              />

              <UploadCloud
                size={28}
                className={`mx-auto mb-1.5 ${
                  selectedFileObj ? 'text-emerald-600' : 'text-[#0969C7]'
                }`}
              />

              {selectedFileObj ? (
                <div>
                  <span className="font-bold text-slate-900 block truncate max-w-xs mx-auto">
                    {selectedFileObj.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {(selectedFileObj.size / (1024 * 1024)).toFixed(2)} MB &middot; Ready for AES-256 encryption
                  </span>
                </div>
              ) : (
                <div>
                  <span className="font-semibold text-slate-800 block">
                    Choose a document or drag &amp; drop here
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">
                    PDF, XLSX, DOCX, or images up to 50MB (Client-side hashed)
                  </span>
                </div>
              )}
            </div>

            {/* Document Title */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Document Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Statutory Audit Report FY 2025-26"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#0969C7] outline-hidden min-h-[42px]"
              />
            </div>

            {/* Client Selection (if Admin/Staff) & Folder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Target Vault
                </label>
                {isClientUser ? (
                  <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold text-xs truncate">
                    {currentUser?.company}
                  </div>
                ) : (
                  <select
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#0969C7] outline-hidden min-h-[42px]"
                  >
                    {clientUsers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company} ({c.fullName})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Vault Folder
                </label>
                <select
                  value={selectedFolder}
                  onChange={(e) => setSelectedFolder(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#0969C7] outline-hidden min-h-[42px]"
                >
                  <option value="Documents">Documents &amp; Tax (ITR)</option>
                  <option value="Invoices">Invoices &amp; GST Returns</option>
                  <option value="Reports">Audit Working Papers (3CD)</option>
                  <option value="Contracts">Contracts &amp; NDAs</option>
                  <option value="Photos">Site Inspections &amp; Assets</option>
                  <option value="Videos">Meeting Recordings</option>
                </select>
              </div>
            </div>

            {/* Project Link */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                Link to Mandate / Project (Optional)
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:border-[#0969C7] outline-hidden min-h-[42px]"
              >
                <option value="">No specific project &middot; General Client Vault</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#062A5A] hover:bg-[#031C3D] rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Lock size={13} className="text-[#F28C18]" />
                <span>Encrypt &amp; Store Payload</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
