import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Key,
  LogOut,
  Smartphone,
  Save,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Sliders
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultSecurityConfig } from '../../types/vault';

interface VaultSecuritySettingsProps {
  onSuccessToast: (msg: string) => void;
}

export const VaultSecuritySettings: React.FC<VaultSecuritySettingsProps> = ({ onSuccessToast }) => {
  const { securityConfig, updateSecurityConfig, addAuditLog, users, updateUser } = useVault();

  const [formState, setFormState] = useState<VaultSecurityConfig>(() => ({ ...securityConfig }));
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof VaultSecurityConfig) => {
    setFormState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanges(true);
      return next;
    });
  };

  const handleNumberChange = (key: keyof VaultSecurityConfig, val: number) => {
    setFormState((prev) => {
      const next = { ...prev, [key]: val };
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSecurityConfig(formState);
    setHasChanges(false);
    onSuccessToast('✓ Changes saved successfully');
  };

  const handleReset = () => {
    setFormState({ ...securityConfig });
    setHasChanges(false);
    onSuccessToast('Reset security configuration to saved values.');
  };

  const [confirmLogoutAllOpen, setConfirmLogoutAllOpen] = useState(false);

  const handleLogoutAllFirmSessions = () => {
    setConfirmLogoutAllOpen(true);
  };

  const handleExecuteLogoutAll = () => {
    users.forEach((u) => {
      updateUser(u.id, { activeSessionsCount: 0 });
    });
    addAuditLog(
      'Firm-Wide Device Session Purge',
      'Security',
      'All active portal device tokens invalidated by Super Admin.',
      'Warning'
    );
    setConfirmLogoutAllOpen(false);
    onSuccessToast('All client and staff devices have been signed out.');
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-left max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Shield size={11} className="text-emerald-600" />
              <span>Zero-Trust Enterprise Vault Security</span>
            </span>
          </div>
          <h2 className="font-manrope font-bold text-xl sm:text-2xl text-[#062A5A]">
            Password &amp; Security Governance
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure authentication rules, session lifespans, brute-force lockouts, and cryptographic access parameters.
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
        >
          <Save size={14} className="text-[#F28C18]" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Security Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
        {/* Card 1: Session Controls */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Clock size={16} className="text-[#0969C7]" />
            <h3 className="font-manrope font-bold text-sm text-[#062A5A]">
              Session &amp; Idle Timeout
            </h3>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Inactivity Session Timeout (Minutes)
            </label>
            <select
              value={formState.sessionTimeoutMinutes}
              onChange={(e) => handleNumberChange('sessionTimeoutMinutes', parseInt(e.target.value, 10))}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
            >
              <option value={15}>15 Minutes (Strict Banking Standard)</option>
              <option value={30}>30 Minutes (Recommended)</option>
              <option value={60}>1 Hour</option>
              <option value={120}>2 Hours</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Inactive user sessions will be automatically revoked and prompted to sign in again.
            </span>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Max Failed Logins Before Lockout
            </label>
            <select
              value={formState.maxFailedLoginsBeforeLock}
              onChange={(e) => handleNumberChange('maxFailedLoginsBeforeLock', parseInt(e.target.value, 10))}
              className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
            >
              <option value={3}>3 Attempts (High Security)</option>
              <option value={5}>5 Attempts (Standard)</option>
              <option value={10}>10 Attempts</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Account automatically transitions to &quot;Suspended&quot; state upon exceeding threshold.
            </span>
          </div>
        </div>

        {/* Card 2: Password Complexity & 2FA */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <Lock size={16} className="text-[#F28C18]" />
            <h3 className="font-manrope font-bold text-sm text-[#062A5A]">
              Authentication &amp; Credentials
            </h3>
          </div>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block text-xs">
                Two-Factor Authentication (2FA)
              </span>
              <span className="text-[10px] text-slate-400">
                Enforce OTP verification for staff &amp; super administrators
              </span>
            </div>
            <input
              type="checkbox"
              checked={formState.enforceTwoFactor}
              onChange={() => handleToggle('enforceTwoFactor')}
              className="w-4 h-4 text-[#0969C7] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block text-xs">
                Password Complexity Standards
              </span>
              <span className="text-[10px] text-slate-400">
                Minimum 12 characters with uppercase, digit, and symbol
              </span>
            </div>
            <input
              type="checkbox"
              checked={formState.enforcePasswordComplexity}
              onChange={() => handleToggle('enforcePasswordComplexity')}
              className="w-4 h-4 text-[#0969C7] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 block text-xs">
                Login Notifications
              </span>
              <span className="text-[10px] text-slate-400">
                Notify admin when staff or client signs in from a new device/IP
              </span>
            </div>
            <input
              type="checkbox"
              checked={formState.notifyOnNewLogin}
              onChange={() => handleToggle('notifyOnNewLogin')}
              className="w-4 h-4 text-[#0969C7] rounded"
            />
          </label>
        </div>
      </div>

      {/* Emergency Global Session Revocation Card */}
      <div className="bg-red-50/70 p-5 sm:p-6 rounded-3xl border border-red-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={15} className="text-red-600" />
            <span className="font-manrope font-bold text-sm text-red-950">
              Emergency Firm-Wide Session Revocation
            </span>
          </div>
          <p className="text-xs text-red-800 max-w-xl">
            In the event of suspected credential compromise or routine regulatory audit rotation, instantly revoke all authenticated sessions across all client and staff browsers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogoutAllFirmSessions}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-2"
        >
          <LogOut size={14} />
          <span>Logout All Devices</span>
        </button>
      </div>

      {/* Prominent Save / Reset Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              updateSecurityConfig(formState);
              setHasChanges(false);
              onSuccessToast('✓ Changes saved successfully');
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#062A5A] font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Save size={13} className="text-[#0969C7]" />
            <span>Save &amp; Continue</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Save size={15} className="text-[#F28C18]" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Terminate All Sessions Confirmation Modal */}
      {confirmLogoutAllOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 text-left my-auto space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="font-manrope font-bold text-base text-[#062A5A]">
                  Terminate All Device Sessions?
                </h4>
                <p className="text-xs text-slate-500">
                  Firm-Wide Security Invalidation
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will immediately terminate all active browser and device sessions across all client and staff accounts. All portal users will be required to re-authenticate with their credentials.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmLogoutAllOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteLogoutAll}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                Confirm Terminate All
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
