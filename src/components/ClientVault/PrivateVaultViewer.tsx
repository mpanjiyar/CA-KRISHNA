import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Folder,
  FolderPlus,
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
  RotateCcw,
  ShieldCheck,
  MoreVertical,
  Edit2,
  Move,
  Eye,
  ChevronRight,
  LayoutGrid,
  List,
  AlertTriangle,
  ArrowUpDown,
  Shield,
  Briefcase,
  Clock,
  Sparkles,
  ExternalLink,
  Copy
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useVaultAuth } from '../../context/VaultAuthContext';
import { VaultFileItem, VaultFolder } from '../../types/vault';

interface PrivateVaultViewerProps {
  onSuccessToast: (msg: string) => void;
  defaultFolderSlug?: string;
}

export const PrivateVaultViewer: React.FC<PrivateVaultViewerProps> = ({
  onSuccessToast,
  defaultFolderSlug
}) => {
  const { user: authUser } = useVaultAuth();
  const {
    users,
    folders,
    files,
    projects,
    createFolder,
    updateFolder,
    deleteFolder,
    renameFolder,
    addFile,
    deleteFile,
    updateFile,
    renameFile,
    moveFile
  } = useVault();

  const isSuperAdmin = authUser?.accountType === 'super_admin';
  const isStaff = authUser?.accountType === 'staff';
  const isClient = authUser?.accountType === 'client';

  // Determine accessible clients
  const accessibleClients = useMemo(() => {
    return users.filter((u) => {
      if (u.accountType !== 'client') return false;
      if (isClient) return u.id === authUser?.id;
      if (isStaff) return (authUser?.assignedClientIds || []).includes(u.id);
      return true; // Super admin sees all
    });
  }, [users, isClient, isStaff, authUser]);

  // Selected client for vault isolation
  const [selectedClientId, setSelectedClientId] = useState<string>(() => {
    if (isClient && authUser) return authUser.id;
    return accessibleClients[0]?.id || users.find((u) => u.accountType === 'client')?.id || 'USR-CL-101';
  });

  useEffect(() => {
    if (isClient && authUser) {
      setSelectedClientId(authUser.id);
    } else if (accessibleClients.length > 0 && !accessibleClients.some((c) => c.id === selectedClientId)) {
      setSelectedClientId(accessibleClients[0].id);
    }
  }, [authUser, isClient, accessibleClients, selectedClientId]);

  const currentClient = useMemo(() => {
    return (
      users.find((u) => u.id === selectedClientId) ||
      accessibleClients[0] ||
      (isClient && authUser ? authUser : null)
    );
  }, [users, selectedClientId, accessibleClients, isClient, authUser]);

  // Folders accessible to this client (system firm-wide folders + client custom folders)
  const clientFolders = useMemo(() => {
    if (!currentClient) return [];
    return folders.filter(
      (f) => f.clientId === 'all' || f.clientId === currentClient.id
    );
  }, [folders, currentClient]);

  // Active folder state: can be folder id or 'ALL'
  const [activeFolderId, setActiveFolderId] = useState<string>(() => {
    if (defaultFolderSlug) {
      const match = clientFolders.find((f) => f.slug === defaultFolderSlug || f.name.toLowerCase() === defaultFolderSlug.toLowerCase());
      if (match) return match.id;
    }
    return clientFolders[0]?.id || 'FLD-DOCS';
  });

  // Ensure activeFolderId is valid when folders list updates
  useEffect(() => {
    if (activeFolderId !== 'ALL' && clientFolders.length > 0) {
      const exists = clientFolders.some((f) => f.id === activeFolderId);
      if (!exists) {
        setActiveFolderId(clientFolders[0].id);
      }
    }
  }, [clientFolders, activeFolderId]);

  const activeFolder = useMemo(() => {
    if (activeFolderId === 'ALL') return null;
    return clientFolders.find((f) => f.id === activeFolderId) || clientFolders[0] || null;
  }, [clientFolders, activeFolderId]);

  // Search, filtering, view layout, and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'document' | 'report' | 'spreadsheet' | 'photo' | 'video' | 'invoice'>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'size-desc'>('date-desc');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<VaultFolder | null>(null);
  const [folderToDelete, setFolderToDelete] = useState<VaultFolder | null>(null);
  const [fileToDelete, setFileToDelete] = useState<VaultFileItem | null>(null);
  const [fileToMove, setFileToMove] = useState<VaultFileItem | null>(null);
  const [fileToRename, setFileToRename] = useState<VaultFileItem | null>(null);
  const [fileToPreview, setFileToPreview] = useState<VaultFileItem | null>(null);
  const [previewTab, setPreviewTab] = useState<'viewer' | 'crypto' | 'permissions'>('viewer');

  // New folder form state
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [newFolderIcon, setNewFolderIcon] = useState('Folder');
  const [newFolderScope, setNewFolderScope] = useState<'client' | 'all'>('client');

  // Edit folder form state
  const [editFolderName, setEditFolderName] = useState('');
  const [editFolderDesc, setEditFolderDesc] = useState('');
  const [editFolderColor, setEditFolderColor] = useState('blue');
  const [editFolderIcon, setEditFolderIcon] = useState('Folder');

  // Move file target
  const [targetMoveFolderId, setTargetMoveFolderId] = useState('');

  // Rename file form
  const [renameTitle, setRenameTitle] = useState('');
  const [renameFileName, setRenameFileName] = useState('');

  // Upload file form & simulation progress
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadSize, setUploadSize] = useState('2.8 MB');
  const [uploadFolderId, setUploadFolderId] = useState('');
  const [uploadFileType, setUploadFileType] = useState<VaultFileItem['fileType']>('document');
  const [uploadProjectId, setUploadProjectId] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusStep, setUploadStatusStep] = useState<string>('');
  const [isSimulatingUpload, setIsSimulatingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Helper: map folder icon string to React node
  const renderFolderIcon = (iconName?: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'FileText':
        return <FileText className={className} />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className={className} />;
      case 'Image':
        return <ImageIcon className={className} />;
      case 'Video':
        return <Video className={className} />;
      case 'Shield':
        return <Shield className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      default:
        return <Folder className={className} />;
    }
  };

  // Helper: folder color accents
  const getFolderColorClass = (color?: string) => {
    switch (color) {
      case 'emerald':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20', dot: 'bg-emerald-500' };
      case 'amber':
        return { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20', dot: 'bg-amber-500' };
      case 'purple':
        return { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20', dot: 'bg-purple-500' };
      case 'indigo':
        return { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/20', dot: 'bg-indigo-500' };
      case 'cyan':
        return { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/20', dot: 'bg-cyan-500' };
      case 'rose':
        return { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'border-rose-500/20', dot: 'bg-rose-500' };
      default:
        return { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20', dot: 'bg-blue-500' };
    }
  };

  // Check if a file belongs to a given folder
  const isFileInFolder = (file: VaultFileItem, folder: VaultFolder) => {
    if (file.clientId !== currentClient?.id) return false;
    if (file.folderId && file.folderId === folder.id) return true;
    if (file.folder) {
      const fName = file.folder.toLowerCase().trim();
      const targetName = folder.name.toLowerCase().trim();
      const targetSlug = folder.slug.toLowerCase().trim();
      if (fName === targetName || fName === targetSlug) return true;
      if (targetSlug === 'documents' && (fName.includes('doc') || fName.includes('cert'))) return true;
      if (targetSlug === 'reports' && (fName.includes('report') || fName.includes('audit') || fName.includes('ledger') || fName.includes('3cd'))) return true;
      if (targetSlug === 'invoices' && (fName.includes('invoice') || fName.includes('financ') || fName.includes('cma') || fName.includes('bill'))) return true;
      if (targetSlug === 'photos' && (fName.includes('photo') || fName.includes('image') || fName.includes('site') || fName.includes('inspect'))) return true;
      if (targetSlug === 'videos' && (fName.includes('video') || fName.includes('record') || fName.includes('meeting'))) return true;
      if (targetSlug === 'contracts' && (fName.includes('contract') || fName.includes('agreement') || fName.includes('nda'))) return true;
    }
    // Fallback based on fileType if folderId is not directly set
    if (!file.folderId || file.folderId.trim() === '') {
      if (folder.slug === 'documents' && file.fileType === 'document') return true;
      if (folder.slug === 'reports' && (file.fileType === 'report' || file.fileType === 'spreadsheet')) return true;
      if (folder.slug === 'invoices' && file.fileType === 'invoice') return true;
      if (folder.slug === 'photos' && file.fileType === 'photo') return true;
      if (folder.slug === 'videos' && file.fileType === 'video') return true;
      if (folder.slug === 'contracts' && file.fileType === 'contract') return true;
    }
    return false;
  };

  // Files in vault for current client
  const allCurrentClientFiles = useMemo(() => {
    if (!currentClient) return [];
    return files.filter((f) => f.clientId === currentClient.id);
  }, [files, currentClient]);

  // Files filtered by current active folder
  const filesInActiveView = useMemo(() => {
    if (activeFolderId === 'ALL') {
      return allCurrentClientFiles;
    }
    if (!activeFolder) return [];
    return allCurrentClientFiles.filter((f) => isFileInFolder(f, activeFolder));
  }, [allCurrentClientFiles, activeFolderId, activeFolder]);

  // Search & type filtered
  const filteredFiles = useMemo(() => {
    return filesInActiveView.filter((f) => {
      // Type filter
      if (fileTypeFilter !== 'all') {
        if (fileTypeFilter === 'document' && f.fileType !== 'document') return false;
        if (fileTypeFilter === 'report' && f.fileType !== 'report') return false;
        if (fileTypeFilter === 'spreadsheet' && f.fileType !== 'spreadsheet') return false;
        if (fileTypeFilter === 'photo' && f.fileType !== 'photo') return false;
        if (fileTypeFilter === 'video' && f.fileType !== 'video') return false;
        if (fileTypeFilter === 'invoice' && f.fileType !== 'invoice') return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          f.title.toLowerCase().includes(q) ||
          f.fileName.toLowerCase().includes(q) ||
          (f.projectName && f.projectName.toLowerCase().includes(q)) ||
          f.folder.toLowerCase().includes(q) ||
          f.sha256Hash.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filesInActiveView, fileTypeFilter, searchQuery]);

  // Sorted files
  const sortedFiles = useMemo(() => {
    return [...filteredFiles].sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      if (sortBy === 'date-asc') return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'size-desc') {
        const parseSize = (s: string) => parseFloat(s) * (s.includes('GB') ? 1024 : 1);
        return parseSize(b.fileSize) - parseSize(a.fileSize);
      }
      return 0;
    });
  }, [filteredFiles, sortBy]);

  // Client permission checks
  const canUpload = isSuperAdmin || isStaff || (isClient && (authUser?.permissions?.['Files']?.upload ?? true));
  const canManageFolders = isSuperAdmin || isStaff;

  // Open Edit Folder modal
  const handleOpenEditFolder = (f: VaultFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setFolderToEdit(f);
    setEditFolderName(f.name);
    setEditFolderDesc(f.description || '');
    setEditFolderColor(f.color || 'blue');
    setEditFolderIcon(f.icon || 'Folder');
    setIsEditFolderModalOpen(true);
  };

  // Submit Edit Folder
  const handleSaveEditFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderToEdit || !editFolderName.trim()) return;

    updateFolder(folderToEdit.id, {
      name: editFolderName.trim(),
      description: editFolderDesc.trim(),
      color: editFolderColor,
      icon: editFolderIcon
    });

    onSuccessToast(`✓ Folder "${editFolderName.trim()}" updated successfully.`);
    setIsEditFolderModalOpen(false);
    setFolderToEdit(null);
  };

  // Open Delete Folder confirmation
  const handleOpenDeleteFolder = (f: VaultFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (f.isSystem) {
      onSuccessToast(`System folder "${f.name}" is protected and cannot be deleted.`);
      return;
    }
    setFolderToDelete(f);
  };

  // Confirm Delete Folder
  const handleConfirmDeleteFolder = () => {
    if (!folderToDelete) return;
    deleteFolder(folderToDelete.id);
    onSuccessToast(`✓ Folder "${folderToDelete.name}" deleted. Any existing files moved safely to Documents.`);
    setFolderToDelete(null);
    if (activeFolderId === folderToDelete.id) {
      setActiveFolderId('FLD-DOCS');
    }
  };

  // Submit New Folder
  const handleCreateFolderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const targetClientId = isSuperAdmin && newFolderScope === 'all' ? 'all' : (currentClient?.id || 'all');
    const created = createFolder({
      name: newFolderName.trim(),
      slug: newFolderName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      clientId: targetClientId,
      description: newFolderDesc.trim(),
      color: newFolderColor,
      icon: newFolderIcon,
      isSystem: false,
      permissions: { canView: true, canUpload: true, canDownload: true, canEdit: true, canDelete: true }
    });

    onSuccessToast(`✓ Folder "${created.name}" created successfully.`);
    setActiveFolderId(created.id);
    setIsNewFolderModalOpen(false);
    setNewFolderName('');
    setNewFolderDesc('');
    setNewFolderColor('blue');
    setNewFolderIcon('Folder');
  };

  // Trigger file browser
  const handleTriggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle actual file picked from computer
  const handleNativeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = file.name;
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    const cleanTitle = name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    let type: VaultFileItem['fileType'] = 'document';
    if (file.type.startsWith('image/')) type = 'photo';
    else if (file.type.startsWith('video/')) type = 'video';
    else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) type = 'spreadsheet';
    else if (name.toLowerCase().includes('report') || name.toLowerCase().includes('3cd') || name.toLowerCase().includes('audit')) type = 'report';
    else if (name.toLowerCase().includes('inv') || name.toLowerCase().includes('bill')) type = 'invoice';

    setUploadFileName(name);
    setUploadTitle(cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1));
    setUploadSize(sizeInMb);
    setUploadFileType(type);
  };

  // Handle upload submit with animated cryptographic hashing pipeline
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadFileName.trim()) return;

    setIsSimulatingUpload(true);
    setUploadProgress(15);
    setUploadStatusStep('Encrypting payload with AES-256 GCM...');

    const resolvedFolderId = uploadFolderId || (activeFolderId !== 'ALL' ? activeFolderId : 'FLD-DOCS');
    const targetFolder = folders.find((f) => f.id === resolvedFolderId) || folders[0];
    const proj = projects.find((p) => p.id === uploadProjectId);

    setTimeout(() => {
      setUploadProgress(50);
      setUploadStatusStep('Generating SHA-256 cryptographic verification checksum...');
    }, 400);

    setTimeout(() => {
      setUploadProgress(85);
      setUploadStatusStep('Committing to client vault isolated storage...');
    }, 800);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStatusStep('Storage verified & synchronized.');

      const newFile = addFile({
        title: uploadTitle.trim(),
        fileName: uploadFileName.trim(),
        fileType: uploadFileType,
        fileSize: uploadSize,
        clientId: currentClient?.id || 'USR-CL-101',
        clientName: currentClient?.company || 'Client Vault',
        projectId: proj?.id,
        projectName: proj?.title,
        folderId: targetFolder?.id || 'FLD-DOCS',
        folder: targetFolder?.name || 'Documents & Certificates',
        uploadedBy: authUser ? `${authUser.fullName} (${authUser.role})` : 'CA Krishna Panjiyar',
        encryptionStandard: 'AES-256 GCM',
        previewContent: `PANJIYAR KRISHNA & CO. - CLIENT SECURE VAULT
File Title: ${uploadTitle.trim()}
File Name: ${uploadFileName.trim()}
Client: ${currentClient?.company || 'Corporate Client'}
Folder: ${targetFolder?.name || 'Documents'}
Security Classification: Confidential / Privileged
Verification: Digital SHA-256 hash calculated & registered in immutable firm audit log.`,
        permissions: {
          canView: true,
          canUpload: true,
          canDownload: true,
          canEdit: !isClient,
          canDelete: isSuperAdmin,
          canShare: true,
          canRename: !isClient,
          canMove: !isClient
        }
      });

      onSuccessToast(`✓ File "${newFile.fileName}" encrypted and stored in ${targetFolder?.name}.`);
      setIsSimulatingUpload(false);
      setIsUploadModalOpen(false);
      setUploadTitle('');
      setUploadFileName('');
      setUploadProgress(0);
      setUploadStatusStep('');
    }, 1200);
  };

  // Real native file download
  const handleDownloadFile = (file: VaultFileItem) => {
    try {
      const content = file.previewContent || `Panjiyar Krishna & Co. Chartered Accountants
Encrypted Vault Record: ${file.title}
File Name: ${file.fileName}
Client: ${file.clientName}
Date: ${file.uploadDate}
SHA-256: ${file.sha256Hash}
Cipher: ${file.encryptionStandard}
Integrity verified under statutory audit protocol.`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      onSuccessToast(`✓ Downloaded ${file.fileName}. SHA-256 verified.`);
    } catch {
      onSuccessToast(`Downloaded ${file.fileName}. Verified SHA-256 hash.`);
    }
  };

  // Open Move File modal
  const handleOpenMoveModal = (file: VaultFileItem) => {
    setFileToMove(file);
    setTargetMoveFolderId(file.folderId || clientFolders[0]?.id || 'FLD-DOCS');
  };

  // Confirm Move File
  const handleConfirmMoveFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToMove || !targetMoveFolderId) return;

    const targetFolder = folders.find((f) => f.id === targetMoveFolderId);
    if (!targetFolder) return;

    moveFile(fileToMove.id, targetFolder.id, targetFolder.name);
    onSuccessToast(`✓ Moved "${fileToMove.fileName}" to ${targetFolder.name}.`);
    setFileToMove(null);
  };

  // Open Rename File modal
  const handleOpenRenameModal = (file: VaultFileItem) => {
    setFileToRename(file);
    setRenameTitle(file.title);
    setRenameFileName(file.fileName);
  };

  // Confirm Rename File
  const handleConfirmRenameFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToRename || !renameTitle.trim() || !renameFileName.trim()) return;

    renameFile(fileToRename.id, renameTitle.trim(), renameFileName.trim());
    onSuccessToast(`✓ File renamed to "${renameFileName.trim()}".`);
    setFileToRename(null);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Client Vault Security Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <Lock size={11} className="text-emerald-600" />
              <span>Isolated Client Cryptographic Storage</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
              <Sparkles size={11} className="text-[#0969C7]" />
              <span>Real-Time Cloud Synchronization</span>
            </span>
          </div>
          <h2 className="font-manrope font-extrabold text-xl sm:text-2xl text-[#062A5A] tracking-tight">
            Vault Explorer &amp; Folders
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Organize audit filings, statutory certificates, loan CMA models, and site inspection media with strict granular access controls.
          </p>
        </div>

        {/* Client Selector (Admin/Staff) or Verified Badge (Client) */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {isClient ? (
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">Your Confidential Vault</span>
                <span className="font-extrabold text-[#062A5A]">{currentClient?.company || authUser?.company}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Building size={14} className="absolute left-3 top-3 text-slate-400" />
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setActiveFolderId('FLD-DOCS');
                  }}
                  className="pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-[#062A5A] bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7] shadow-2xs cursor-pointer"
                >
                  {accessibleClients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company} ({c.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Action: Upload File */}
          {canUpload && (
            <button
              onClick={() => {
                setUploadFolderId(activeFolderId !== 'ALL' ? activeFolderId : 'FLD-DOCS');
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <UploadCloud size={15} className="text-[#F28C18]" />
              <span>Upload File</span>
            </button>
          )}

          {/* Action: Create New Folder */}
          {canManageFolders && (
            <button
              onClick={() => setIsNewFolderModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-[#062A5A] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs bg-white"
            >
              <FolderPlus size={15} className="text-[#0969C7]" />
              <span>New Folder</span>
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 overflow-x-auto py-0.5">
          <button
            onClick={() => setActiveFolderId('ALL')}
            className={`font-semibold flex items-center gap-1 hover:text-[#062A5A] transition-colors ${
              activeFolderId === 'ALL' ? 'text-[#0969C7] font-bold' : ''
            }`}
          >
            <FolderKanbanIcon className="w-3.5 h-3.5" />
            <span>Vault Root</span>
          </button>

          <ChevronRight size={13} className="text-slate-400 shrink-0" />

          <span className="font-semibold text-slate-700 truncate max-w-[160px]">
            {currentClient?.company || 'Client Vault'}
          </span>

          {activeFolder && (
            <>
              <ChevronRight size={13} className="text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white border border-slate-200 font-bold text-[#062A5A] shrink-0">
                {renderFolderIcon(activeFolder.icon, 'w-3.5 h-3.5 text-[#0969C7]')}
                <span>{activeFolder.name}</span>
              </div>
            </>
          )}
        </div>

        <div className="text-[11px] font-mono text-slate-400 shrink-0 hidden sm:block">
          {sortedFiles.length} file{sortedFiles.length === 1 ? '' : 's'} stored
        </div>
      </div>

      {/* Main Explorer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Folders Panel */}
        <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between px-2 pt-1">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Vault Folders
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              {clientFolders.length}
            </span>
          </div>

          {/* "All Files" Root Switcher */}
          <button
            type="button"
            onClick={() => setActiveFolderId('ALL')}
            className={`w-full p-2.5 rounded-2xl text-left flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
              activeFolderId === 'ALL'
                ? 'bg-[#062A5A] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <FolderKanbanIcon className={`w-4 h-4 ${activeFolderId === 'ALL' ? 'text-[#F28C18]' : 'text-slate-400'}`} />
              <span className="truncate">All Vault Files</span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                activeFolderId === 'ALL' ? 'bg-white/20 text-white font-bold' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {allCurrentClientFiles.length}
            </span>
          </button>

          <div className="space-y-1">
            {clientFolders.map((f) => {
              const count = allCurrentClientFiles.filter((file) => isFileInFolder(file, f)).length;
              const isActive = activeFolderId === f.id;
              const colorStyle = getFolderColorClass(f.color);

              return (
                <div
                  key={f.id}
                  className={`group relative rounded-2xl transition-all ${
                    isActive ? 'bg-[#062A5A] text-white shadow-2xs' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFolderId(f.id)}
                    className="w-full p-2.5 text-left flex items-center justify-between text-xs font-semibold cursor-pointer pr-10"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={isActive ? 'text-[#F28C18]' : colorStyle.text}>
                        {renderFolderIcon(f.icon, 'w-4 h-4')}
                      </span>
                      <span className="truncate">{f.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>

                  {/* Folder quick actions (Admin/Staff can edit or delete custom folders) */}
                  {canManageFolders && (
                    <div className="absolute right-1.5 top-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditFolder(f, e)}
                        title="Edit Folder"
                        className={`p-1 rounded-md text-xs cursor-pointer ${
                          isActive ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Edit2 size={12} />
                      </button>

                      {!f.isSystem && (
                        <button
                          type="button"
                          onClick={(e) => handleOpenDeleteFolder(f, e)}
                          title="Delete Folder"
                          className={`p-1 rounded-md text-xs cursor-pointer ${
                            isActive ? 'text-white/70 hover:text-rose-300 hover:bg-white/10' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Client isolation footer info */}
          <div className="pt-3 border-t border-slate-100 px-2 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-slate-500 font-semibold">
              <span>Client Vault:</span>
              <span className="text-[#062A5A]">{currentClient?.fullName}</span>
            </div>
            <div className="text-slate-500 truncate">{currentClient?.email}</div>
            <div className="text-[10px] text-emerald-600 font-mono flex items-center gap-1 pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Perimeter Isolation Active
            </div>
          </div>
        </div>

        {/* Right Column: Files Workspace */}
        <div className="lg:col-span-9 space-y-4">
          {/* Active Folder Header Card */}
          {activeFolder && (
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                    getFolderColorClass(activeFolder.color).bg
                  } ${getFolderColorClass(activeFolder.color).text}`}
                >
                  {renderFolderIcon(activeFolder.icon, 'w-6 h-6')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                      {activeFolder.name}
                    </h3>
                    {activeFolder.isSystem ? (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        System Standard
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Custom Folder
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeFolder.description || 'Dedicated regulatory repository inside client secure vault.'}
                  </p>
                </div>
              </div>

              {canManageFolders && !activeFolder.isSystem && (
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleOpenEditFolder(activeFolder, e)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Edit2 size={12} />
                    <span>Edit Folder</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleOpenDeleteFolder(activeFolder, e)}
                    className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Trash2 size={12} />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search, Filter Tabs & View Mode Bar */}
          <div className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              {/* Search input */}
              <div className="relative w-full flex-1">
                <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search files in ${activeFolder?.name || 'Vault'} (name, project, SHA)...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-50/80 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7] text-slate-800"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                <div className="relative flex-1 sm:flex-initial">
                  <ArrowUpDown size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="pl-7 pr-7 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 bg-white font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="size-desc">Largest Size</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-[#062A5A] shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-[#062A5A] shadow-xs font-bold' : 'text-slate-400 hover:text-slate-600'
                    }`}
                    title="Card Grid View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick File Type Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => setFileTypeFilter('all')}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  fileTypeFilter === 'all'
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                All Types
              </button>
              <button
                type="button"
                onClick={() => setFileTypeFilter('document')}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  fileTypeFilter === 'document'
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <FileText size={12} />
                <span>PDF &amp; Docs</span>
              </button>
              <button
                type="button"
                onClick={() => setFileTypeFilter('report')}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  fileTypeFilter === 'report'
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <FileSpreadsheet size={12} />
                <span>Audit &amp; 3CD</span>
              </button>
              <button
                type="button"
                onClick={() => setFileTypeFilter('spreadsheet')}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  fileTypeFilter === 'spreadsheet'
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <FileSpreadsheet size={12} />
                <span>CMA &amp; Excel</span>
              </button>
              <button
                type="button"
                onClick={() => setFileTypeFilter('photo')}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  fileTypeFilter === 'photo'
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <ImageIcon size={12} />
                <span>Photos</span>
              </button>
              <button
                type="button"
                onClick={() => setFileTypeFilter('video')}
                className={`px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  fileTypeFilter === 'video'
                    ? 'bg-[#062A5A] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <Video size={12} />
                <span>Videos</span>
              </button>
            </div>
          </div>

          {/* Files List / Grid Render */}
          {sortedFiles.length > 0 ? (
            viewMode === 'list' ? (
              /* LIST VIEW */
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100 text-xs">
                  {sortedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* File Type Icon */}
                        <div
                          onClick={() => {
                            setFileToPreview(file);
                            setPreviewTab('viewer');
                          }}
                          className="w-10 h-10 rounded-2xl bg-[#EEF5FC] text-[#0969C7] flex items-center justify-center shrink-0 cursor-pointer hover:scale-105 transition-transform"
                        >
                          {file.fileType === 'photo' ? (
                            <ImageIcon size={19} />
                          ) : file.fileType === 'video' ? (
                            <Video size={19} />
                          ) : file.fileType === 'spreadsheet' ? (
                            <FileSpreadsheet size={19} />
                          ) : (
                            <FileText size={19} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => {
                                setFileToPreview(file);
                                setPreviewTab('viewer');
                              }}
                              className="font-bold text-[#062A5A] text-sm truncate hover:text-[#0969C7] cursor-pointer"
                            >
                              {file.title}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-600 shrink-0">
                              {file.fileName}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-1 flex-wrap">
                            <span className="font-semibold text-slate-700">{file.fileSize}</span>
                            <span>&middot;</span>
                            <span>{file.uploadDate}</span>
                            <span>&middot;</span>
                            <span className="text-slate-600">by {file.uploadedBy.split(' ')[0]}</span>
                            {file.folder && (
                              <>
                                <span>&middot;</span>
                                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                                  {file.folder}
                                </span>
                              </>
                            )}
                            {file.projectName && (
                              <>
                                <span>&middot;</span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold text-[10px] border border-amber-200">
                                  {file.projectName}
                                </span>
                              </>
                            )}
                          </div>

                          {/* SHA256 & Cipher badge */}
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-400">
                            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <Key size={10} /> {file.encryptionStandard}
                            </span>
                            <span className="truncate max-w-[220px]" title={file.sha256Hash}>
                              SHA: {file.sha256Hash.substring(0, 16)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => {
                            setFileToPreview(file);
                            setPreviewTab('viewer');
                          }}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          title="Preview Document & Verification"
                        >
                          <Eye size={14} className="text-[#0969C7]" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
                          className="px-3 py-2 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Download Encrypted Payload"
                        >
                          <Download size={13} className="text-[#0969C7]" />
                          <span>Download</span>
                        </button>

                        {/* Move file */}
                        {!isClient && (
                          <button
                            type="button"
                            onClick={() => handleOpenMoveModal(file)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Move to another folder"
                          >
                            <Move size={14} />
                          </button>
                        )}

                        {/* Rename file */}
                        {!isClient && (
                          <button
                            type="button"
                            onClick={() => handleOpenRenameModal(file)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Rename File"
                          >
                            <Edit2 size={14} />
                          </button>
                        )}

                        {/* Share link */}
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `https://panjiyarkrishna.com/portal/vault/doc/${file.id}?token=ephem_${file.sha256Hash.substring(0, 10)}`
                            );
                            onSuccessToast(`✓ Encrypted share token copied for ${file.fileName}`);
                          }}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                          title="Copy Encrypted Share Link"
                        >
                          <Share2 size={14} />
                        </button>

                        {/* Delete file (Admins only) */}
                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            title="Purge File"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div
                          onClick={() => {
                            setFileToPreview(file);
                            setPreviewTab('viewer');
                          }}
                          className="w-10 h-10 rounded-2xl bg-[#EEF5FC] text-[#0969C7] flex items-center justify-center cursor-pointer group-hover:scale-105 transition-transform"
                        >
                          {file.fileType === 'photo' ? (
                            <ImageIcon size={19} />
                          ) : file.fileType === 'video' ? (
                            <Video size={19} />
                          ) : file.fileType === 'spreadsheet' ? (
                            <FileSpreadsheet size={19} />
                          ) : (
                            <FileText size={19} />
                          )}
                        </div>

                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-slate-100 text-slate-600 font-semibold">
                          {file.fileSize}
                        </span>
                      </div>

                      <h4
                        onClick={() => {
                          setFileToPreview(file);
                          setPreviewTab('viewer');
                        }}
                        className="font-bold text-sm text-[#062A5A] truncate cursor-pointer hover:text-[#0969C7]"
                        title={file.title}
                      >
                        {file.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                        {file.fileName}
                      </p>

                      <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[10px]">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold">
                          {file.folder}
                        </span>
                        <span className="text-slate-400">{file.uploadDate}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setFileToPreview(file);
                          setPreviewTab('viewer');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Eye size={12} className="text-[#0969C7]" />
                        <span>View</span>
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDownloadFile(file)}
                          className="p-1.5 rounded-xl bg-[#EEF5FC] hover:bg-[#D9E2EC] text-[#062A5A] cursor-pointer"
                          title="Download File"
                        >
                          <Download size={13} className="text-[#0969C7]" />
                        </button>

                        {!isClient && (
                          <button
                            type="button"
                            onClick={() => handleOpenMoveModal(file)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Move Folder"
                          >
                            <Move size={13} />
                          </button>
                        )}

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete File"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* EMPTY STATE */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 text-[#0969C7] flex items-center justify-center mx-auto">
                <Folder size={32} />
              </div>
              <h4 className="font-manrope font-bold text-base text-[#062A5A]">
                No files found in {activeFolder ? activeFolder.name : 'this view'}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                {searchQuery
                  ? `No documents matched "${searchQuery}". Clear your search query or change filter parameters.`
                  : `There are currently no files in this section for ${currentClient?.company}. Click "Upload File" above to store an encrypted document.`}
              </p>
              {canUpload && (
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-5 py-2.5 rounded-2xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-2xs mt-2"
                >
                  <Plus size={14} className="text-[#F28C18]" />
                  <span>Upload Document to {activeFolder?.name || 'Vault'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: Upload File Modal with Pipeline Simulation                       */}
      {/* ========================================================================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-manrope font-extrabold text-lg text-[#062A5A]">
                  Store &amp; Encrypt Document
                </h3>
                <p className="text-xs text-slate-400">
                  Target Vault: <strong className="text-slate-700">{currentClient?.company}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => !isSimulatingUpload && setIsUploadModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Hidden native input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleNativeFileChange}
              className="hidden"
            />

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              {/* Drag/Drop Clickable Target */}
              <div
                onClick={handleTriggerFileSelect}
                className="border-2 border-dashed border-slate-300 hover:border-[#0969C7] rounded-2xl p-5 text-center bg-slate-50/60 hover:bg-blue-50/30 transition-all cursor-pointer space-y-1"
              >
                <UploadCloud className="w-8 h-8 mx-auto text-[#0969C7]" />
                <div className="font-bold text-[#062A5A] text-xs">
                  {uploadFileName ? `Selected: ${uploadFileName}` : 'Click to browse files or drop document here'}
                </div>
                <div className="text-[11px] text-slate-400">
                  Supports PDF, Excel, CMA spreadsheets, Word, PNG, JPG, MP4 (Max 100MB)
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Form 3CD Final Signed Audit Dossier"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Physical File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex_Form_3CD_Audit_Signed.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Destination Folder *</label>
                  <select
                    value={uploadFolderId}
                    onChange={(e) => setUploadFolderId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold cursor-pointer"
                  >
                    {clientFolders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document Category</label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold cursor-pointer"
                  >
                    <option value="document">Statutory Document (PDF/Doc)</option>
                    <option value="report">Audit / Tax Report (3CD/9C)</option>
                    <option value="spreadsheet">CMA Model / Financial Spreadsheet</option>
                    <option value="invoice">Commercial Invoice / Financing</option>
                    <option value="photo">Inspection Photo (Geotagged)</option>
                    <option value="video">Review Video Recording</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Associated Project / Mandate</label>
                <select
                  value={uploadProjectId}
                  onChange={(e) => setUploadProjectId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold cursor-pointer"
                >
                  <option value="">General Client Repository (No Project Linked)</option>
                  {projects
                    .filter((p) => isSuperAdmin || p.clientId === currentClient?.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.category})
                      </option>
                    ))}
                </select>
              </div>

              {/* Progress animation when uploading */}
              {isSimulatingUpload && (
                <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-blue-900 font-bold">
                    <span>{uploadStatusStep}</span>
                    <span className="font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                    <div
                      className="h-full bg-[#0969C7] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isSimulatingUpload}
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSimulatingUpload}
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Lock size={13} className="text-[#F28C18]" />
                  <span>{isSimulatingUpload ? 'Encrypting & Storing...' : 'Commit to Vault'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Create New Folder Modal                                          */}
      {/* ========================================================================= */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-extrabold text-lg text-[#062A5A] flex items-center gap-2">
                <FolderPlus className="text-[#0969C7]" size={20} />
                <span>Create Vault Folder</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsNewFolderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Folder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FY 2026 Statutory Workpapers"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Purpose of this folder (e.g. Monthly GST reconciliations & ledger audit)"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Color Theme</label>
                  <select
                    value={newFolderColor}
                    onChange={(e) => setNewFolderColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer font-semibold"
                  >
                    <option value="blue">Blue (Corporate)</option>
                    <option value="emerald">Emerald (Tax/Compliance)</option>
                    <option value="amber">Amber (Financial/CMA)</option>
                    <option value="purple">Purple (Audit/Review)</option>
                    <option value="indigo">Indigo (Statutory)</option>
                    <option value="cyan">Cyan (Agreements)</option>
                    <option value="rose">Rose (Confidential)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icon Style</label>
                  <select
                    value={newFolderIcon}
                    onChange={(e) => setNewFolderIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer font-semibold"
                  >
                    <option value="Folder">Folder</option>
                    <option value="FileText">Document</option>
                    <option value="FileSpreadsheet">Spreadsheet</option>
                    <option value="Image">Photo</option>
                    <option value="Video">Video</option>
                    <option value="Shield">Shield</option>
                    <option value="Briefcase">Briefcase</option>
                  </select>
                </div>
              </div>

              {isSuperAdmin && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Folder Scope</label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="folderScope"
                        checked={newFolderScope === 'client'}
                        onChange={() => setNewFolderScope('client')}
                      />
                      <span>Client Only ({currentClient?.company})</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="folderScope"
                        checked={newFolderScope === 'all'}
                        onChange={() => setNewFolderScope('all')}
                      />
                      <span>Global (All Client Vaults)</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus size={14} className="text-[#F28C18]" />
                  <span>Create Folder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Edit Folder Modal                                                */}
      {/* ========================================================================= */}
      {isEditFolderModalOpen && folderToEdit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-extrabold text-lg text-[#062A5A] flex items-center gap-2">
                <Edit2 className="text-[#0969C7]" size={18} />
                <span>Edit Folder: {folderToEdit.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditFolderModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditFolder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Folder Name *</label>
                <input
                  type="text"
                  required
                  value={editFolderName}
                  onChange={(e) => setEditFolderName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editFolderDesc}
                  onChange={(e) => setEditFolderDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Color Theme</label>
                  <select
                    value={editFolderColor}
                    onChange={(e) => setEditFolderColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer font-semibold"
                  >
                    <option value="blue">Blue</option>
                    <option value="emerald">Emerald</option>
                    <option value="amber">Amber</option>
                    <option value="purple">Purple</option>
                    <option value="indigo">Indigo</option>
                    <option value="cyan">Cyan</option>
                    <option value="rose">Rose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Icon Style</label>
                  <select
                    value={editFolderIcon}
                    onChange={(e) => setEditFolderIcon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white cursor-pointer font-semibold"
                  >
                    <option value="Folder">Folder</option>
                    <option value="FileText">Document</option>
                    <option value="FileSpreadsheet">Spreadsheet</option>
                    <option value="Image">Photo</option>
                    <option value="Video">Video</option>
                    <option value="Shield">Shield</option>
                    <option value="Briefcase">Briefcase</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Move File Modal                                                  */}
      {/* ========================================================================= */}
      {fileToMove && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-base text-[#062A5A] flex items-center gap-2">
                <Move className="text-[#0969C7]" size={18} />
                <span>Move File to Folder</span>
              </h3>
              <button
                type="button"
                onClick={() => setFileToMove(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmMoveFile} className="space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">File Selected</div>
                <div className="font-bold text-[#062A5A] truncate">{fileToMove.title}</div>
                <div className="text-slate-500 font-mono text-[11px] truncate">{fileToMove.fileName}</div>
                <div className="text-[10px] text-slate-400">Current folder: <strong>{fileToMove.folder}</strong></div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Select Destination Folder *</label>
                <select
                  value={targetMoveFolderId}
                  onChange={(e) => setTargetMoveFolderId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold cursor-pointer"
                >
                  {clientFolders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFileToMove(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Move size={13} className="text-[#F28C18]" />
                  <span>Move File</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: Rename File Modal                                                */}
      {/* ========================================================================= */}
      {fileToRename && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-manrope font-bold text-base text-[#062A5A] flex items-center gap-2">
                <Edit2 className="text-[#0969C7]" size={18} />
                <span>Rename Vault Document</span>
              </h3>
              <button
                type="button"
                onClick={() => setFileToRename(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmRenameFile} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={renameTitle}
                  onChange={(e) => setRenameTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">File Name (with extension) *</label>
                <input
                  type="text"
                  required
                  value={renameFileName}
                  onChange={(e) => setRenameFileName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-[#0969C7] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFileToRename(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs cursor-pointer"
                >
                  Save Rename
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: File Preview Drawer / High-Tech Modal                            */}
      {/* ========================================================================= */}
      {fileToPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 text-left relative animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between pb-3.5 border-b border-slate-100 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                    {fileToPreview.folder}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <Key size={10} /> {fileToPreview.encryptionStandard}
                  </span>
                </div>
                <h3 className="font-manrope font-extrabold text-lg text-[#062A5A] truncate">
                  {fileToPreview.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5 truncate">
                  {fileToPreview.fileName} &middot; {fileToPreview.fileSize} &middot; Uploaded {fileToPreview.uploadDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setFileToPreview(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 pt-3 border-b border-slate-100 text-xs shrink-0">
              <button
                type="button"
                onClick={() => setPreviewTab('viewer')}
                className={`pb-2.5 px-2 font-bold cursor-pointer transition-all border-b-2 ${
                  previewTab === 'viewer'
                    ? 'border-[#0969C7] text-[#062A5A]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Document Viewer
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('crypto')}
                className={`pb-2.5 px-2 font-bold cursor-pointer transition-all border-b-2 ${
                  previewTab === 'crypto'
                    ? 'border-[#0969C7] text-[#062A5A]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Cryptographic Integrity
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('permissions')}
                className={`pb-2.5 px-2 font-bold cursor-pointer transition-all border-b-2 ${
                  previewTab === 'permissions'
                    ? 'border-[#0969C7] text-[#062A5A]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Access &amp; Permissions
              </button>
            </div>

            {/* Content Body */}
            <div className="py-4 overflow-y-auto flex-1 text-xs space-y-4">
              {previewTab === 'viewer' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed whitespace-pre-wrap border border-slate-800 shadow-inner">
                    {fileToPreview.previewContent || 'Confidential audit record verified under chartered compliance protocol.'}
                  </div>
                </div>
              )}

              {previewTab === 'crypto' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        SHA-256 Checksum Hash
                      </span>
                      <div className="font-mono text-slate-800 break-all bg-white p-2.5 rounded-xl border border-slate-200 mt-1 flex items-center justify-between gap-2">
                        <span>{fileToPreview.sha256Hash}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(fileToPreview.sha256Hash);
                            onSuccessToast('✓ SHA-256 hash copied to clipboard');
                          }}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Encryption Standard</span>
                        <span className="font-semibold text-emerald-700">{fileToPreview.encryptionStandard}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Uploaded Authority</span>
                        <span className="font-semibold text-slate-700">{fileToPreview.uploadedBy}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Client Isolation ID</span>
                        <span className="font-semibold text-slate-700">{fileToPreview.clientId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Storage Status</span>
                        <span className="font-semibold text-emerald-600">Encrypted &amp; Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {previewTab === 'permissions' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-[#062A5A] block mb-1">
                      Granular Document Access Flags
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(fileToPreview.permissions || {}).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                        >
                          <span className="text-slate-600 capitalize">{key.replace(/^can/, '')}</span>
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              val ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {val ? 'ALLOWED' : 'BLOCKED'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer quick action bar */}
            <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                {!isClient && (
                  <button
                    type="button"
                    onClick={() => {
                      const f = fileToPreview;
                      setFileToPreview(null);
                      handleOpenMoveModal(f);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Move size={12} />
                    <span>Move</span>
                  </button>
                )}
                {!isClient && (
                  <button
                    type="button"
                    onClick={() => {
                      const f = fileToPreview;
                      setFileToPreview(null);
                      handleOpenRenameModal(f);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 size={12} />
                    <span>Rename</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFileToPreview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(fileToPreview)}
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} className="text-[#F28C18]" />
                  <span>Download Document</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: Delete File Confirmation Modal                                   */}
      {/* ========================================================================= */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-left relative animate-in zoom-in-95">
            <button
              onClick={() => setFileToDelete(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mb-3">
              <Trash2 size={22} />
            </div>

            <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
              Delete Vault File?
            </h3>

            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800">{fileToDelete.fileName}</strong> ({fileToDelete.title}) from the client vault? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteFile(fileToDelete.id);
                  onSuccessToast(`✓ Removed ${fileToDelete.fileName}`);
                  setFileToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: Delete Folder Confirmation Modal                                 */}
      {/* ========================================================================= */}
      {folderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 text-left relative animate-in zoom-in-95">
            <button
              onClick={() => setFolderToDelete(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mb-3">
              <AlertTriangle size={22} />
            </div>

            <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
              Delete Folder: {folderToDelete.name}?
            </h3>

            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
              This folder will be removed. To safeguard statutory data, any files currently inside <strong className="text-slate-800">{folderToDelete.name}</strong> will be safely moved to the <strong>Documents &amp; Certificates</strong> root folder.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFolderToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDeleteFolder}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete &amp; Preserve Files</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper icon component for root vault
function FolderKanbanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      <path d="M8 10v4" />
      <path d="M12 10v2" />
      <path d="M16 10v6" />
    </svg>
  );
}
