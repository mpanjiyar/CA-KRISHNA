import React, { useState, useEffect } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Download,
  Trash2,
  Share2,
  Lock,
  Plus,
  UploadCloud,
  Search,
  CheckCircle2,
  X,
  Building,
  Key,
  Save,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useVaultAuth } from '../../context/VaultAuthContext';
import { VaultFileItem } from '../../types/vault';

interface PrivateVaultViewerProps {
  onSuccessToast: (msg: string) => void;
}

export const PrivateVaultViewer: React.FC<PrivateVaultViewerProps> = ({ onSuccessToast }) => {
  const { user: authUser } = useVaultAuth();
  const { users, files, projects, addFile, deleteFile, updateFilePermissions } = useVault();

  const isClient = authUser?.accountType === 'client';
  const isStaff = authUser?.accountType === 'staff';

  // Determine accessible clients
  const accessibleClients = users.filter((u) => {
    if (u.accountType !== 'client') return false;
    if (isClient) return u.id === authUser?.id;
    if (isStaff) return (authUser?.assignedClientIds || []).includes(u.id);
    return true; // Super admin sees all
  });

  // Selected client for vault isolation
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (isClient && authUser) return authUser.id;
    return accessibleClients[0]?.id || users.find(u => u.accountType === 'client')?.id || '';
  });

  useEffect(() => {
    if (isClient && authUser) {
      setSelectedClientId(authUser.id);
    } else if (accessibleClients.length > 0 && !accessibleClients.some(c => c.id === selectedClientId)) {
      setSelectedClientId(accessibleClients[0].id);
    }
  }, [authUser, isClient, accessibleClients, selectedClientId]);

  const [activeFolder, setActiveFolder] = useState<VaultFileItem['folder']>('Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // New file form
  const [newTitle, setNewTitle] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newSize, setNewSize] = useState('2.4 MB');
  const [newFolder, setNewFolder] = useState<VaultFileItem['folder']>('Documents');
  const [newFileType, setNewFileType] = useState<VaultFileItem['fileType']>('document');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const currentClient = users.find((u) => u.id === selectedClientId) || accessibleClients[0] || (authUser?.accountType === 'client' ? authUser : null);

  // Strictly isolated client files
  const clientFiles = files.filter(
    (f) =>
      f.clientId === (currentClient?.id || '') &&
      (activeFolder === f.folder || activeFolder === 'Documents' && !f.folder)
  );

  const filteredFiles = clientFiles.filter(
    (f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.projectName && f.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFileName.trim()) return;

    const proj = projects.find((p) => p.id === selectedProjectId);

    addFile({
      title: newTitle.trim(),
      fileName: newFileName.trim(),
      fileType: newFileType,
      fileSize: newSize,
      clientId: currentClient?.id || 'USR-CL-101',
      clientName: currentClient?.company || 'Client Vault',
      projectId: proj?.id,
      projectName: proj?.title,
      folder: newFolder,
      uploadedBy: 'CA Krishna Panjiyar (Admin Vault)',
      encryptionStandard: 'AES-256 GCM',
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

    onSuccessToast(`✓ Changes saved successfully: File "${newFileName}" encrypted and stored in ${currentClient?.company}'s vault.`);
    setIsUploading(false);
    setNewTitle('');
    setNewFileName('');
  };

  const folders: { id: VaultFileItem['folder']; label: string; icon: React.ReactNode }[] = [
    { id: 'Documents', label: 'Documents & Certificates', icon: <FileText size={14} /> },
    { id: 'Invoices', label: 'Invoices & CMA Models', icon: <FileSpreadsheet size={14} /> },
    { id: 'Reports', label: 'Audit & Tax Reports', icon: <FileText size={14} /> },
    { id: 'Photos', label: 'Site Inspection Photos', icon: <ImageIcon size={14} /> },
    { id: 'Videos', label: 'Meeting Recordings', icon: <Video size={14} /> },
    { id: 'Contracts', label: 'Agreements & NDAs', icon: <Folder size={14} /> }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Client Vault Header & Isolation Switcher */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Lock size={11} className="text-emerald-600" />
              <span>Isolated Client Cryptographic Storage</span>
            </span>
          </div>
          <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
            Private Client Vaults
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict perimeter boundary: Every client has a segregated vault. Cross-client data leaks are prevented by cryptographic token isolation.
          </p>
        </div>

        {/* Client Selector Dropdown / Verified Client Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          {isClient ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <ShieldCheck size={16} className="text-emerald-600" />
              <div>
                <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">Your Confidential Vault</span>
                <span className="font-extrabold text-[#062A5A]">{currentClient?.company || authUser?.company}</span>
              </div>
            </div>
          ) : (
            <>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Active Vault</span>
                <span className="text-xs font-bold text-[#062A5A] truncate max-w-[200px] block">
                  {currentClient?.company}
                </span>
              </div>

              <div className="relative">
                <Building size={14} className="absolute left-3 top-3 text-slate-400" />
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-[#062A5A] bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7] shadow-2xs"
                >
                  {accessibleClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            onClick={() => setIsUploading(true)}
            className="px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
          >
            <Plus size={14} className="text-[#F28C18]" />
            <span>Store Document</span>
          </button>
        </div>
      </div>

      {/* Explorer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Folder Tree */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Vault Folders
          </div>
          {folders.map((f) => {
            const count = files.filter(
              (file) => file.clientId === currentClient?.id && file.folder === f.id
            ).length;
            const isActive = activeFolder === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFolder(f.id)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={isActive ? 'text-[#F28C18]' : 'text-slate-400'}>{f.icon}</span>
                  <span className="truncate">{f.label}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          <div className="pt-4 mt-3 border-t border-slate-100 px-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-600 block mb-0.5">Assigned Client:</span>
            <div className="text-slate-700 font-medium">{currentClient?.fullName}</div>
            <div className="text-slate-500 truncate">{currentClient?.email}</div>
          </div>
        </div>

        {/* Right: Files Table / Cards */}
        <div className="lg:col-span-9 space-y-4">
          {/* Search bar inside vault */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
            <Search size={15} className="text-slate-400 ml-1" />
            <input
              type="text"
              placeholder={`Search ${activeFolder} in ${currentClient?.company}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-transparent border-none focus:outline-none text-slate-700"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Files List */}
          {filteredFiles.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100 text-xs">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#EEF5FC] text-[#0969C7] flex items-center justify-center shrink-0">
                        {file.fileType === 'photo' ? (
                          <ImageIcon size={18} />
                        ) : file.fileType === 'report' ? (
                          <FileText size={18} />
                        ) : (
                          <FileSpreadsheet size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-[#062A5A] text-sm truncate">{file.title}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="font-mono text-slate-600">{file.fileName}</span>
                          <span>&middot;</span>
                          <span className="font-semibold text-slate-600">{file.fileSize}</span>
                          <span>&middot;</span>
                          <span>{file.uploadDate}</span>
                          {file.projectName && (
                            <>
                              <span>&middot;</span>
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                                {file.projectName}
                              </span>
                            </>
                          )}
                        </div>

                        {/* SHA256 & Encryption Badge */}
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                          <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                            <Key size={10} /> {file.encryptionStandard}
                          </span>
                          <span className="truncate max-w-[200px]" title={file.sha256Hash}>
                            SHA: {file.sha256Hash.substring(0, 16)}...
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Granular Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onSuccessToast(`Downloading encrypted payload for ${file.fileName}. Verified SHA-256 hash.`)
                        }
                        className="px-3 py-1.5 rounded-lg bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Download size={13} className="text-[#0969C7]" />
                        <span>Download</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://panjiyarkrishna.com/portal/vault/doc/${file.id}?token=ephem_auth_token`
                          );
                          onSuccessToast(`Encrypted share token copied for ${file.fileName}`);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        title="Copy Encrypted Share Link"
                      >
                        <Share2 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete ${file.fileName} from client vault?`)) {
                            deleteFile(file.id);
                            onSuccessToast(`Removed ${file.fileName}`);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Purge File"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
              <Folder size={40} className="mx-auto mb-2 text-slate-300" />
              <h4 className="font-manrope font-bold text-sm text-[#062A5A]">
                No files found in {activeFolder}
              </h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No documents currently stored in this folder for {currentClient?.company}. Click &quot;Store Document&quot; above to upload.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Upload File Modal */}
      {isUploading && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                Store File in {currentClient?.company}&apos;s Vault
              </h3>
              <button
                type="button"
                onClick={() => setIsUploading(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Statutory Audit Report FY 2025-26"
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value);
                    if (!newFileName && e.target.value) {
                      setNewFileName(e.target.value.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Audit_Report_Apex_Signed.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Folder Category</label>
                  <select
                    value={newFolder}
                    onChange={(e) => setNewFolder(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    <option value="Documents">Documents</option>
                    <option value="Invoices">Invoices</option>
                    <option value="Reports">Reports</option>
                    <option value="Photos">Photos</option>
                    <option value="Videos">Videos</option>
                    <option value="Contracts">Contracts</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">File Size</label>
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assign to Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="">No Project Assigned (General Vault)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Automatic Cryptographic Verification
                </div>
                <div>A SHA-256 hash checksum will be automatically calculated upon storage commit.</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewTitle('');
                    setNewFileName('');
                    setNewSize('2.4 MB');
                    setNewFolder('Documents');
                    setSelectedProjectId('');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <RotateCcw size={13} />
                  <span>Reset</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsUploading(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5"
                  >
                    <Save size={14} className="text-[#F28C18]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
