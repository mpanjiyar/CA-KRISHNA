import React, { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
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
  const { users, files, projects, invitations, auditLogs } = useVault();

  const [activeSubTab, setActiveSubTab] = useState<VaultSubTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals & Panels
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createAccountType, setCreateAccountType] = useState<VaultAccountType>('client');
  const [selectedUserForDrawer, setSelectedUserForDrawer] = useState<VaultUser | null>(null);
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<VaultUser | null>(null);
  const [inlinePermissionsUserId, setInlinePermissionsUserId] = useState<string>('');

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

  const navItems: {
    id: VaultSubTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
    {
      id: 'clients',
      label: 'Clients',
      icon: <Building2 size={15} />,
      badge: users.filter((u) => u.accountType === 'client').length,
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: <UserCheck size={15} />,
      badge: users.filter((u) => u.accountType === 'staff' || u.accountType === 'super_admin').length,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { id: 'permissions', label: 'Roles & Permissions', icon: <Shield size={15} /> },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Briefcase size={15} />,
      badge: projects.length,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { id: 'files', label: 'Files', icon: <Folder size={15} />, badge: files.length },
    { id: 'documents', label: 'Documents', icon: <FileText size={15} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={15} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={15} />, badge: 'Live', badgeColor: 'bg-emerald-500 text-white' },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
    {
      id: 'invitations',
      label: 'Invitations',
      icon: <Send size={15} />,
      badge: invitations.filter((i) => i.status === 'Pending').length,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'activity', label: 'Activity Log', icon: <Activity size={15} /> },
    { id: 'security', label: 'Security', icon: <Lock size={15} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={15} /> }
  ];

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#062A5A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#F28C18]/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 size={18} className="text-[#159447] shrink-0" />
          <span className="text-xs font-semibold">{successToast}</span>
        </div>
      )}

      {/* Real-time Status Strip */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="font-bold text-[#062A5A]">Client Vault Live Sync:</span>
          <span className="text-slate-500">
            Real-time multi-user synchronization active across all devices &amp; browser tabs.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOpenCreateModal('client')}
            className="px-3.5 py-1.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Plus size={13} className="text-[#F28C18]" />
            <span>+ Create Account</span>
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
          <span className="text-[11px] font-mono text-slate-400">Client Vault Navigation</span>
        </div>

        {/* Sidebar (Desktop Persistent / Mobile Drawer) */}
        <aside
          className={`w-full lg:w-64 bg-white rounded-3xl border border-slate-200 p-3 sm:p-4 shrink-0 shadow-xs space-y-1 ${
            isMobileSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="px-3 py-2 text-[10.5px] uppercase font-extrabold tracking-wider text-slate-400 font-manrope">
            Client Vault Navigation
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
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

          {/* SubTab 2: Clients */}
          {activeSubTab === 'clients' && (
            <VaultUsersList
              filterMode="clients"
              onOpenCreate={handleOpenCreateModal}
              onSelectUser={(u) => setSelectedUserForDrawer(u)}
              onOpenPermissions={(u) => setSelectedUserForPermissions(u)}
              onSuccessToast={showToast}
            />
          )}

          {/* SubTab 3: Staff */}
          {activeSubTab === 'staff' && (
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

          {/* SubTab 4: Roles & Permissions */}
          {activeSubTab === 'permissions' && (
            <div className="space-y-6">
              {/* Account Selection Banner */}
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

          {/* SubTab 5: Projects */}
          {activeSubTab === 'projects' && (
            <VaultProjectsManager onSuccessToast={showToast} />
          )}

          {/* SubTab 6 & 7: Files & Documents (Private Vault Explorer) */}
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
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-[#062A5A]">{log.action}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{log.details}</div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SubTab 11: Invitations */}
          {activeSubTab === 'invitations' && (
            <VaultInvitationsView onSuccessToast={showToast} />
          )}

          {/* SubTab 12: Activity Log */}
          {activeSubTab === 'activity' && (
            <VaultAuditLogView onSuccessToast={showToast} />
          )}

          {/* SubTab 13: Security */}
          {activeSubTab === 'security' && (
            <VaultSecuritySettings onSuccessToast={showToast} />
          )}

          {/* SubTab 14: Settings */}
          {activeSubTab === 'settings' && (
            <div className="space-y-6">
              <VaultSecuritySettings onSuccessToast={showToast} />
            </div>
          )}
        </main>
      </div>

      {/* Create Account Modal */}
      <CreateAccountModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultAccountType={createAccountType}
        onSuccessToast={showToast}
      />

      {/* User Profile Side Drawer */}
      <UserProfileDrawer
        user={selectedUserForDrawer}
        onClose={() => setSelectedUserForDrawer(null)}
        onOpenPermissions={(u) => {
          setSelectedUserForDrawer(null);
          setSelectedUserForPermissions(u);
        }}
        onSuccessToast={showToast}
      />

      {/* Permissions Manager Modal */}
      {selectedUserForPermissions && (
        <PermissionsManager
          user={selectedUserForPermissions}
          onClose={() => setSelectedUserForPermissions(null)}
          onSuccessToast={showToast}
        />
      )}
    </div>
  );
};

// Helper Building icon
function BuildingIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}
