import React from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
  ShieldCheck,
  FileText,
  Clock,
  Send,
  AlertTriangle,
  Activity,
  Plus,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
  Building,
  Key,
  Folder,
  Briefcase,
  Download
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useVaultAuth } from '../../context/VaultAuthContext';
import { VaultAccountType } from '../../types/vault';

interface ClientVaultDashboardProps {
  onNavigateSubTab: (tab: string) => void;
  onOpenCreate: (type: VaultAccountType) => void;
}

export const ClientVaultDashboard: React.FC<ClientVaultDashboardProps> = ({
  onNavigateSubTab,
  onOpenCreate
}) => {
  const { user: authUser } = useVaultAuth();
  const { users, files, projects, invitations, auditLogs } = useVault();

  const isClient = authUser?.accountType === 'client';
  const isStaff = authUser?.accountType === 'staff';
  const isSuperAdmin = authUser?.accountType === 'super_admin';

  // Client-specific filtered items
  const clientFiles = files.filter((f) => f.clientId === authUser?.id);
  const clientProjects = projects.filter((p) => p.clientId === authUser?.id);

  // Administrative metric counts
  const totalClients = users.filter((u) => u.accountType === 'client').length;
  const activeClients = users.filter((u) => u.accountType === 'client' && u.status === 'Active').length;
  const inactiveClients = users.filter((u) => u.accountType === 'client' && (u.status === 'Inactive' || u.status === 'Suspended')).length;
  const totalStaff = users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin').length;
  const totalActiveUsers = users.filter((u) => u.status === 'Active').length;
  const pendingInvitations = invitations.filter((i) => i.status === 'Pending').length;
  const expiredAccounts = users.filter((u) => u.status === 'Expired').length;
  const recentActivityCount = auditLogs.length;

  const recentLogs = auditLogs.slice(0, 5);

  // ========================================================
  // VIEW A: CLIENT PERSPECTIVE (Rajesh Singhal / Apex Precision)
  // ========================================================
  if (isClient) {
    return (
      <div className="space-y-6 text-left">
        {/* Welcome Client Banner */}
        <div className="bg-gradient-to-r from-[#062A5A] via-[#031C3D] to-[#062A5A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md border border-[#0969C7]/30">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0969C7]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-20 w-40 h-40 bg-[#F28C18]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold border border-white/15">
                <Shield size={12} className="text-[#F28C18]" />
                <span>Isolated Corporate Client Vault</span>
              </div>
              <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                Welcome, {authUser?.fullName}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                Direct statutory audit, GST filings, and confidential documentation workspace for{' '}
                <strong className="text-white">{authUser?.company}</strong>.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateSubTab('files')}
                className="px-4 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d67910] text-[#062A5A] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Folder size={14} />
                <span>My Vault Documents ({clientFiles.length})</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateSubTab('projects')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/20 transition-colors"
              >
                <Briefcase size={14} />
                <span>Active Mandates ({clientProjects.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Client Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigateSubTab('files')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <Folder size={18} className="text-[#0969C7]" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Vault Files</span>
            </div>
            <div className="font-manrope font-extrabold text-2xl sm:text-3xl text-[#062A5A]">
              {clientFiles.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Encrypted Documents &amp; Reports</p>
          </div>

          <div
            onClick={() => onNavigateSubTab('projects')}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <Briefcase size={18} className="text-[#F28C18]" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Mandates</span>
            </div>
            <div className="font-manrope font-extrabold text-2xl sm:text-3xl text-[#062A5A]">
              {clientProjects.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Assigned CA Audits &amp; Filings</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Compliance</span>
            </div>
            <div className="font-manrope font-extrabold text-2xl sm:text-3xl text-emerald-700">
              100%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Statutory Filings Up to Date</p>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <Lock size={18} className="text-[#062A5A]" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Security</span>
            </div>
            <div className="font-manrope font-bold text-lg sm:text-xl text-[#062A5A]">
              AES-256
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">GCM End-to-End Cryptography</p>
          </div>
        </div>

        {/* 2-Column: My Active Projects & Recent Files */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Active Mandates */}
          <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                  Active Statutory Engagements
                </h3>
                <p className="text-xs text-slate-400">
                  Audit and compliance deadlines managed by CA Krishna Panjiyar &amp; Co.
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

            {clientProjects.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active projects recorded for your account.
              </div>
            ) : (
              <div className="space-y-3">
                {clientProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-slate-200/90 hover:border-[#0969C7]/50 bg-slate-50/60 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#062A5A]">{p.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          {p.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{p.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block font-mono">Due Date</span>
                      <span className="text-xs font-bold text-slate-800">{p.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Confidential Files */}
          <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                  Recent Vault Files
                </h3>
                <p className="text-xs text-slate-400">
                  Confidential reports and verified tax filings.
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

            {clientFiles.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No files uploaded yet in your vault.
              </div>
            ) : (
              <div className="space-y-2.5">
                {clientFiles.slice(0, 5).map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 text-xs"
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

                    <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW B: ADMINISTRATIVE & STAFF PERSPECTIVE
  // ========================================================
  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#062A5A] via-[#031C3D] to-[#062A5A] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-md border border-[#0969C7]/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0969C7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-[#F28C18]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold border border-white/15">
              <Shield size={12} className="text-[#F28C18]" />
              <span>Multi-Tenant Vault Control Center</span>
            </div>
            <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              {isSuperAdmin ? 'Master Vault Dashboard' : 'Staff Auditor Workspace'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Secure administrative hub to provision isolated client vaults, manage staff delegation, govern permissions matrices, and audit document integrity.
            </p>
          </div>

          {/* Quick Primary Actions Stack */}
          {isSuperAdmin && (
            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenCreate('client')}
                className="px-4 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d67910] text-[#062A5A] font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} />
                <span>+ Add Client</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenCreate('staff')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/20 transition-colors"
              >
                <Plus size={14} />
                <span>+ Add Staff</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 8 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {[
          { label: 'Total Clients', value: totalClients, tab: 'clients', color: 'text-[#062A5A]', icon: <Building size={16} /> },
          { label: 'Active Clients', value: activeClients, tab: 'clients', color: 'text-emerald-700', icon: <CheckCircle2 size={16} /> },
          { label: 'Inactive Clients', value: inactiveClients, tab: 'clients', color: 'text-amber-700', icon: <AlertTriangle size={16} /> },
          { label: 'Total Staff', value: totalStaff, tab: isSuperAdmin ? 'staff' : 'dashboard', color: 'text-[#0969C7]', icon: <Users size={16} /> },
          { label: 'Active Users', value: totalActiveUsers, tab: 'clients', color: 'text-emerald-700', icon: <UserCheck size={16} /> },
          { label: 'Pending Invites', value: pendingInvitations, tab: isSuperAdmin ? 'invitations' : 'dashboard', color: 'text-[#F28C18]', icon: <Send size={16} /> },
          { label: 'Expired Accts', value: expiredAccounts, tab: 'clients', color: 'text-slate-500', icon: <Clock size={16} /> },
          { label: 'Audit Records', value: recentActivityCount, tab: 'activity', color: 'text-purple-700', icon: <Activity size={16} /> }
        ].map((stat, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateSubTab(stat.tab)}
            className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-[#0969C7] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="p-1 rounded bg-slate-50 group-hover:bg-[#EEF5FC] transition-colors">{stat.icon}</span>
            </div>
            <div>
              <div className={`font-manrope font-extrabold text-xl sm:text-2xl ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[10.5px] font-semibold text-slate-500 truncate mt-0.5">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Action Bar (Admin Only) */}
      {isSuperAdmin && (
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            Quick Administrative Actions:
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenCreate('client')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} className="text-[#0969C7]" />
              <span>+ Add Client</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenCreate('staff')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus size={13} className="text-[#0969C7]" />
              <span>+ Add Staff</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSubTab('permissions')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sliders size={13} className="text-[#F28C18]" />
              <span>Manage Permissions</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSubTab('invitations')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send size={13} className="text-emerald-600" />
              <span>Pending Invitations ({pendingInvitations})</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateSubTab('activity')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Activity size={13} className="text-purple-600" />
              <span>Security Logs</span>
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Overview: Active Mandates & Real-Time Security Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Active Client Projects (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                Isolated Client Projects &amp; Mandates
              </h3>
              <p className="text-xs text-slate-400">
                Current active engagements under direct CA assurance.
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

          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-2xl border border-slate-200/90 hover:border-[#0969C7]/50 bg-slate-50/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#062A5A]">{project.title}</span>
                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        project.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : project.status === 'Completed'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-2">
                    <span>{project.clientName}</span>
                    <span>&bull;</span>
                    <span className="text-slate-400">{project.category}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-mono">Statutory Due</span>
                  <span className="font-bold text-slate-800">{project.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Real-Time Audit Log Feed (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                Recent Security Audit Logs
              </h3>
              <p className="text-xs text-slate-400">
                Cryptographic authentication and permission events.
              </p>
            </div>
            <button
              onClick={() => onNavigateSubTab('activity')}
              className="text-[#0969C7] font-semibold text-xs hover:underline flex items-center gap-1"
            >
              <span>Audit Center</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#062A5A] truncate">{log.action}</span>
                  <span
                    className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-md ${
                      log.status === 'Success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'Warning'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-tight line-clamp-2">
                  {log.details}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                  <span>{log.user} ({log.userRole})</span>
                  <span>{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
