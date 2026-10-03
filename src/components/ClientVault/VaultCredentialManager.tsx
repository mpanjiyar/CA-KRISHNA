import React, { useState, useMemo } from 'react';
import {
  Key,
  Shield,
  Search,
  Filter,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Unlock,
  RefreshCw,
  Trash2,
  Edit3,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Copy,
  Check,
  Clock,
  Building,
  UserX,
  Sliders,
  LogOut,
  AlertCircle,
  X,
  Layers,
  ArrowRight,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultUser, VaultAccountStatus, VaultAccountType } from '../../types/vault';
import { calculatePasswordStrength } from '../../lib/vaultCrypto';

interface VaultCredentialManagerProps {
  filterMode?: 'all' | 'clients' | 'staff';
  onOpenCreate?: (type: VaultAccountType) => void;
  onOpenPermissions?: (user: VaultUser) => void;
  onSuccessToast: (msg: string) => void;
}

export const VaultCredentialManager: React.FC<VaultCredentialManagerProps> = ({
  filterMode = 'all',
  onOpenCreate,
  onOpenPermissions,
  onSuccessToast
}) => {
  const {
    users,
    currentVaultUser,
    changeUserId,
    adminSetPassword,
    adminGeneratePassword,
    toggleAccountDisabled,
    toggleForcePasswordChange,
    toggleSelfCredentialManagement,
    revokeUserSessions,
    deleteUser
  } = useVault();

  // Search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'clients' | 'staff' | 'super_admin'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended' | 'Pending'>('All');
  const [credentialPolicyFilter, setCredentialPolicyFilter] = useState<'All' | 'Locked' | 'SelfService'>('All');

  // Modals state
  const [changeIdUser, setChangeIdUser] = useState<VaultUser | null>(null);
  const [newUserIdInput, setNewUserIdInput] = useState('');
  const [newUsernameInput, setNewUsernameInput] = useState('');
  const [idChangeError, setIdChangeError] = useState<string | null>(null);
  const [isChangingId, setIsChangingId] = useState(false);

  const [resetPassUser, setResetPassUser] = useState<VaultUser | null>(null);
  const [customPassword, setCustomPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCustomPassword, setShowCustomPassword] = useState(false);
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState(true);
  const [revokeSessionsOnReset, setRevokeSessionsOnReset] = useState(true);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isResettingPass, setIsResettingPass] = useState(false);

  const [oneTimePasswordData, setOneTimePasswordData] = useState<{
    user: VaultUser;
    plainText: string;
  } | null>(null);
  const [showOneTimePass, setShowOneTimePass] = useState(true);
  const [copiedOneTime, setCopiedOneTime] = useState(false);

  const [disableConfirmUser, setDisableConfirmUser] = useState<VaultUser | null>(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<VaultUser | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered accounts list
  const baseUsers = useMemo(() => {
    return users.filter((u) => {
      if (filterMode === 'clients') return u.accountType === 'client';
      if (filterMode === 'staff') return u.accountType === 'staff' || u.accountType === 'super_admin';
      return true;
    });
  }, [users, filterMode]);

  const filteredUsers = useMemo(() => {
    return baseUsers.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.company.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q);

      const matchesRole =
        roleFilter === 'All' ||
        (roleFilter === 'clients' && u.accountType === 'client') ||
        (roleFilter === 'staff' && u.accountType === 'staff') ||
        (roleFilter === 'super_admin' && u.accountType === 'super_admin');

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Suspended' ? u.status === 'Suspended' || u.loginDisabled : u.status === statusFilter);

      const matchesPolicy =
        credentialPolicyFilter === 'All' ||
        (credentialPolicyFilter === 'Locked' && !u.canSelfManageCredentials && u.accountType !== 'super_admin') ||
        (credentialPolicyFilter === 'SelfService' && (u.canSelfManageCredentials || u.accountType === 'super_admin'));

      return matchesSearch && matchesRole && matchesStatus && matchesPolicy;
    });
  }, [baseUsers, searchQuery, roleFilter, statusFilter, credentialPolicyFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = baseUsers.length;
    const active = baseUsers.filter((u) => u.status === 'Active' && !u.loginDisabled).length;
    const suspended = baseUsers.filter((u) => u.status === 'Suspended' || u.loginDisabled).length;
    const adminLocked = baseUsers.filter((u) => !u.canSelfManageCredentials && u.accountType !== 'super_admin').length;
    const twoFactorCount = baseUsers.filter((u) => u.twoFactorEnabled).length;
    return { total, active, suspended, adminLocked, twoFactorCount };
  }, [baseUsers]);

  // Handlers for Change ID Modal
  const handleOpenChangeId = (user: VaultUser) => {
    setChangeIdUser(user);
    setNewUserIdInput(user.id);
    setNewUsernameInput(user.username);
    setIdChangeError(null);
  };

  const handleConfirmChangeId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changeIdUser) return;
    setIdChangeError(null);

    if (!newUserIdInput.trim()) {
      setIdChangeError('User ID cannot be blank.');
      return;
    }

    setIsChangingId(true);
    const result = await changeUserId(changeIdUser.id, newUserIdInput.trim(), newUsernameInput.trim());
    setIsChangingId(false);

    if (result.success) {
      onSuccessToast(`✓ Unique Login ID replaced: "${changeIdUser.id}" → "${newUserIdInput.trim()}". All records re-bound.`);
      setChangeIdUser(null);
    } else {
      setIdChangeError(result.error || 'Failed to update login ID.');
    }
  };

  // Handlers for Reset Password Modal
  const handleOpenResetPassword = (user: VaultUser) => {
    setResetPassUser(user);
    setCustomPassword('');
    setConfirmPassword('');
    setShowCustomPassword(false);
    setForceChangeNextLogin(true);
    setRevokeSessionsOnReset(true);
    setResetError(null);
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;
    setResetError(null);

    if (customPassword.length < 8) {
      setResetError('Master password must be at least 8 characters long.');
      return;
    }

    if (customPassword !== confirmPassword) {
      setResetError('Passwords do not match. Please verify.');
      return;
    }

    setIsResettingPass(true);
    await adminSetPassword(resetPassUser.id, customPassword, forceChangeNextLogin);
    if (revokeSessionsOnReset) {
      revokeUserSessions(resetPassUser.id);
    }
    setIsResettingPass(false);

    onSuccessToast(`✓ New password hashed and applied for ${resetPassUser.fullName}. Force change on next login: ${forceChangeNextLogin ? 'Yes' : 'No'}.`);
    setResetPassUser(null);
  };

  // Handlers for Generate Password
  const handleGeneratePassword = async (user: VaultUser) => {
    const result = await adminGeneratePassword(user.id);
    if (result.success) {
      setOneTimePasswordData({
        user,
        plainText: result.plainTextPassword
      });
      setShowOneTimePass(true);
      setCopiedOneTime(false);
      onSuccessToast(`✓ High-entropy password generated and hashed for ${user.fullName}.`);
    }
  };

  const handleCopyOneTimePass = () => {
    if (oneTimePasswordData && typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(oneTimePasswordData.plainText);
      setCopiedOneTime(true);
      setTimeout(() => setCopiedOneTime(false), 2000);
      onSuccessToast('Password copied to clipboard.');
    }
  };

  // Handlers for Disable / Enable Account
  const handleToggleDisabled = (user: VaultUser) => {
    if (user.accountType === 'super_admin') {
      onSuccessToast('Security policy: Super Admin account cannot be suspended.');
      return;
    }
    setDisableConfirmUser(user);
  };

  const handleConfirmDisableToggle = () => {
    if (!disableConfirmUser) return;
    const isCurrentlyDisabled = disableConfirmUser.loginDisabled || disableConfirmUser.status === 'Suspended';
    toggleAccountDisabled(disableConfirmUser.id, !isCurrentlyDisabled);
    onSuccessToast(
      isCurrentlyDisabled
        ? `✓ Account access restored for ${disableConfirmUser.fullName}.`
        : `✓ Account access suspended and active sessions terminated for ${disableConfirmUser.fullName}.`
    );
    setDisableConfirmUser(null);
  };

  // Handlers for Delete Account
  const handleOpenDelete = (user: VaultUser) => {
    if (user.accountType === 'super_admin') {
      onSuccessToast('Security policy: Super Admin account cannot be deleted.');
      return;
    }
    setDeleteConfirmUser(user);
    setDeleteConfirmationText('');
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmUser) return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteUser(deleteConfirmUser.id);
      setIsDeleting(false);
      onSuccessToast(`✓ Account "${deleteConfirmUser.fullName}" (${deleteConfirmUser.id}) permanently removed.`);
      setDeleteConfirmUser(null);
    }, 400);
  };

  const customStrength = calculatePasswordStrength(customPassword);

  return (
    <div className="space-y-6 text-left animate-vault-fade">
      
      {/* Top Header & Overview Banner */}
      <div className="bg-gradient-to-r from-[#062A5A] via-[#0A2540] to-[#062A5A] rounded-3xl p-6 sm:p-7 text-white shadow-lg border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#0969C7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-semibold border border-white/15">
              <Key size={13} className="text-[#F28C18]" />
              <span>Admin-Only Credential Governance Console</span>
            </div>
            <h2 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Credential &amp; Identity Management
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Super Admin exclusive control: assign custom IDs, hash passwords via PBKDF2 (100k rounds), enforce password rotation policies, and terminate compromised sessions across all client and staff accounts.
            </p>
          </div>

          {onOpenCreate && (
            <button
              type="button"
              onClick={() => onOpenCreate(filterMode === 'staff' ? 'staff' : 'client')}
              className="px-4 py-2.5 rounded-xl bg-[#F28C18] hover:bg-[#d97c14] text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer self-start md:self-center"
            >
              <UserPlus size={16} />
              <span>+ Provision New User</span>
            </button>
          )}
        </div>

        {/* 4 Metric Pill Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[10.5px] uppercase font-bold text-slate-300">Total Registered</div>
            <div className="font-manrope font-extrabold text-2xl text-white mt-0.5">{stats.total}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[10.5px] uppercase font-bold text-emerald-300">Active &amp; Verified</div>
            <div className="font-manrope font-extrabold text-2xl text-emerald-400 mt-0.5">{stats.active}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[10.5px] uppercase font-bold text-rose-300">Suspended / Disabled</div>
            <div className="font-manrope font-extrabold text-2xl text-rose-400 mt-0.5">{stats.suspended}</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <div className="text-[10.5px] uppercase font-bold text-amber-300">Admin-Locked Policy</div>
            <div className="font-manrope font-extrabold text-2xl text-amber-400 mt-0.5">{stats.adminLocked}</div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Multi-Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, organization, unique ID (e.g. USR-CL-101), or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-[#0969C7] text-xs sm:text-sm bg-slate-50/50 min-h-[42px]"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {filterMode === 'all' && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 text-xs focus:border-[#0969C7] min-h-[42px]"
              >
                <option value="All">All Roles</option>
                <option value="clients">Clients Only</option>
                <option value="staff">Staff Only</option>
                <option value="super_admin">Super Admins</option>
              </select>
            )}

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 text-xs focus:border-[#0969C7] min-h-[42px]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Suspended">Suspended / Disabled</option>
              <option value="Pending">Pending Setup</option>
            </select>

            <select
              value={credentialPolicyFilter}
              onChange={(e) => setCredentialPolicyFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 text-xs focus:border-[#0969C7] min-h-[42px]"
            >
              <option value="All">All Credential Policies</option>
              <option value="Locked">Admin-Only Locked (Default)</option>
              <option value="SelfService">Self-Service Enabled</option>
            </select>
          </div>

        </div>
      </div>

      {/* CREDENTIAL USER CARDS LISTING */}
      <div className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3 shadow-2xs">
            <UserX size={40} className="mx-auto text-slate-300" />
            <h4 className="font-manrope font-bold text-base text-[#062A5A]">
              No accounts match the current filter
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try clearing your search query or adjusting role and status filter criteria.
            </p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isSuperAdmin = user.accountType === 'super_admin';
            const isDisabled = user.loginDisabled || user.status === 'Suspended';
            const isLockedPolicy = !user.canSelfManageCredentials && !isSuperAdmin;

            return (
              <div
                key={user.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-2xs hover:shadow-md ${
                  isDisabled
                    ? 'border-rose-200/80 bg-rose-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* 1. Top Section: User Card & Identity Summary */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs border border-white/20">
                      {user.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-manrope font-bold text-base text-[#062A5A] truncate">
                          {user.fullName}
                        </h3>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border ${
                            isDisabled
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : user.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {isDisabled ? <AlertTriangle size={11} /> : <CheckCircle2 size={11} />}
                          <span>{isDisabled ? 'Disabled / Suspended' : user.status}</span>
                        </span>

                        {/* Role Badge */}
                        <span
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isSuperAdmin
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : user.accountType === 'staff'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {user.role} ({user.accountType.replace('_', ' ')})
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Building size={13} className="text-slate-400" />
                          <span>{user.company}</span>
                        </span>
                        <span>&middot;</span>
                        <span className="font-mono text-[11px] text-slate-500">{user.email}</span>
                        {user.phone && (
                          <>
                            <span>&middot;</span>
                            <span className="text-slate-400 font-mono text-[11px]">{user.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Metadata Capsules */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] font-mono shrink-0">
                    <div className="p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Last Login</span>
                      <span className="font-bold text-[#062A5A]">{user.lastLogin || 'Never'}</span>
                    </div>

                    <div className="p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans">Active Devices</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{user.activeSessionsCount || 0} Sessions</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Middle Section: Credential Identifiers & Policy Tags */}
                <div className="py-3.5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-xs">
                  
                  {/* Unique ID & Username */}
                  <div className="md:col-span-5 flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-[#EEF5FC] border border-[#0969C7]/20 flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-[#0969C7] flex items-center justify-between">
                        <span>Unique User ID</span>
                        <span className="font-mono text-[9px] bg-white px-1.5 py-0.2 rounded border border-blue-200">KMS MAPPED</span>
                      </div>
                      <div className="font-mono font-extrabold text-[#062A5A] text-sm mt-0.5 truncate">
                        {user.id}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex-1 min-w-0">
                      <div className="text-[10px] uppercase font-bold text-slate-500">
                        Login Username
                      </div>
                      <div className="font-mono font-bold text-slate-800 text-sm mt-0.5 truncate">
                        {user.username}
                      </div>
                    </div>
                  </div>

                  {/* Security Attributes & Policies */}
                  <div className="md:col-span-7 flex flex-wrap items-center gap-2 text-[11px]">
                    {/* Credential Modification Policy Badge */}
                    <div className={`p-2 px-3 rounded-xl border flex items-center gap-1.5 ${
                      isLockedPolicy
                        ? 'bg-amber-50 text-amber-900 border-amber-200'
                        : 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    }`}>
                      {isLockedPolicy ? <Lock size={12} className="text-amber-600" /> : <Unlock size={12} className="text-emerald-600" />}
                      <span className="font-bold">
                        {isLockedPolicy ? 'Admin-Only Password Policy' : 'Self-Service Passphrase Allowed'}
                      </span>
                    </div>

                    {/* Force Password Change Flag */}
                    {user.forcePasswordChange && (
                      <span className="p-2 px-2.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200 font-bold flex items-center gap-1">
                        <Clock size={12} className="text-orange-600" />
                        <span>Force Change Next Login</span>
                      </span>
                    )}

                    {/* 2FA Status */}
                    <span className={`p-2 px-2.5 rounded-xl border font-semibold flex items-center gap-1 ${
                      user.twoFactorEnabled
                        ? 'bg-slate-50 text-slate-700 border-slate-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      <Smartphone size={12} className="text-[#0969C7]" />
                      <span>{user.twoFactorEnabled ? '2FA Enforced' : '2FA Optional'}</span>
                    </span>

                    {/* Projects Count */}
                    <span className="p-2 px-2.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 font-semibold font-mono">
                      {user.assignedProjects.length} Projects
                    </span>
                  </div>

                </div>

                {/* 3. Bottom Section: Credential Actions Toolbar & Permissions */}
                <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  
                  {/* Main Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Change ID Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenChangeId(user)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#EEF5FC] text-[#062A5A] hover:text-[#0969C7] font-semibold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Replace User ID or Username identifier"
                    >
                      <Edit3 size={13} />
                      <span>Change ID</span>
                    </button>

                    {/* Reset Password Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenResetPassword(user)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Set custom secure passphrase"
                    >
                      <Key size={13} className="text-[#0969C7]" />
                      <span>Reset Password</span>
                    </button>

                    {/* Generate Password Button */}
                    <button
                      type="button"
                      onClick={() => handleGeneratePassword(user)}
                      className="px-3 py-1.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="Generate cryptographically strong 16-character password"
                    >
                      <Sparkles size={13} className="text-[#F28C18]" />
                      <span>Generate Password</span>
                    </button>

                    {/* Disable / Enable Account Button */}
                    {!isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => handleToggleDisabled(user)}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs border transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                          isDisabled
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title={isDisabled ? 'Reactivate account' : 'Suspend account and revoke active sessions'}
                      >
                        {isDisabled ? <CheckCircle2 size={13} /> : <UserX size={13} />}
                        <span>{isDisabled ? 'Enable Account' : 'Disable Account'}</span>
                      </button>
                    )}

                    {/* Delete Account Button */}
                    {!isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => handleOpenDelete(user)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-700 font-semibold text-xs border border-slate-200 hover:border-rose-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                        title="Delete account permanently"
                      >
                        <Trash2 size={13} />
                        <span>Delete Account</span>
                      </button>
                    )}
                  </div>

                  {/* Secondary Toggles & Permissions Link */}
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Toggle Self-Service Permission */}
                    {!isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = !user.canSelfManageCredentials;
                          toggleSelfCredentialManagement(user.id, next);
                          onSuccessToast(
                            next
                              ? `Self-service password management enabled for ${user.fullName}.`
                              : `Credential changes locked to Admin-Only for ${user.fullName}.`
                          );
                        }}
                        className="text-[11px] font-semibold text-slate-600 hover:text-[#062A5A] px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Toggle whether user can change their own password in their profile"
                      >
                        {user.canSelfManageCredentials ? 'Lock Password to Admin' : 'Allow User Password Change'}
                      </button>
                    )}

                    {/* Revoke Sessions */}
                    {user.activeSessionsCount > 0 && !isSuperAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          revokeUserSessions(user.id);
                          onSuccessToast(`✓ Revoked all active device sessions for ${user.fullName}.`);
                        }}
                        className="text-[11px] font-semibold text-rose-600 hover:underline px-2 py-1 flex items-center gap-1 cursor-pointer"
                        title="Force logout on all devices"
                      >
                        <LogOut size={12} />
                        <span>Revoke Sessions</span>
                      </button>
                    )}

                    {/* Permissions Button */}
                    {onOpenPermissions && (
                      <button
                        type="button"
                        onClick={() => onOpenPermissions(user)}
                        className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0969C7] font-semibold text-xs border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ml-auto sm:ml-0"
                      >
                        <Sliders size={13} />
                        <span>Permissions &rarr;</span>
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CHANGE USER ID & USERNAME */}
      {/* ========================================================================= */}
      {changeIdUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-vault-zoom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#062A5A] font-bold text-sm">
                <Edit3 size={16} className="text-[#0969C7]" />
                <span>Replace Unique Login ID</span>
              </div>
              <button
                type="button"
                onClick={() => setChangeIdUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              Target User: <strong className="font-bold">{changeIdUser.fullName}</strong> ({changeIdUser.company}).
              Changing the ID automatically preserves file ownership, project bindings, and audit references.
            </div>

            {idChangeError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{idChangeError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmChangeId} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Unique User ID
                </label>
                <input
                  type="text"
                  required
                  value={newUserIdInput}
                  onChange={(e) => setNewUserIdInput(e.target.value)}
                  placeholder="e.g. USR-CL-101 or custom ID"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs focus:border-[#0969C7] outline-hidden bg-slate-50/50"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Current: {changeIdUser.id}</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Login Username (Optional Update)
                </label>
                <input
                  type="text"
                  required
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value)}
                  placeholder="e.g. apex.singhal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:border-[#0969C7] outline-hidden bg-slate-50/50"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Current: {changeIdUser.username}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setChangeIdUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingId}
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  {isChangingId ? 'Re-binding...' : 'Save & Replace ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RESET PASSWORD WITH PBKDF2 HASHING */}
      {/* ========================================================================= */}
      {resetPassUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-vault-zoom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#062A5A] font-bold text-sm">
                <Key size={16} className="text-[#0969C7]" />
                <span>Admin Password Reset</span>
              </div>
              <button
                type="button"
                onClick={() => setResetPassUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-[#EEF5FC] border border-[#0969C7]/20 text-xs text-[#062A5A] leading-relaxed">
              Target Account: <strong>{resetPassUser.fullName}</strong> ({resetPassUser.id} &middot; {resetPassUser.company}).
              Password will be encrypted via WebCrypto PBKDF2 with 100,000 SHA-256 iterations and securely salted.
            </div>

            {resetError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleConfirmResetPassword} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  New Master Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showCustomPassword ? 'text' : 'password'}
                    required
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="Enter strong passphrase (min 8 chars)"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#0969C7] outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCustomPassword(!showCustomPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showCustomPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm Passphrase
                </label>
                <input
                  type={showCustomPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat master passphrase"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#0969C7] outline-hidden"
                />
              </div>

              {/* Password Strength Indicator */}
              {customPassword.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Cipher Strength:</span>
                    <span className="font-bold text-slate-800">{customStrength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${customStrength.color}`}
                      style={{ width: `${customStrength.score}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Policy Options Checkboxes */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={forceChangeNextLogin}
                    onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                    className="rounded text-[#062A5A] focus:ring-[#0969C7] h-4 w-4 border-slate-300"
                  />
                  <span className="text-xs text-slate-700 font-semibold">
                    Force password change on next login
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={revokeSessionsOnReset}
                    onChange={(e) => setRevokeSessionsOnReset(e.target.checked)}
                    className="rounded text-[#062A5A] focus:ring-[#0969C7] h-4 w-4 border-slate-300"
                  />
                  <span className="text-xs text-slate-700">
                    Revoke all active device sessions immediately
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPassUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPass}
                  className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isResettingPass ? 'Deriving PBKDF2...' : 'Apply & Enforce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ONE-TIME GENERATED PASSWORD HANDOVER DIALOG */}
      {/* ========================================================================= */}
      {oneTimePasswordData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-vault-zoom">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <Sparkles size={18} className="text-[#F28C18]" />
                <span>One-Time Secure Credential Generated</span>
              </div>
              <button
                type="button"
                onClick={() => setOneTimePasswordData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>Account: <strong className="text-slate-900">{oneTimePasswordData.user.fullName}</strong></div>
              <div>User ID: <span className="font-mono font-bold text-[#0969C7]">{oneTimePasswordData.user.id}</span></div>
              <div>Username: <span className="font-mono text-slate-700">{oneTimePasswordData.user.username}</span></div>
            </div>

            {/* Generated Password Box */}
            <div className="p-4 rounded-2xl bg-[#062A5A] text-white space-y-2 border border-white/20">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>Cryptographically Generated Passphrase</span>
                <button
                  type="button"
                  onClick={() => setShowOneTimePass(!showOneTimePass)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {showOneTimePass ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showOneTimePass ? 'Mask' : 'Reveal'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="font-mono font-bold text-sm sm:text-base tracking-wider text-emerald-300 truncate">
                  {showOneTimePass ? oneTimePasswordData.plainText : '••••••••••••••••'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyOneTimePass}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {copiedOneTime ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedOneTime ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert size={16} className="text-amber-700 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong>Zero Plaintext Storage:</strong> This generated password has been hashed with PBKDF2 (100,000 SHA-256 iterations). For security, it cannot be recovered after this dialog closes. Provide this initial token to the user over a secure channel.
              </span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setOneTimePasswordData(null)}
                className="px-5 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs shadow-2xs cursor-pointer"
              >
                Done &amp; Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DISABLE / ENABLE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {disableConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-vault-zoom">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-manrope font-bold text-base text-[#062A5A]">
                  {disableConfirmUser.loginDisabled || disableConfirmUser.status === 'Suspended'
                    ? 'Reactivate Account Access?'
                    : 'Suspend Account & Invalidate Sessions?'}
                </h4>
                <p className="text-xs text-slate-500">
                  {disableConfirmUser.fullName} &middot; {disableConfirmUser.company}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {disableConfirmUser.loginDisabled || disableConfirmUser.status === 'Suspended'
                ? `Reactivating this account will restore authentication access to their isolated client vault. The user will be able to log in with their existing credentials.`
                : `Suspending this account will immediately revoke all active browser tokens, terminate active sessions, and block any subsequent login attempts until reactivated.`}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDisableConfirmUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDisableToggle}
                className={`px-5 py-2 rounded-xl font-bold text-xs text-white transition-colors shadow-2xs cursor-pointer ${
                  disableConfirmUser.loginDisabled || disableConfirmUser.status === 'Suspended'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {disableConfirmUser.loginDisabled || disableConfirmUser.status === 'Suspended'
                  ? 'Confirm Reactivation'
                  : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DELETE ACCOUNT CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-vault-zoom">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-manrope font-bold text-base text-[#062A5A]">
                  Permanently Delete Account?
                </h4>
                <p className="text-xs text-slate-500">
                  {deleteConfirmUser.fullName} ({deleteConfirmUser.id})
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 leading-relaxed">
              This action cannot be undone. Removing this account will permanently revoke their access credentials. Associated audit log history will be maintained for compliance.
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Type <span className="font-mono text-rose-700">{deleteConfirmUser.id}</span> to confirm deletion:
              </label>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                placeholder={deleteConfirmUser.id}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:border-rose-600 outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteConfirmationText.trim() !== deleteConfirmUser.id || isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
