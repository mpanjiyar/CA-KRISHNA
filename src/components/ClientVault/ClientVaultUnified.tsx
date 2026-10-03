import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Folder,
  FileText,
  Briefcase,
  Users,
  Shield,
  MessageSquare,
  Activity,
  Settings,
  Lock,
  Search,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Eye,
  Share2,
  Trash2,
  Copy,
  Check,
  Building,
  RefreshCw,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Smartphone,
  SlidersHorizontal,
  Table,
  Grid3X3,
  Terminal,
  ShieldCheck,
  UserCheck,
  Send,
  ArrowLeft,
  ChevronDown,
  Key,
  UserX,
  Edit3
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultFileItem, VaultUser, VaultProject, VaultAccountType } from '../../types/vault';
import { VAULT_FOLDERS_CONFIG, VaultFolderCard } from './VaultFolderCard';
import { VaultFileCard } from './VaultFileCard';
import { VaultFilePreviewModal } from './VaultFilePreviewModal';
import { VaultUploadModal } from './VaultUploadModal';
import { VaultSecurityAuditModal } from './VaultSecurityAuditModal';
import { VaultUserProfileModal } from './VaultUserProfileModal';
import { VaultCredentialManager } from './VaultCredentialManager';
import { PermissionsManager } from './PermissionsManager';
import { VaultProjectsManager } from './VaultProjectsManager';
import { VaultUsersList } from './VaultUsersList';
import { VaultInvitationsView } from './VaultInvitationsView';
import { VaultAuditLogView } from './VaultAuditLogView';
import { VaultSecuritySettings } from './VaultSecuritySettings';
import { CreateAccountModal } from './CreateAccountModal';
import { canUserAccessFile, canUserAccessProject } from '../../lib/vaultCrypto';

type VaultMainTab =
  | 'overview'
  | 'files'
  | 'projects'
  | 'credentials'
  | 'clients'
  | 'staff'
  | 'permissions'
  | 'messages'
  | 'audit'
  | 'settings';

interface ClientVaultUnifiedProps {
  onLogout?: () => void;
  onBackToWebsite?: () => void;
}

export const ClientVaultUnified: React.FC<ClientVaultUnifiedProps> = ({
  onLogout,
  onBackToWebsite
}) => {
  const {
    users,
    files,
    projects,
    auditLogs,
    currentVaultUser,
    switchActiveUser,
    logoutVaultSession,
    deleteFile,
    updateFile
  } = useVault();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<VaultMainTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isPersonaPickerOpen, setIsPersonaPickerOpen] = useState(false);

  // Quick Persona Testdrive Switcher
  const quickPersonas = useMemo(() => [
    {
      title: 'Managing Partner',
      roleBadge: 'Super Admin',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      user: users.find((u) => u.accountType === 'super_admin') || users[0]
    },
    {
      title: 'Senior Audit Manager',
      roleBadge: 'Staff CA',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      user: users.find((u) => u.accountType === 'staff') || users[1]
    },
    {
      title: 'Apex Precision Engineering',
      roleBadge: 'Client',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      user: users.find((u) => u.id === 'USR-CL-101') || users[2]
    },
    {
      title: 'Nexus BioPharma',
      roleBadge: 'Client',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      user: users.find((u) => u.id === 'USR-CL-102') || users[3]
    }
  ], [users]);

  // Active folder in Explorer (null means all / root)
  const [selectedFolder, setSelectedFolder] = useState<VaultFileItem['folder'] | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Verified' | 'Under Review' | 'Action Required'>('ALL');

  // Multi-tenant client filter for Admin / Staff
  const clientsList = useMemo(() => users.filter((u) => u.accountType === 'client'), [users]);
  const [adminSelectedClientId, setAdminSelectedClientId] = useState<string>('ALL');

  // Modals & Drawers
  const [previewFile, setPreviewFile] = useState<VaultFileItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedProfileUser, setSelectedProfileUser] = useState<VaultUser | null>(null);
  const [clientViewMode, setClientViewMode] = useState<'roster' | 'credentials'>('credentials');
  const [staffViewMode, setStaffViewMode] = useState<'roster' | 'credentials'>('credentials');
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [createAccountType, setCreateAccountType] = useState<VaultAccountType>('client');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Determine current active user & role boundaries
  const currentUser = currentVaultUser || users[0];
  const isClient = currentUser?.accountType === 'client';
  const isStaff = currentUser?.accountType === 'staff';
  const isAdmin = currentUser?.accountType === 'super_admin';

  // STRICT AUTHORIZATION: Scoped files visible to the current identity
  const scopedFiles = useMemo(() => {
    return files.filter((f) => {
      // 1. Strict user-level access check
      if (!canUserAccessFile(currentUser, f)) return false;

      // 2. If Admin has selected a specific client from the multi-tenant dropdown
      if (isAdmin && adminSelectedClientId !== 'ALL') {
        if (f.clientId !== adminSelectedClientId) return false;
      }

      return true;
    });
  }, [files, currentUser, isAdmin, adminSelectedClientId]);

  // Scoped projects
  const scopedProjects = useMemo(() => {
    return projects.filter((p) => {
      if (!canUserAccessProject(currentUser, p)) return false;
      if (isAdmin && adminSelectedClientId !== 'ALL') {
        if (p.clientId !== adminSelectedClientId) return false;
      }
      return true;
    });
  }, [projects, currentUser, isAdmin, adminSelectedClientId]);

  // Filtered files according to search, folder, and status
  const displayedFiles = useMemo(() => {
    return scopedFiles.filter((f) => {
      const matchesSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.sha256Hash.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFolder = selectedFolder === 'ALL' || f.folder === selectedFolder;
      const matchesStatus =
        statusFilter === 'ALL' || (f.verificationStatus || 'Verified') === statusFilter;

      return matchesSearch && matchesFolder && matchesStatus;
    });
  }, [scopedFiles, searchQuery, selectedFolder, statusFilter]);

  // Folder counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    VAULT_FOLDERS_CONFIG.forEach((f) => {
      counts[f.id] = scopedFiles.filter((file) => file.folder === f.id).length;
    });
    return counts;
  }, [scopedFiles]);

  // File actions
  const handleDownload = (file: VaultFileItem) => {
    showToast(`✓ Encrypted download initiated: "${file.fileName}". SHA-256 hash verified.`);
  };

  const handleToggleStatus = (file: VaultFileItem) => {
    if (!isStaff && !isAdmin) return;
    const current = file.verificationStatus || 'Verified';
    const next = current === 'Verified' ? 'Action Required' : 'Verified';
    updateFile(file.id, {
      verificationStatus: next,
      reviewedBy: currentUser?.fullName
    });
    showToast(`Status updated to "${next}" by ${currentUser?.fullName}.`);
  };

  const handleDeleteFile = (file: VaultFileItem) => {
    deleteFile(file.id);
    showToast(`File "${file.fileName}" purged from vault.`);
  };

  const handleLogout = () => {
    logoutVaultSession();
    if (onLogout) onLogout();
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FC] text-left flex flex-col font-inter">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#062A5A] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 text-xs sm:text-sm animate-vault-slide max-w-[90vw]">
          <CheckCircle2 size={16} className="text-[#159447] shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 transition-shadow shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Back to Website Button if provided */}
            {onBackToWebsite && (
              <button
                type="button"
                onClick={onBackToWebsite}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#062A5A] font-semibold text-xs border border-slate-200 shadow-2xs transition-colors shrink-0 cursor-pointer"
                title="Return to Main Firm Website"
              >
                <ArrowLeft size={13} />
                <span className="hidden sm:inline">Website</span>
              </button>
            )}

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation drawer"
            >
              {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#062A5A] flex items-center justify-center text-[#F28C18] shrink-0 shadow-xs">
                <Lock size={18} />
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="font-manrope font-extrabold text-sm sm:text-base text-[#062A5A] truncate">
                    PANJIYAR KRISHNA &amp; CO.
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>AES-256 Zero-Knowledge</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.2">
                  <span>Client Vault</span>
                  <span>/</span>
                  <span className="text-slate-700 font-semibold truncate">
                    {isClient ? currentUser.company : isAdmin && adminSelectedClientId !== 'ALL' ? clientsList.find((c) => c.id === adminSelectedClientId)?.company : 'Enterprise Workspace'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Profile Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Quick Switch Persona Dropdown (One-Click RBAC Testing) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsPersonaPickerOpen(!isPersonaPickerOpen)}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                title="Switch active role/persona simulation"
              >
                <Sparkles size={13} className="text-[#F28C18]" />
                <span className="hidden md:inline">Role:</span>
                <span className="font-bold text-[#062A5A] truncate max-w-[85px] sm:max-w-[120px]">{currentUser.role}</span>
                <ChevronDown size={13} className={`transition-transform duration-200 ${isPersonaPickerOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPersonaPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsPersonaPickerOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-40 animate-vault-fade text-left space-y-1">
                    <div className="px-2.5 py-1.5 text-[10.5px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-100 mb-1">
                      <span>Simulate Vault Persona</span>
                      <span className="font-mono text-[#0969C7] text-[9.5px]">RBAC SCOPING</span>
                    </div>
                    {quickPersonas.map((p) => {
                      const isCurrent = currentUser.id === p.user.id;
                      return (
                        <button
                          key={p.user.id}
                          type="button"
                          onClick={() => {
                            switchActiveUser(p.user);
                            setIsPersonaPickerOpen(false);
                            showToast(`Switched active scope to ${p.user.fullName} (${p.user.company}).`);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-[#062A5A] text-white font-bold shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-bold truncate flex items-center gap-1.5">
                              <span>{p.user.fullName}</span>
                              {isCurrent && <Check size={12} className="text-[#159447] shrink-0" />}
                            </div>
                            <div className={`text-[10.5px] truncate ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                              {p.user.company}
                            </div>
                          </div>
                          <span className={`text-[9.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${
                            isCurrent ? 'bg-white/20 text-white border-white/30' : p.badgeColor
                          }`}>
                            {p.roleBadge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Run Security Invariant Audit */}
            <button
              type="button"
              onClick={() => setIsAuditModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Execute Automated Cryptographic Invariant Scan"
            >
              <ShieldCheck size={14} className="text-[#0969C7]" />
              <span>Verify Invariants</span>
            </button>

            {/* Upload Button */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus size={14} className="text-[#F28C18]" />
              <span className="hidden sm:inline">Upload Document</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Current User Identity Capsule */}
            <div
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-[#F7F9FC] border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer select-none"
              title="Click to view profile & security settings"
            >
              <div className="text-right hidden md:block">
                <div className="text-xs font-bold text-[#062A5A] truncate max-w-[120px]">
                  {currentUser.fullName}
                </div>
                <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                  {currentUser.role}
                </div>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#062A5A] text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
            </div>

            {/* Logout / Switch Role */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out of Client Vault"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>

          </div>

        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY NAVIGATION */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-vault-fade"
            onClick={() => setIsMobileNavOpen(false)}
          />
          <aside className="relative w-72 max-w-[85vw] bg-white h-full p-4 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl animate-vault-slide">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#062A5A] text-[#F28C18] flex items-center justify-center">
                    <Lock size={15} />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#062A5A]">PANJIYAR KRISHNA &amp; CO.</div>
                    <div className="text-[10px] text-slate-400 font-mono">Client Vault</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Active Identity Pill */}
              <div className="p-3 rounded-2xl bg-[#EEF5FC]/60 border border-[#0969C7]/20 text-xs">
                <div className="text-[10px] uppercase font-bold text-[#0969C7] tracking-wider flex items-center justify-between">
                  <span>Active Scope</span>
                  <span className="px-1.5 py-0.2 rounded bg-white font-mono text-[9.5px] border border-blue-200">
                    {currentUser.accountType.toUpperCase()}
                  </span>
                </div>
                <div className="font-bold text-[#062A5A] text-xs mt-1 truncate">
                  {currentUser.company}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <UserCheck size={12} className="text-emerald-600 shrink-0" />
                  <span className="truncate">{currentUser.fullName}</span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1 text-xs font-semibold">
                {[
                  { id: 'overview', label: 'Executive Dashboard', icon: <LayoutDashboard size={15} /> },
                  { id: 'files', label: 'Folders & File Explorer', icon: <Folder size={15} />, badge: scopedFiles.length },
                  { id: 'projects', label: 'Assigned Mandates', icon: <Briefcase size={15} />, badge: scopedProjects.length },
                  ...(!isClient
                    ? [
                        { id: 'credentials', label: 'Credential Management', icon: <Key size={15} />, badge: 'Admin Only' },
                        { id: 'clients', label: 'Clients Directory', icon: <Building size={15} />, badge: clientsList.length },
                        { id: 'staff', label: 'Staff Management', icon: <Users size={15} /> },
                        { id: 'permissions', label: 'Roles & Permissions', icon: <Shield size={15} /> }
                      ]
                    : []),
                  { id: 'messages', label: 'Encrypted Messages', icon: <MessageSquare size={15} />, badge: 'Live' },
                  { id: 'audit', label: 'Immutable Audit Trail', icon: <Activity size={15} /> },
                  { id: 'settings', label: 'Security & Key Rotation', icon: <Settings size={15} /> }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as VaultMainTab);
                        setIsMobileNavOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#062A5A] text-white shadow-2xs font-bold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-[#F28C18]' : 'text-slate-400'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs space-y-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsAuditModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck size={14} className="text-[#0969C7]" />
                <span>Verify Invariants</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileNavOpen(false);
                  handleLogout();
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-50 text-rose-700 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* WORKSPACE LAYOUT: SIDEBAR + CONTENT VIEWPORT */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-6 flex-1 w-full flex flex-col lg:flex-row gap-5 items-start">
        
        {/* DESKTOP SIDEBAR NAVIGATION (Persistent) */}
        <aside className="hidden lg:block w-64 bg-white rounded-3xl border border-slate-200 p-4 shrink-0 shadow-xs space-y-4">
          {/* Identity Scoping Info */}
          <div className="p-3 rounded-2xl bg-[#EEF5FC]/60 border border-[#0969C7]/20 text-xs">
            <div className="text-[10px] uppercase font-bold text-[#0969C7] tracking-wider flex items-center justify-between">
              <span>Active Scope</span>
              <span className="px-1.5 py-0.2 rounded bg-white font-mono text-[9.5px] border border-blue-200">
                {currentUser.accountType.toUpperCase()}
              </span>
            </div>
            <div className="font-bold text-[#062A5A] text-xs mt-1 truncate">
              {currentUser.company}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <UserCheck size={12} className="text-emerald-600 shrink-0" />
              <span className="truncate">{currentUser.fullName}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {[
              { id: 'overview', label: 'Executive Dashboard', icon: <LayoutDashboard size={15} /> },
              { id: 'files', label: 'Folders & File Explorer', icon: <Folder size={15} />, badge: scopedFiles.length },
              { id: 'projects', label: 'Assigned Mandates', icon: <Briefcase size={15} />, badge: scopedProjects.length },
              // Admin & Staff Tabs
              ...(!isClient
                ? [
                    { id: 'credentials', label: 'Credential Management', icon: <Key size={15} />, badge: 'Admin Only' },
                    { id: 'clients', label: 'Clients Directory', icon: <Building size={15} />, badge: clientsList.length },
                    { id: 'staff', label: 'Staff Management', icon: <Users size={15} /> },
                    { id: 'permissions', label: 'Roles & Permissions', icon: <Shield size={15} /> }
                  ]
                : []),
              { id: 'messages', label: 'Encrypted Messages', icon: <MessageSquare size={15} />, badge: 'Live' },
              { id: 'audit', label: 'Immutable Audit Trail', icon: <Activity size={15} /> },
              { id: 'settings', label: 'Security & Key Rotation', icon: <Settings size={15} /> }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id as VaultMainTab);
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#062A5A] text-white shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[#F28C18]' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Storage Quota Gauge */}
          <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700">Encrypted Storage</span>
              <span className="font-mono text-slate-500 font-semibold">14.2 / 50 GB</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#159447] rounded-full" style={{ width: '28%' }} />
            </div>
            <div className="text-[10.5px] text-slate-400 flex items-center gap-1">
              <Lock size={10} className="text-emerald-600" />
              <span>Multi-Region KMS Replicated</span>
            </div>
          </div>
        </aside>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 w-full min-w-0 space-y-6">

          {/* Multi-Tenant Switcher (Visible to Super Admin) */}
          {isAdmin && (
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#062A5A] text-[#F28C18]">
                  <SlidersHorizontal size={14} />
                </span>
                <div>
                  <span className="font-bold text-[#062A5A]">Super Admin Multi-Tenant Filter:</span>
                  <span className="text-slate-500 ml-1">
                    Isolate view to a specific client vault or inspect aggregate practice filings.
                  </span>
                </div>
              </div>

              <select
                value={adminSelectedClientId}
                onChange={(e) => setAdminSelectedClientId(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-semibold text-xs text-[#062A5A] bg-slate-50 outline-hidden focus:border-[#0969C7]"
              >
                <option value="ALL">All Client Vaults (Aggregate Firm View)</option>
                {clientsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company} ({c.fullName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE DASHBOARD / OVERVIEW */}
          {/* ========================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-vault-fade">
              
              {/* Futuristic Security Status Banner */}
              <div className="bg-gradient-to-r from-[#062A5A] via-[#0B1E38] to-[#062A5A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-white/10">
                <div className="absolute top-0 right-0 w-72 h-72 bg-[#0969C7]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-32 w-48 h-48 bg-[#159447]/15 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-xl space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold border border-white/15">
                      <Lock size={12} className="text-[#F28C18]" />
                      <span>Zero-Knowledge Secure Enclave Online</span>
                    </div>

                    <h2 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                      Welcome, {currentUser.fullName}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {isClient
                        ? `Secure repository active for ${currentUser.company}. All statutory records and tax returns are protected with AES-256 envelope encryption.`
                        : `Executive practice governance active. Monitoring ${clientsList.length} corporate clients and ${scopedFiles.length} certified audit working papers.`}
                    </p>
                  </div>

                  {/* Security Score Badge */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 text-center sm:text-right space-y-1">
                    <div className="text-[10px] font-mono uppercase text-slate-300 font-bold">
                      Security &amp; Invariant Health
                    </div>
                    <div className="font-manrope font-extrabold text-2xl text-emerald-400 flex items-center justify-center sm:justify-end gap-1.5">
                      <CheckCircle2 size={20} className="text-emerald-400" />
                      <span>100% Invariants OK</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      0 Data Drift &middot; TLS 1.3 Strict Verified
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Key Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                <div
                  onClick={() => setActiveTab('files')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="p-2 rounded-xl bg-blue-50 text-[#0969C7] group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Total</span>
                  </div>
                  <div className="font-manrope font-extrabold text-2xl text-[#062A5A]">
                    {scopedFiles.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Encrypted Documents
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab('projects')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="p-2 rounded-xl bg-amber-50 text-[#F28C18] group-hover:scale-110 transition-transform">
                      <Briefcase size={18} />
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Active</span>
                  </div>
                  <div className="font-manrope font-extrabold text-2xl text-[#062A5A]">
                    {scopedProjects.length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Assigned Mandates
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('files');
                    setStatusFilter('Verified');
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={18} />
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600">Sealed</span>
                  </div>
                  <div className="font-manrope font-extrabold text-2xl text-emerald-700">
                    {scopedFiles.filter((f) => (f.verificationStatus || 'Verified') === 'Verified').length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Verified &amp; Certified
                  </div>
                </div>

                <div
                  onClick={() => {
                    setActiveTab('files');
                    setStatusFilter('Under Review');
                  }}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
                      <Clock size={18} />
                    </span>
                    <span className="text-[11px] font-mono text-purple-600">Pending</span>
                  </div>
                  <div className="font-manrope font-extrabold text-2xl text-purple-700">
                    {scopedFiles.filter((f) => f.verificationStatus === 'Under Review' || f.verificationStatus === 'Action Required').length}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    Under CA Review
                  </div>
                </div>
              </div>

              {/* Admin Credential Management Governance Banner */}
              {!isClient && (
                <div className="bg-gradient-to-r from-[#062A5A] via-[#0A3D78] to-[#062A5A] rounded-3xl p-5 sm:p-6 text-white border border-white/10 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#F28C18] shrink-0">
                      <Key size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-manrope font-bold text-base text-white">
                          Admin-Only Credential Management
                        </h3>
                        <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-[#F28C18]/20 text-[#F28C18] border border-[#F28C18]/40">
                          RBAC Secured
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                        Manage client &amp; staff login IDs, PBKDF2 hashed passphrases, force password changes on next login, revoke device sessions, and maintain zero plaintext exposure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setActiveTab('credentials')}
                      className="px-4 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d97c14] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                    >
                      <Key size={15} />
                      <span>Manage Credentials &rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCreateAccountType('client');
                        setIsCreateAccountOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors cursor-pointer"
                    >
                      <span>+ Provision Account</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Folders Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                      Encrypted Vault Folders
                    </h3>
                    <p className="text-xs text-slate-500">
                      Categorized repositories segregated by statutory filing type and audit stage.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFolder('ALL');
                      setActiveTab('files');
                    }}
                    className="text-xs font-semibold text-[#0969C7] hover:underline flex items-center gap-1"
                  >
                    <span>View all files</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VAULT_FOLDERS_CONFIG.slice(0, 3).map((folder) => (
                    <VaultFolderCard
                      key={folder.id}
                      folder={folder}
                      fileCount={folderCounts[folder.id] || 0}
                      isActive={false}
                      onSelect={(fId) => {
                        setSelectedFolder(fId);
                        setActiveTab('files');
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Recent Files Table */}
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs space-y-3 p-5 sm:p-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                      Recent Vault Activity &amp; Submissions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Latest encrypted filings submitted with cryptographic timestamps.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('files')}
                    className="text-xs font-semibold text-[#0969C7] hover:underline"
                  >
                    Explorer View &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10.5px]">
                        <th className="py-2.5 px-3 text-left">Document Title</th>
                        <th className="py-2.5 px-3 text-left">Client &amp; Folder</th>
                        <th className="py-2.5 px-3 text-left">SHA-256 Digest</th>
                        <th className="py-2.5 px-3 text-left">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scopedFiles.slice(0, 5).map((file) => (
                        <VaultFileCard
                          key={file.id}
                          file={file}
                          viewMode="table"
                          currentUser={currentUser}
                          onPreview={(f) => setPreviewFile(f)}
                          onDownload={handleDownload}
                          onToggleStatus={handleToggleStatus}
                          onDelete={handleDeleteFile}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: FOLDERS & FILE EXPLORER */}
          {/* ========================================================================= */}
          {activeTab === 'files' && (
            <div className="space-y-6 animate-vault-fade">
              
              {/* Explorer Header & Controls */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-manrope font-bold text-xl text-[#062A5A]">
                      Cryptographic File Explorer
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Navigate folder trees, inspect SHA-256 integrity, verify audit working papers, and download encrypted assets.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                    >
                      <Plus size={14} className="text-[#F28C18]" />
                      <span>Upload to Vault</span>
                    </button>
                  </div>
                </div>

                {/* Search & Filters Bar */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                  <div className="relative flex-1 max-w-md">
                    <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by title, filename, client, or hash..."
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#0969C7] outline-hidden min-h-[40px] bg-slate-50/50"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 font-semibold outline-hidden focus:border-[#0969C7] min-h-[40px]"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Verified">Verified Only</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Action Required">Action Required</option>
                    </select>

                    {/* View Switcher: Grid vs Table */}
                    <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-white text-[#062A5A] shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Grid View"
                        aria-label="Grid view"
                      >
                        <Grid3X3 size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded-lg text-xs transition-colors ${
                          viewMode === 'table'
                            ? 'bg-white text-[#062A5A] shadow-2xs font-bold'
                            : 'text-slate-500 hover:text-slate-900'
                        }`}
                        title="Table View"
                        aria-label="Table view"
                      >
                        <Table size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Folder Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedFolder('ALL')}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors min-h-[34px] ${
                      selectedFolder === 'ALL'
                        ? 'bg-[#062A5A] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Folders ({scopedFiles.length})
                  </button>

                  {VAULT_FOLDERS_CONFIG.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFolder(f.id)}
                      className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 min-h-[34px] ${
                        selectedFolder === f.id
                          ? 'bg-[#062A5A] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{f.title}</span>
                      <span className="text-[10px] font-mono font-bold opacity-80">
                        ({folderCounts[f.id] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Folders Cards Row (when on 'ALL' folders) */}
              {selectedFolder === 'ALL' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VAULT_FOLDERS_CONFIG.map((folder) => (
                    <VaultFolderCard
                      key={folder.id}
                      folder={folder}
                      fileCount={folderCounts[folder.id] || 0}
                      isActive={false}
                      onSelect={(fId) => setSelectedFolder(fId)}
                    />
                  ))}
                </div>
              )}

              {/* Files Display: Grid vs Table */}
              {displayedFiles.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3 shadow-2xs">
                  <Folder size={40} className="mx-auto text-slate-300" />
                  <h4 className="font-manrope font-bold text-base text-[#062A5A]">
                    No files found in this vault folder
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search criteria or upload the first confidential document to this folder.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062A5A] text-white text-xs font-bold shadow-2xs"
                  >
                    <Plus size={14} className="text-[#F28C18]" />
                    <span>Upload First Document</span>
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedFiles.map((file) => (
                    <VaultFileCard
                      key={file.id}
                      file={file}
                      viewMode="grid"
                      currentUser={currentUser}
                      onPreview={(f) => setPreviewFile(f)}
                      onDownload={handleDownload}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDeleteFile}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-[#F7F9FC] border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10.5px]">
                        <tr>
                          <th className="py-3 px-4 text-left">Document Title</th>
                          <th className="py-3 px-4 text-left">Client &amp; Mandate</th>
                          <th className="py-3 px-4 text-left">Folder</th>
                          <th className="py-3 px-4 text-left">SHA-256 Digest</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayedFiles.map((file) => (
                          <VaultFileCard
                            key={file.id}
                            file={file}
                            viewMode="table"
                            currentUser={currentUser}
                            onPreview={(f) => setPreviewFile(f)}
                            onDownload={handleDownload}
                            onToggleStatus={handleToggleStatus}
                            onDelete={handleDeleteFile}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: ASSIGNED MANDATES & PROJECTS */}
          {/* ========================================================================= */}
          {activeTab === 'projects' && (
            <div className="space-y-6 animate-vault-fade">
              <VaultProjectsManager onSuccessToast={showToast} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CREDENTIAL MANAGEMENT (Admin Only - Advanced Security Suite) */}
          {/* ========================================================================= */}
          {activeTab === 'credentials' && !isClient && (
            <div className="space-y-6 animate-vault-fade">
              <VaultCredentialManager
                filterMode="all"
                onOpenCreate={(t) => {
                  setCreateAccountType(t);
                  setIsCreateAccountOpen(true);
                }}
                onOpenPermissions={(targetUser) => {
                  setSelectedProfileUser(targetUser);
                  setIsProfileModalOpen(true);
                }}
                onSuccessToast={showToast}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CLIENTS DIRECTORY & CREDENTIALS (Admin & Staff) */}
          {/* ========================================================================= */}
          {activeTab === 'clients' && !isClient && (
            <div className="space-y-6 animate-vault-fade">
              {/* Mode Switcher */}
              <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0969C7] flex items-center justify-center font-bold">
                    <Building size={18} />
                  </div>
                  <div>
                    <h3 className="font-manrope font-bold text-sm text-[#062A5A]">
                      Client Accounts &amp; Access Controls
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage client corporate directory, security settings, or admin-only credentials.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setClientViewMode('credentials')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      clientViewMode === 'credentials'
                        ? 'bg-[#062A5A] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Key size={13} className={clientViewMode === 'credentials' ? 'text-[#F28C18]' : ''} />
                    <span>Credential Management</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setClientViewMode('roster')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      clientViewMode === 'roster'
                        ? 'bg-[#062A5A] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building size={13} />
                    <span>Directory Roster</span>
                  </button>
                </div>
              </div>

              {clientViewMode === 'credentials' ? (
                <VaultCredentialManager
                  filterMode="clients"
                  onOpenCreate={(t) => {
                    setCreateAccountType(t);
                    setIsCreateAccountOpen(true);
                  }}
                  onOpenPermissions={(targetUser) => {
                    setSelectedProfileUser(targetUser);
                    setIsProfileModalOpen(true);
                  }}
                  onSuccessToast={showToast}
                />
              ) : (
                <VaultUsersList
                  filterMode="clients"
                  onOpenCreate={(t) => {
                    setCreateAccountType(t);
                    setIsCreateAccountOpen(true);
                  }}
                  onSelectUser={(u) => {
                    setSelectedProfileUser(u);
                    setIsProfileModalOpen(true);
                  }}
                  onOpenPermissions={(u) => {
                    setSelectedProfileUser(u);
                    setIsProfileModalOpen(true);
                  }}
                  onSuccessToast={showToast}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: STAFF MANAGEMENT & CREDENTIALS (Admin Only) */}
          {/* ========================================================================= */}
          {activeTab === 'staff' && !isClient && (
            <div className="space-y-6 animate-vault-fade">
              {/* Mode Switcher */}
              <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Users size={18} />
                  </div>
                  <div>
                    <h3 className="font-manrope font-bold text-sm text-[#062A5A]">
                      Staff Auditors &amp; Practice Associates
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage internal audit teams or configure administrative login credentials.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setStaffViewMode('credentials')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      staffViewMode === 'credentials'
                        ? 'bg-[#062A5A] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Key size={13} className={staffViewMode === 'credentials' ? 'text-[#F28C18]' : ''} />
                    <span>Staff Credentials</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffViewMode('roster')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      staffViewMode === 'roster'
                        ? 'bg-[#062A5A] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users size={13} />
                    <span>Staff Roster</span>
                  </button>
                </div>
              </div>

              {staffViewMode === 'credentials' ? (
                <VaultCredentialManager
                  filterMode="staff"
                  onOpenCreate={(t) => {
                    setCreateAccountType(t);
                    setIsCreateAccountOpen(true);
                  }}
                  onOpenPermissions={(targetUser) => {
                    setSelectedProfileUser(targetUser);
                    setIsProfileModalOpen(true);
                  }}
                  onSuccessToast={showToast}
                />
              ) : (
                <VaultUsersList
                  filterMode="staff"
                  onOpenCreate={(t) => {
                    setCreateAccountType(t);
                    setIsCreateAccountOpen(true);
                  }}
                  onSelectUser={(u) => {
                    setSelectedProfileUser(u);
                    setIsProfileModalOpen(true);
                  }}
                  onOpenPermissions={(u) => {
                    setSelectedProfileUser(u);
                    setIsProfileModalOpen(true);
                  }}
                  onSuccessToast={showToast}
                />
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: ROLES & PERMISSIONS MATRIX */}
          {/* ========================================================================= */}
          {activeTab === 'permissions' && !isClient && (
            <div className="space-y-6 animate-vault-fade">
              <PermissionsManager
                user={currentUser}
                onClose={() => {}}
                onSuccessToast={showToast}
                inlineMode={true}
              />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: ENCRYPTED MESSAGES */}
          {/* ========================================================================= */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4 animate-vault-fade">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                    End-to-End Encrypted Consultation Channel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Confidential communications between assigned practice partners and {currentUser.company}.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AES-256 E2EE ACTIVE
                </span>
              </div>

              {/* Message thread simulation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs max-w-lg space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-bold text-[#062A5A]">CA Krishna Panjiyar (Managing Partner)</span>
                    <span className="text-slate-400 font-mono">Today, 09:30 AM</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    Hello Rajesh, the Form 3CD Tax Audit schedule and draft computation have been uploaded to your private vault under "Audit Working Papers". Please review the depreciation working and certify.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#062A5A] text-white shadow-2xs max-w-lg ml-auto space-y-1">
                  <div className="flex items-center justify-between text-[10.5px]">
                    <span className="font-bold text-[#F28C18]">{currentUser.fullName} ({currentUser.company})</span>
                    <span className="text-slate-300 font-mono">Today, 10:14 AM</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    Thank you CA Krishna. We examined the draft statement. The board approved the additions to plant and machinery. We have uploaded the vendor invoices to the "Invoices" folder.
                  </p>
                </div>
              </div>

              {/* Reply Box */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Type encrypted message to assigned Chartered Accountant..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#0969C7] outline-hidden min-h-[44px]"
                />
                <button
                  type="button"
                  onClick={() => showToast('Encrypted message dispatched to practice desk.')}
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-1.5 min-h-[44px] transition-colors"
                >
                  <Send size={14} className="text-[#F28C18]" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: IMMUTABLE AUDIT TRAIL */}
          {/* ========================================================================= */}
          {activeTab === 'audit' && (
            <div className="space-y-6 animate-vault-fade">
              <VaultAuditLogView onSuccessToast={showToast} />
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 9: SECURITY & SETTINGS */}
          {/* ========================================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-vault-fade">
              <VaultSecuritySettings onSuccessToast={showToast} />
            </div>
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. File Preview Modal */}
      <VaultFilePreviewModal
        file={previewFile}
        currentUser={currentUser}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownload}
        onSuccessToast={showToast}
      />

      {/* 2. Upload Document Modal */}
      <VaultUploadModal
        isOpen={isUploadModalOpen}
        currentUser={currentUser}
        defaultFolder={selectedFolder === 'ALL' ? 'Documents' : selectedFolder}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccessToast={showToast}
      />

      {/* 3. Automated Invariant Security Audit Modal */}
      <VaultSecurityAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSuccessToast={showToast}
      />

      {/* 4. User Profile & Password Rotation Modal */}
      <VaultUserProfileModal
        user={selectedProfileUser || currentUser}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedProfileUser(null);
        }}
        onSuccessToast={showToast}
      />

      {/* 5. Create Account Modal (Admin/Staff only) */}
      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        defaultAccountType={createAccountType}
        onClose={() => setIsCreateAccountOpen(false)}
        onSuccessToast={showToast}
      />

    </div>
  );
};
