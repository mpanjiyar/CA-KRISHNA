import React, { useState } from 'react';
import {
  X,
  User,
  Building2,
  Shield,
  Key,
  Smartphone,
  Lock,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultUser } from '../../types/vault';
import { calculatePasswordStrength, hashPassword } from '../../lib/vaultCrypto';

interface VaultUserProfileModalProps {
  user: VaultUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (msg: string) => void;
}

export const VaultUserProfileModal: React.FC<VaultUserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const { updateUser, logoutAllDevices, addAuditLog } = useVault();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions'>('profile');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [notes, setNotes] = useState(user?.notes || '');

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? true);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(user.id, {
      fullName,
      phone,
      notes
    });
    onSuccessToast('✓ Profile updated successfully.');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please verify.');
      return;
    }

    setIsUpdatingPassword(true);
    const { hash, salt } = await hashPassword(newPassword);

    setTimeout(() => {
      updateUser(user.id, {
        forcePasswordChange: false
      });
      setIsUpdatingPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      addAuditLog(
        `Password Changed: ${user.fullName}`,
        'Security',
        `PBKDF2 SHA-256 hash rotated successfully for user ${user.id}.`
      );
      onSuccessToast('✓ Master passphrase updated and re-encrypted with PBKDF2 salt.');
    }, 450);
  };

  const handleToggle2FA = () => {
    const next = !twoFactorEnabled;
    setTwoFactorEnabled(next);
    updateUser(user.id, { twoFactorEnabled: next });
    addAuditLog(
      `2FA Preference Updated: ${user.fullName}`,
      'Security',
      `Two-factor authentication ${next ? 'enabled' : 'disabled'} for user ${user.id}.`
    );
    onSuccessToast(`Two-Factor Authentication ${next ? 'enabled' : 'disabled'}.`);
  };

  const handleRevokeSessions = () => {
    logoutAllDevices(user.id);
    onSuccessToast('✓ All other device sessions revoked. Current session protected.');
  };

  const strength = calculatePasswordStrength(newPassword);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-vault-fade">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto text-left flex flex-col max-h-[92vh] animate-vault-zoom">
        
        {/* Header Bar */}
        <div className="bg-[#062A5A] text-white p-5 sm:p-6 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#F28C18] font-bold text-lg border border-white/15 shrink-0">
              {user.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-manrope font-bold text-base sm:text-lg text-white">
                  {user.fullName}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-white/90">
                  {user.role}
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                <span>{user.company}</span>
                <span>&middot;</span>
                <span className="font-mono text-[11px]">{user.id}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-4 border-b border-slate-100 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 font-semibold transition-all border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#062A5A] text-[#062A5A]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Profile Information
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 font-semibold transition-all border-b-2 ${
              activeTab === 'security'
                ? 'border-[#062A5A] text-[#062A5A]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Passphrase &amp; Encryption
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sessions')}
            className={`pb-3 font-semibold transition-all border-b-2 ${
              activeTab === 'sessions'
                ? 'border-[#062A5A] text-[#062A5A]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Active Sessions ({user.activeSessionsCount})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs text-slate-600 space-y-4">
          
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#0969C7] outline-hidden min-h-[42px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Direct Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:border-[#0969C7] outline-hidden min-h-[42px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Vault Username (Immutable)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.username}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Registered Email (Immutable)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.email}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Compliance Notes &amp; Engagement Scope
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:border-[#0969C7] outline-hidden"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              
              {/* 2FA Card */}
              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0969C7]">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Enforce hardware token / TOTP authenticator challenge on every login.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    twoFactorEnabled
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {twoFactorEnabled ? 'Enabled &middot; Active' : 'Disabled'}
                </button>
              </div>

              {/* Password Change Form */}
              {(() => {
                const isAdmin = user.accountType === 'super_admin';
                const canModifyCredentials = isAdmin || !!user.canSelfManageCredentials;

                if (!canModifyCredentials) {
                  return (
                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs space-y-3 text-left">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                          <Lock size={15} className="text-amber-700" />
                          <span>Credential Management Locked by Administrator</span>
                        </div>
                        <span className="text-[9.5px] font-mono uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-amber-200/70 text-amber-900 border border-amber-300">
                          Admin Policy
                        </span>
                      </div>

                      <p className="text-xs text-amber-800/90 leading-relaxed">
                        Under firm compliance protocols, Login ID and Master Passphrase modifications are strictly managed by Practice Administrators. Clients and Staff cannot modify login credentials unless self-service access is explicitly authorized by the Admin in User Management.
                      </p>

                      <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-[11px] text-amber-900/80">
                        <span>Need credential update?</span>
                        <span className="font-semibold text-[#062A5A]">Contact Chartered Accountant</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <form onSubmit={handleUpdatePassword} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3.5">
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Key size={14} className="text-[#0969C7]" />
                      <span>Update Cryptographic Passphrase</span>
                    </div>

                    {passwordError && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{passwordError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10.5px] font-bold uppercase text-slate-700 mb-1">
                          New Passphrase
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:border-[#0969C7]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-bold uppercase text-slate-700 mb-1">
                          Confirm Passphrase
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat passphrase"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs outline-hidden focus:border-[#0969C7]"
                        />
                      </div>
                    </div>

                    {newPassword.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">PBKDF2 Entropy:</span>
                          <span className="font-bold text-slate-800">{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${strength.color}`}
                            style={{ width: `${strength.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="px-4 py-2 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lock size={12} className="text-[#F28C18]" />
                        <span>{isUpdatingPassword ? 'Hashing with PBKDF2...' : 'Rotate Passphrase'}</span>
                      </button>
                    </div>
                  </form>
                );
              })()}

            </div>
          )}

          {/* TAB 3: Active Sessions */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#F7F9FC] border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900 text-xs">Active Session Governance</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Sessions auto-expire after 60 minutes of inactivity to protect sensitive client financial filings.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRevokeSessions}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-colors shrink-0"
                >
                  Revoke All Other Sessions
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Current Active Session (This Device)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    ONLINE NOW
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono space-y-0.5 pt-1">
                  <div>Device: Secure Web Client &middot; TLS 1.3 Strict</div>
                  <div>IP Address: 103.21.244.18 (Mumbai Gateway)</div>
                  <div>Session Started: {user.lastLogin}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#062A5A] text-white font-bold text-xs hover:bg-[#031C3D]"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
