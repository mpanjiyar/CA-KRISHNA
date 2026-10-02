import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Shield,
  Briefcase,
  Folder,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Bell,
  Send,
  Activity,
  Lock,
  Settings,
  Menu,
  X,
  Plus,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Save,
  RotateCcw,
  LogOut,
  Smartphone,
  KeyRound,
  ShieldCheck,
  Clock,
  Laptop,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { useVaultAuth, ActiveSessionItem } from '../../context/VaultAuthContext';
import { VaultUser, VaultAccountType } from '../../types/vault';
import { ClientVaultDashboard } from './ClientVaultDashboard';
import { VaultUsersList } from './VaultUsersList';
import { PermissionsManager } from './PermissionsManager';
import { PrivateVaultViewer } from './PrivateVaultViewer';
import { StaffAccessManager } from './StaffAccessManager';
import { VaultProjectsManager } from './VaultProjectsManager';
import { VaultInvitationsView } from './VaultInvitationsView';
import { VaultAuditLogView } from './VaultAuditLogView';
import { VaultSecuritySettings } from './VaultSecuritySettings';
import { CreateAccountModal } from './CreateAccountModal';
import { UserProfileDrawer } from './UserProfileDrawer';

type VaultSubTab =
  | 'dashboard'
  | 'clients'
  | 'staff'
  | 'permissions'
  | 'projects'
  | 'files'
  | 'documents'
  | 'gallery'
  | 'messages'
  | 'notifications'
  | 'invitations'
  | 'activity'
  | 'security'
  | 'settings';

export const ClientVaultContainer: React.FC = () => {
  const { user: authUser, logout, sessionRemainingSeconds, changePassword, fetchSessions, revokeSession } = useVaultAuth();
  const { users, files, projects, invitations, auditLogs } = useVault();

  const isSuperAdmin = authUser?.accountType === 'super_admin';
  const isStaff = authUser?.accountType === 'staff';
  const isClient = authUser?.accountType === 'client';

  const [activeSubTab, setActiveSubTab] = useState<VaultSubTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createAccountType, setCreateAccountType] = useState<VaultAccountType>('client');
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<VaultUser | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<VaultUser | null>(null);
  const [inlinePermissionsUserId, setInlinePermissionsUserId] = useState<string>('');

  // Security modals for current user
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDevicesModalOpen, setIsDevicesModalOpen] = useState(false);
  const [sessionsList, setSessionsList] = useState<ActiveSessionItem[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  // Change Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState<string | null>(null);
  const [isSavingPass, setIsSavingPass] = useState(false);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  const handleOpenCreateModal = (type: VaultAccountType) => {
    setCreateAccountType(type);
    setIsCreateModalOpen(true);
  };

  // Open Active Devices Modal & fetch sessions
  const handleOpenDevices = async () => {
    setIsDevicesModalOpen(true);
    setIsLoadingSessions(true);
    const list = await fetchSessions();
    setSessionsList(list);
    setIsLoadingSessions(false);
  };

  const handleRevokeDevice = async (sessionId: string) => {
    const ok = await revokeSession(sessionId);
    if (ok) {
      setSessionsList((prev) => prev.filter((s) => s.id !== sessionId));
      showToast('Device session revoked successfully.');
    }
  };

  // Handle password submit
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass || !newPass) {
      setPassError('Please fill in all password fields.');
      return;
    }
    if (newPass.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsSavingPass(true);
    setPassError(null);

    const res = await changePassword(currentPass, newPass);
    setIsSavingPass(false);

    if (!res.success) {
      setPassError(res.error || 'Failed to update password.');
      return;
    }

    setIsChangePasswordOpen(false);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    showToast('✓ Password updated securely with salted PBKDF2 hash.');
  };

  // Build role-tailored navigation items
  const allNavItems: {
    id: VaultSubTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
    allowedRoles: ('super_admin' | 'staff' | 'client')[];
  }[] = [
    {
      id: 'dashboard',
      label: isClient ? 'My Overview' : 'Dashboard',
      icon: <LayoutDashboard size={15} />,
      allowedRoles: ['super_admin', 'staff', 'client']
    },
    {
      id: 'clients',
      label: isStaff ? 'Assigned Clients' : 'Clients',
      icon: <Building2 size={15} />,
      badge: users.filter((u) => u.accountType === 'client').length,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      allowedRoles: ['super_admin', 'staff']
    },
    {
      id: 'staff',
      label: 'Staff Management',
      icon: <UserCheck size={15} />,
      badge: users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin').length,
      badgeColor: 'bg-blue-100 text-blue-800',
      allowedRoles: ['super_admin']
    },
    {
      id: 'permissions',
      label: 'Roles & Permissions',
      icon: <Shield size={15} />,
      allowedRoles: ['super_admin']
    },
    {
      id: 'projects',
      label: isClient ? 'My Mandates' : 'Projects',
      icon: <Briefcase size={15} />,
      badge: projects.length,
      badgeColor: 'bg-amber-100 text-amber-800',
      allowedRoles: ['super_admin', 'staff', 'client']
    },
    {
      id: 'files',
      label: isClient ? 'My Vault Documents' : 'Files & Filings',
      icon: <Folder size={15} />,
      badge: files.length,
      allowedRoles: ['super_admin', 'staff', 'client']
    },
    {
      id: 'documents',
      label: 'Statutory Reports',
      icon: <FileText size={15} />,
      allowedRoles: ['super_admin', 'staff']
    },
    {
      id: 'gallery',
      label: 'Media Archive',
      icon: <ImageIcon size={15} />,
      allowedRoles: ['super_admin']
    },
    {
      id: 'messages',
      label: 'Encrypted Messages',
      icon: <MessageSquare size={15} />,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-white',
      allowedRoles: ['super_admin', 'staff']
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={15} />,
      allowedRoles: ['super_admin', 'staff']
    },
    {
      id: 'invitations',
      label: 'Access Invitations',
      icon: <Send size={15} />,
      badge: invitations.filter((i) => i.status === 'Pending').length,
      badgeColor: 'bg-amber-500 text-white',
      allowedRoles: ['super_admin']
    },
    {
      id: 'activity',
      label: 'Security & Audit Logs',
      icon: <Activity size={15} />,
      allowedRoles: ['super_admin', 'staff']
    },
    {
      id: 'security',
      label: isClient ? 'My Security & Sessions' : 'Vault Security Policy',
      icon: <Lock size={15} />,
      allowedRoles: ['super_admin', 'staff', 'client']
    },
    {
      id: 'settings',
      label: 'System Settings',
      icon: <Settings size={15} />,
      allowedRoles: ['super_admin']
    }
  ];

  const currentRole = authUser?.accountType || 'client';
  const visibleNavItems = allNavItems.filter((item) => item.allowedRoles.includes(currentRole as any));

  // Format remaining session time
  const formatSessionTime = (seconds: number) => {
    if (seconds <= 0) return 'Expired';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="w-full space-y-5 text-left">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#062A5A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#F28C18]/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={18} className="text-[#159447] shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Top Authenticated Session & Profile Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* User Identity Chip */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] text-white flex items-center justify-center font-bold text-base shadow-sm">
            {authUser?.fullName ? authUser.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-[#062A5A] text-sm sm:text-base">
                {authUser?.fullName}
              </span>

              {/* Role Badge */}
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                  isSuperAdmin
                    ? 'bg-[#062A5A] text-white border-[#F28C18]'
                    : isStaff
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                }`}
              >
                {isSuperAdmin ? 'Super Admin' : isStaff ? 'Staff Auditor' : 'Verified Client'}
              </span>

              {/* Active Encrypted Session Tag */}
              <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-emerald-700 bg-emerald-50/70 px-2 py-0.5 rounded-full border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                TLS Encrypted Session
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span>{authUser?.company}</span>
              <span>&bull;</span>
              <span className="font-mono text-[11px] text-slate-400">@{authUser?.username}</span>
            </p>
          </div>
        </div>

        {/* Right Security Actions: Timer, Password, Devices, Logout */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          
          {/* Auto-lock countdown indicator */}
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 shadow-2xs"
            title="Time remaining before automatic session termination"
          >
            <Clock size={13} className="text-amber-500" />
            <span className="text-[11px]">Auto-lock:</span>
            <span className="font-bold text-[#062A5A]">
              {formatSessionTime(sessionRemainingSeconds)}
            </span>
          </div>

          {/* Active Devices Button */}
          <button
            type="button"
            onClick={handleOpenDevices}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#0969C7] text-slate-700 hover:text-[#0969C7] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="View logged-in devices & sessions"
          >
            <Smartphone size={13} />
            <span className="hidden sm:inline">Devices</span>
          </button>

          {/* Change Password Button */}
          <button
            type="button"
            onClick={() => setIsChangePasswordOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-[#0969C7] text-slate-700 hover:text-[#0969C7] text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            title="Change password securely"
          >
            <KeyRound size={13} />
            <span className="hidden sm:inline">Password</span>
          </button>

          {/* Create Account Button (Super Admin Only) */}
          {isSuperAdmin && (
            <button
              type="button"
              onClick={() => handleOpenCreateModal('client')}
              className="px-3 py-1.5 rounded-xl bg-[#F28C18] hover:bg-[#d67910] text-[#062A5A] text-xs font-bold flex items-center gap-1 shadow-2xs transition-all"
            >
              <Plus size={13} />
              <span>+ Account</span>
            </button>
          )}

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Are you sure you want to end your secure Client Vault session?')) {
                await logout();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Sign out of Client Vault"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main CMS Layout: Sidebar + Content Area */}
      <div className="bg-[#F7F9FC] rounded-3xl border border-slate-200 p-2 sm:p-4 min-h-[700px] flex flex-col lg:flex-row gap-4 items-start">
        {/* Mobile Header / Hamburger Toggle */}
        <div className="lg:hidden w-full bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="flex items-center gap-2 text-xs font-bold text-[#062A5A]"
          >
            <Menu size={16} />
            <span className="capitalize">{activeSubTab.replace('-', ' ')}</span>
          </button>
          <span className="text-[11px] font-mono text-slate-400">Vault Menu</span>
        </div>

        {/* Sidebar (Desktop Persistent / Mobile Drawer) */}
        <aside
          className={`w-full lg:w-64 bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 shrink-0 shadow-xs space-y-1 ${
            isMobileSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="px-3 py-2 text-[10.5px] uppercase font-extrabold tracking-wider text-slate-400 font-manrope">
            {isClient ? 'My Client Vault' : isStaff ? 'Staff Workspace' : 'Master Control'}
          </div>

          <nav className="space-y-0.5">
            {visibleNavItems.map((item) => {
              const isActive = activeSubTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveSubTab(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#062A5A] text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-[#F28C18]' : 'text-slate-400'}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 w-full min-w-0">
          {/* SubTab 1: Dashboard */}
          {activeSubTab === 'dashboard' && (
            <ClientVaultDashboard
              onNavigateSubTab={(tab) => setActiveSubTab(tab as VaultSubTab)}
              onOpenCreate={handleOpenCreateModal}
            />
          )}

          {/* SubTab 2: Clients (Staff or Super Admin) */}
          {activeSubTab === 'clients' && (
            <VaultUsersList
              filterMode="clients"
              onOpenCreate={handleOpenCreateModal}
              onSelectUser={(u) => setSelectedUserForDrawer(u)}
              onOpenPermissions={(u) => setSelectedUserForPermissions(u)}
              onSuccessToast={showToast}
            />
          )}

          {/* SubTab 3: Staff (Super Admin) */}
          {activeSubTab === 'staff' && isSuperAdmin && (
            <div className="space-y-6">
              <StaffAccessManager onSuccessToast={showToast} />
              <div className="pt-4 border-t border-slate-200">
                <VaultUsersList
                  filterMode="staff"
                  onOpenCreate={handleOpenCreateModal}
                  onSelectUser={(u) => setSelectedUserForDrawer(u)}
                  onOpenPermissions={(u) => setSelectedUserForPermissions(u)}
                  onSuccessToast={showToast}
                />
              </div>
            </div>
          )}

          {/* SubTab 4: Roles & Permissions (Super Admin) */}
          {activeSubTab === 'permissions' && isSuperAdmin && (
            <div className="space-y-6">
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-bold text-[#062A5A] text-sm">Select Account to Manage Permissions</h3>
                  <p className="text-slate-500">Pick any client or staff account to customize their access matrix, section privileges, or role templates.</p>
                </div>
                <select
                  value={inlinePermissionsUserId || users[0]?.id}
                  onChange={(e) => setInlinePermissionsUserId(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs text-[#062A5A] bg-white shadow-2xs focus:ring-1 focus:ring-[#0969C7]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.company} &middot; {u.role})
                    </option>
                  ))}
                </select>
              </div>

              {users.length > 0 && (
                <PermissionsManager
                  user={users.find((u) => u.id === (inlinePermissionsUserId || users[0]?.id)) || users[0]}
                  onClose={() => {}}
                  onSuccessToast={showToast}
                  inlineMode={true}
                />
              )}
            </div>
          )}

          {/* SubTab 5: Projects / Mandates */}
          {activeSubTab === 'projects' && (
            <VaultProjectsManager onSuccessToast={showToast} />
          )}

          {/* SubTab 6 & 7: Files & Documents (Private Vault Explorer with isolated storage) */}
          {(activeSubTab === 'files' || activeSubTab === 'documents') && (
            <PrivateVaultViewer onSuccessToast={showToast} />
          )}

          {/* SubTab 8: Gallery (Photos & Videos) */}
          {activeSubTab === 'gallery' && (
            <div className="space-y-6">
              <PrivateVaultViewer onSuccessToast={showToast} />
            </div>
          )}

          {/* SubTab 9: Messages */}
          {activeSubTab === 'messages' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-left shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                    End-to-End Encrypted Client Messaging
                  </h3>
                  <p className="text-xs text-slate-500">
                    Direct confidential communications between assigned practice partners and corporate clients.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  AES-256 GCM Active
                </span>
              </div>

              <div className="p-12 text-center text-slate-400 text-xs">
                <MessageSquare size={36} className="mx-auto mb-2 text-slate-300" />
                <h4 className="font-bold text-slate-700">Encrypted Messaging Channel Online</h4>
                <p className="max-w-md mx-auto mt-1">
                  Select any active client from the Clients tab or Private Vault to view secure consultation threads.
                </p>
              </div>
            </div>
          )}

          {/* SubTab 10: Notifications */}
          {activeSubTab === 'notifications' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 text-left shadow-xs space-y-4">
              <h3 className="font-manrope font-bold text-lg text-[#062A5A] pb-3 border-b border-slate-100">
                Vault Notifications &amp; System Alerts
              </h3>
              <div className="space-y-2.5 text-xs">
                {auditLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#0969C7] mt-1 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#062A5A]">{log.action}</span>
                        <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{log.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab 11: Invitations (Super Admin) */}
          {activeSubTab === 'invitations' && isSuperAdmin && (
            <VaultInvitationsView onSuccessToast={showToast} />
          )}

          {/* SubTab 12: Security & Audit Logs (Admin or Staff) */}
          {activeSubTab === 'activity' && (
            <VaultAuditLogView onSuccessToast={showToast} />
          )}

          {/* SubTab 13: Security Settings */}
          {activeSubTab === 'security' && (
            isSuperAdmin ? (
              <VaultSecuritySettings onSuccessToast={showToast} />
            ) : (
              /* Client / Staff Personal Security Panel */
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                <div>
                  <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                    My Account Security &amp; Credentials
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your vault login password, device sessions, and authentication security.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <KeyRound className="text-[#0969C7] w-5 h-5" />
                        <h4 className="font-bold text-slate-800 text-sm">Account Password</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Protected with salted PBKDF2 cryptographic hashing. Passwords are never stored or exposed in plain text.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsChangePasswordOpen(true)}
                      className="mt-4 px-4 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-bold transition-colors w-max"
                    >
                      Change Password
                    </button>
                  </div>

                  {/* Active Devices Card */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Laptop className="text-emerald-600 w-5 h-5" />
                        <h4 className="font-bold text-slate-800 text-sm">Active Devices &amp; Sessions</h4>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        View all devices currently authenticated with your account and revoke unfamiliar sessions remotely.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleOpenDevices}
                      className="mt-4 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-[#0969C7] text-slate-700 hover:text-[#0969C7] text-xs font-bold transition-colors w-max"
                    >
                      Manage Active Devices
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          {/* SubTab 14: Settings */}
          {activeSubTab === 'settings' && isSuperAdmin && (
            <VaultSecuritySettings onSuccessToast={showToast} />
          )}
        </main>
      </div>

      {/* MODAL 1: Create Account Modal (Admin) */}
      {isCreateModalOpen && (
        <CreateAccountModal
          accountType={createAccountType}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccessToast={showToast}
        />
      )}

      {/* MODAL 2: User Profile Drawer (Admin) */}
      {selectedUserForDrawer && (
        <UserProfileDrawer
          user={selectedUserForDrawer}
          onClose={() => setSelectedUserForDrawer(null)}
          onOpenPermissions={(u) => {
            setSelectedUserForDrawer(null);
            setSelectedUserForPermissions(u);
          }}
          onSuccessToast={showToast}
        />
      )}

      {/* MODAL 3: Permissions Manager Modal (Admin) */}
      {selectedUserForPermissions && (
        <PermissionsManager
          user={selectedUserForPermissions}
          onClose={() => setSelectedUserForPermissions(null)}
          onSuccessToast={showToast}
        />
      )}

      {/* MODAL 4: Change Password Modal (Any User) */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-left relative">
            <button
              onClick={() => setIsChangePasswordOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <KeyRound className="text-[#0969C7] w-5 h-5" />
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                Change Vault Password
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Enter your current password and choose a secure new password (min. 8 characters).
            </p>

            {passError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7] bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPass}
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isSavingPass ? 'Hashing & Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Active Devices & Sessions Modal */}
      {isDevicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 text-left relative max-h-[85vh] flex flex-col">
            <button
              onClick={() => setIsDevicesModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Laptop className="text-emerald-600 w-5 h-5" />
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                Active Devices &amp; Sessions
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Review all authenticated sessions. Revoking a session will immediately log out that device.
            </p>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {isLoadingSessions ? (
                <div className="py-8 text-center text-xs text-slate-400">Loading active sessions...</div>
              ) : sessionsList.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">No other active sessions detected.</div>
              ) : (
                sessionsList.map((ses) => (
                  <div
                    key={ses.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      ses.isCurrent
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 truncate max-w-[200px]">
                          {ses.device || 'Web Browser'}
                        </span>
                        {ses.isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-600 text-white">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        IP: {ses.ipAddress} &bull; Logged in: {new Date(ses.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    {!ses.isCurrent && (
                      <button
                        type="button"
                        onClick={() => handleRevokeDevice(ses.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 shrink-0 transition-colors"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsDevicesModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
