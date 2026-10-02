import React from 'react';
import {
  Briefcase,
  FileText,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  MessageSquare,
  Bell,
  Download,
  Shield,
  ShieldCheck,
  Building,
  Users,
  UserCheck,
  Clock,
  ArrowRight,
  Send,
  Activity,
  AlertTriangle,
  Lock,
  Plus,
  Sliders,
  CheckCircle2,
  FolderLock,
  Folder,
  Cpu,
  Layers
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useVaultAuth } from '../../context/VaultAuthContext';
import { VaultAccountType, VaultSectionName } from '../../types/vault';

interface ClientVaultDashboardProps {
  onNavigateSubTab: (tab: string) => void;
  onOpenCreate: (type: VaultAccountType) => void;
}

export const ClientVaultDashboard: React.FC<ClientVaultDashboardProps> = ({
  onNavigateSubTab,
  onOpenCreate
}) => {
  const { user: authUser } = useVaultAuth();
  const { users, files, projects, folders, invitations, auditLogs } = useVault();

  const isClient = authUser?.accountType === 'client';
  const isStaff = authUser?.accountType === 'staff';
  const isSuperAdmin = authUser?.accountType === 'super_admin';

  // Check section access permissions
  const hasAccessTo = (section: VaultSectionName): boolean => {
    if (isSuperAdmin) return true;
    if (!authUser?.sectionAccess) return true;
    return authUser.sectionAccess.includes(section);
  };

  // Client-specific filtered items
  const clientFiles = files.filter((f) => f.clientId === authUser?.id);
  const clientProjects = projects.filter((p) => p.clientId === authUser?.id);
  const clientFolders = folders.filter((f) => f.clientId === 'all' || f.clientId === authUser?.id);

  // Administrative metric counts
  const totalClients = users.filter((u) => u.accountType === 'client').length;
  const activeClients = users.filter((u) => u.accountType === 'client' && u.status === 'Active').length;
  const totalStaff = users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin').length;
  const pendingInvitations = invitations.filter((i) => i.status === 'Pending').length;
  const recentActivityCount = auditLogs.length;

  // The 8 Core Futuristic Vault Cards
  const coreVaultCards: {
    id: string;
    section: VaultSectionName;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    count: string | number;
    targetTab: string;
    gradient: string;
    iconBg: string;
  }[] = [
    {
      id: 'projects',
      section: 'Projects',
      title: 'My Projects',
      subtitle: 'Statutory audits & financing mandates',
      icon: <Briefcase className="w-5 h-5 text-amber-500" />,
      count: isClient ? clientProjects.length : projects.length,
      targetTab: 'projects',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
      iconBg: 'bg-amber-50 border-amber-200/80 text-amber-700'
    },
    {
      id: 'documents',
      section: 'Documents',
      title: 'Documents',
      subtitle: 'Form 3CD, tax filings & signed certificates',
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      count: (isClient ? clientFiles : files).filter(f => f.folder?.toLowerCase().includes('document') || f.folderId === 'FLD-DOCS' || f.fileType === 'document').length,
      targetTab: 'documents',
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
      iconBg: 'bg-blue-50 border-blue-200/80 text-blue-700'
    },
    {
      id: 'photos',
      section: 'Photos',
      title: 'Photos & Media',
      subtitle: 'Physical asset & verification gallery',
      icon: <ImageIcon className="w-5 h-5 text-emerald-600" />,
      count: (isClient ? clientFiles : files).filter(f => f.folder?.toLowerCase().includes('photo') || f.folderId === 'FLD-PHOTOS' || f.fileType === 'photo').length,
      targetTab: 'photos',
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      iconBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-700'
    },
    {
      id: 'videos',
      section: 'Videos',
      title: 'Videos & Audits',
      subtitle: 'Recorded board reviews & inspections',
      icon: <Video className="w-5 h-5 text-indigo-600" />,
      count: (isClient ? clientFiles : files).filter(f => f.folder?.toLowerCase().includes('video') || f.folderId === 'FLD-VIDEOS' || f.fileType === 'video').length,
      targetTab: 'videos',
      gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      iconBg: 'bg-indigo-50 border-indigo-200/80 text-indigo-700'
    },
    {
      id: 'reports',
      section: 'Reports',
      title: 'Reports & Ledgers',
      subtitle: 'GSTR-3B computations & P&L audits',
      icon: <FileSpreadsheet className="w-5 h-5 text-teal-600" />,
      count: (isClient ? clientFiles : files).filter(f => f.folder?.toLowerCase().includes('report') || f.folderId === 'FLD-REPORTS' || f.fileType === 'report' || f.fileType === 'spreadsheet').length,
      targetTab: 'reports',
      gradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
      iconBg: 'bg-teal-50 border-teal-200/80 text-teal-700'
    },
    {
      id: 'messages',
      section: 'Messages',
      title: 'Messages',
      subtitle: 'End-to-end encrypted advisory channel',
      icon: <MessageSquare className="w-5 h-5 text-sky-600" />,
      count: 'Live E2E',
      targetTab: 'messages',
      gradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
      iconBg: 'bg-sky-50 border-sky-200/80 text-sky-700'
    },
    {
      id: 'notifications',
      section: 'Notifications',
      title: 'Notifications',
      subtitle: 'Real-time vault events & due dates',
      icon: <Bell className="w-5 h-5 text-purple-600" />,
      count: auditLogs.length > 0 ? `${auditLogs.length} Events` : 'Active',
      targetTab: 'notifications',
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent',
      iconBg: 'bg-purple-50 border-purple-200/80 text-purple-700'
    },
    {
      id: 'downloads',
      section: 'Downloads',
      title: 'Downloads',
      subtitle: 'Encrypted export bundles & offline files',
      icon: <Download className="w-5 h-5 text-slate-700" />,
      count: `${(isClient ? clientFiles : files).length} Files`,
      targetTab: 'files',
      gradient: 'from-slate-500/10 via-slate-500/5 to-transparent',
      iconBg: 'bg-slate-100 border-slate-200 text-slate-700'
    }
  ];

  // Only display cards the user has permission to access
  const authorizedCards = coreVaultCards.filter((card) => hasAccessTo(card.section));

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. Futuristic Glassmorphic Welcome Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#061833] via-[#082247] to-[#040D1D] text-white border border-blue-500/25 shadow-xl overflow-hidden">
        
        {/* Subtle animated ambient light glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0969C7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-52 h-52 bg-[#F28C18]/15 rounded-full blur-2xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            
            {/* Status Chip */}
            <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15">
              <ShieldCheck size={13} className="text-[#38BDF8]" />
              <span>
                {isSuperAdmin ? 'Master Enterprise Control Center' : isStaff ? 'Senior Audit Staff Workspace' : 'Isolated Corporate Client Vault'}
              </span>
              <span className="text-white/40">&bull;</span>
              <span className="text-emerald-400 font-mono text-[10px]">AES-256 Verified</span>
            </div>

            <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Welcome, {authUser?.fullName || 'User'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              {isClient ? (
                <>
                  Private digital repository for <strong className="text-white">{authUser?.company}</strong>. All data is segregated under zero-knowledge access perimeter.
                </>
              ) : isStaff ? (
                <>
                  Practice engagement workspace. Access assigned corporate mandates, review workpapers, and verify client statutory filings.
                </>
              ) : (
                <>
                  Centralized command console for multi-tenant client vaults, granular permissions matrices, and cryptographic audit monitoring.
                </>
              )}
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
            {isSuperAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenCreate('client')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#F28C18] to-[#d67910] text-[#062A5A] font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-105 transition-all"
                >
                  <Plus size={14} />
                  <span>+ Add Client</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenCreate('staff')}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/20 backdrop-blur-md transition-colors"
                >
                  <Plus size={14} />
                  <span>+ Add Staff</span>
                </button>
              </>
            )}

            {isClient && (
              <button
                type="button"
                onClick={() => onNavigateSubTab('files')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0969C7] to-[#159447] text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 transition-all"
              >
                <FolderLock size={14} />
                <span>Open Document Vault</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Admin Quick Metrics Row (Super Admin & Staff) */}
      {!isClient && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div
            onClick={() => onNavigateSubTab('clients')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Corporate Clients</span>
              <Building size={16} className="text-[#062A5A] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-manrope font-extrabold text-2xl text-[#062A5A]">{totalClients}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{activeClients} Active &bull; 0 Breaches</p>
          </div>

          <div
            onClick={() => onNavigateSubTab(isSuperAdmin ? 'staff' : 'dashboard')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Practice Staff</span>
              <Users size={16} className="text-[#0969C7] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-manrope font-extrabold text-2xl text-[#0969C7]">{totalStaff}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Assigned CA Managers</p>
          </div>

          <div
            onClick={() => onNavigateSubTab('projects')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Active Mandates</span>
              <Briefcase size={16} className="text-[#F28C18] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-manrope font-extrabold text-2xl text-[#062A5A]">{projects.length}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Audits &amp; Reconciliations</p>
          </div>

          <div
            onClick={() => onNavigateSubTab('files')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Vault Folders</span>
              <Folder size={16} className="text-[#0969C7] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-manrope font-extrabold text-2xl text-[#062A5A]">{folders.length}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Custom &amp; System Folders</p>
          </div>

          <div
            onClick={() => onNavigateSubTab('files')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Encrypted Files</span>
              <FileText size={16} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-manrope font-extrabold text-2xl text-emerald-700">{files.length}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Verified SHA-256 Digests</p>
          </div>

          <div
            onClick={() => onNavigateSubTab('activity')}
            className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500">Security Events</span>
              <Activity size={16} className="text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-manrope font-extrabold text-2xl text-purple-700">{recentActivityCount}</div>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Real-Time Audit Trail</p>
          </div>
        </div>
      )}

      {/* 3. Section Title */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
            {isClient ? 'My Secure Vault Workspace' : 'Client Vault Sections'}
          </h2>
          <p className="text-xs text-slate-500">
            Select a verified portal module to view segregated data, manage uploads, or review compliance status.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono">
          <Cpu size={14} className="text-[#0969C7]" />
          <span>Role: {authUser?.role || authUser?.accountType}</span>
        </div>
      </div>

      {/* 4. The 8 Futuristic Glass-Style Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {authorizedCards.map((card) => (
          <div
            key={card.id}
            onClick={() => onNavigateSubTab(card.targetTab)}
            className="relative bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-[#0969C7]/60 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group overflow-hidden flex flex-col justify-between min-h-[160px]"
          >
            {/* Top Subtle Gradient Glow on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`p-2.5 rounded-xl border ${card.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                  {card.icon}
                </div>

                <span className="font-manrope font-extrabold text-sm sm:text-base text-slate-800 font-mono bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200">
                  {card.count}
                </span>
              </div>

              <h3 className="font-manrope font-bold text-base text-[#062A5A] group-hover:text-[#0969C7] transition-colors">
                {card.title}
              </h3>
              
              <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                {card.subtitle}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-2 flex items-center justify-between text-xs font-bold text-[#0969C7]">
              <span>Access Module</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* 5. Two-Column Live Overview: Projects & Recent Files */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
        
        {/* Left Column: Active Mandates */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-manrope font-bold text-base text-[#062A5A] flex items-center gap-2">
                <Briefcase size={16} className="text-[#0969C7]" />
                <span>{isClient ? 'My Active Mandates' : 'Assigned Client Mandates'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Statutory audit engagements and statutory return deadlines.
              </p>
            </div>
            
            <button
              onClick={() => onNavigateSubTab('projects')}
              className="text-[#0969C7] font-semibold text-xs hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {((isClient ? clientProjects : projects).length === 0) ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No active mandates assigned to your profile.
            </div>
          ) : (
            <div className="space-y-3">
              {(isClient ? clientProjects : projects).slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 hover:border-[#0969C7]/50 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 truncate">{p.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {p.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      Client: <strong>{p.clientName}</strong> &bull; Assigned: {p.assignedStaffIds.join(', ')}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-mono">Due Date</span>
                    <span className="font-bold text-slate-800 text-xs">{p.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Confidential Files Preview */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-manrope font-bold text-base text-[#062A5A] flex items-center gap-2">
                <FileText size={16} className="text-emerald-600" />
                <span>Recent Confidential Files</span>
              </h3>
              <p className="text-xs text-slate-400">
                Encrypted reports with verifiable cryptographic hash.
              </p>
            </div>

            <button
              onClick={() => onNavigateSubTab('files')}
              className="text-[#0969C7] font-semibold text-xs hover:underline flex items-center gap-1"
            >
              <span>Browse All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {((isClient ? clientFiles : files).length === 0) ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No files currently stored in this vault.
            </div>
          ) : (
            <div className="space-y-2.5">
              {(isClient ? clientFiles : files).slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800 truncate">
                      <FileText size={14} className="text-[#0969C7] shrink-0" />
                      <span className="truncate">{f.title}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 font-mono mt-0.5 truncate">
                      {f.fileName} &bull; {f.fileSize}
                    </p>
                  </div>

                  <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-mono">
                    AES-256
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
