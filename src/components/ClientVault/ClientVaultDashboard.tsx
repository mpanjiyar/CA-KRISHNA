import React from 'react';
import {
  Users,
  UserCheck,
  UserPlus,
  Shield,
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
  Key
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultAccountType } from '../../types/vault';

interface ClientVaultDashboardProps {
  onNavigateSubTab: (tab: string) => void;
  onOpenCreate: (type: VaultAccountType) => void;
}

export const ClientVaultDashboard: React.FC<ClientVaultDashboardProps> = ({
  onNavigateSubTab,
  onOpenCreate
}) => {
  const { users, files, projects, invitations, auditLogs } = useVault();

  const totalClients = users.filter((u) => u.accountType === 'client').length;
  const activeClients = users.filter((u) => u.accountType === 'client' && u.status === 'Active').length;
  const inactiveClients = users.filter((u) => u.accountType === 'client' && (u.status === 'Inactive' || u.status === 'Suspended')).length;
  const totalStaff = users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin').length;
  const totalActiveUsers = users.filter((u) => u.status === 'Active').length;
  const pendingInvitations = invitations.filter((i) => i.status === 'Pending').length;
  const expiredAccounts = users.filter((u) => u.status === 'Expired').length;
  const recentActivityCount = auditLogs.length;

  const recentLogs = auditLogs.slice(0, 5);

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
              Client Vault Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Secure administrative hub to provision isolated client vaults, manage staff delegation, govern permissions matrices, and audit document integrity.
            </p>
          </div>

          {/* Quick Primary Actions Stack */}
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
        </div>
      </div>

      {/* 8 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {[
          { label: 'Total Clients', value: totalClients, tab: 'clients', color: 'text-[#062A5A]', icon: <Building size={16} /> },
          { label: 'Active Clients', value: activeClients, tab: 'clients', color: 'text-emerald-700', icon: <CheckCircle2 size={16} /> },
          { label: 'Inactive Clients', value: inactiveClients, tab: 'clients', color: 'text-amber-700', icon: <AlertTriangle size={16} /> },
          { label: 'Total Staff', value: totalStaff, tab: 'staff', color: 'text-[#0969C7]', icon: <Users size={16} /> },
          { label: 'Active Users', value: totalActiveUsers, tab: 'clients', color: 'text-emerald-700', icon: <UserCheck size={16} /> },
          { label: 'Pending Invites', value: pendingInvitations, tab: 'invitations', color: 'text-[#F28C18]', icon: <Send size={16} /> },
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

      {/* Quick Actions Action Bar */}
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
            onClick={() => onOpenCreate('client')}
            className="px-3 py-1.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <UserPlus size={13} className="text-[#F28C18]" />
            <span>+ Create Account</span>
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
            <span>Activity Log</span>
          </button>
        </div>
      </div>

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
              <span>View All ({projects.length})</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {projects.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between gap-3 text-xs hover:bg-[#EEF5FC]/50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-bold text-[#062A5A] truncate">{p.title}</div>
                  <div className="text-[11px] text-[#0969C7] font-semibold truncate mt-0.5">
                    {p.clientName}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {p.category} &middot; Due {p.dueDate}
                  </div>
                </div>

                <span
                  className={`text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                    p.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : p.status === 'Active'
                      ? 'bg-[#EEF5FC] text-[#0969C7]'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Audit Feed (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-manrope font-bold text-base text-[#062A5A]">
                Live Activity Log
              </h3>
              <p className="text-xs text-slate-400">
                Real-time security events across all accounts.
              </p>
            </div>
            <button
              onClick={() => onNavigateSubTab('activity')}
              className="text-[#0969C7] font-semibold text-xs hover:underline flex items-center gap-1"
            >
              <span>Full Log</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#062A5A] truncate">{log.user}</span>
                  <span className="font-mono text-slate-400 text-[10px]">
                    {log.timestamp.split(' ')[1]}
                  </span>
                </div>
                <div className="text-slate-700 font-medium leading-snug">{log.action}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                  <span>{log.category}</span>
                  <span className="text-emerald-700 font-semibold">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
