import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Briefcase, 
  UserCheck, 
  Fingerprint,
  RefreshCw,
  X
} from 'lucide-react';
import { useVaultAuth } from '../context/VaultAuthContext';
import { CaEmblem } from './CaLogo';

export const VaultLoginPortal: React.FC = () => {
  const { 
    login, 
    verify2FA, 
    cancel2FA, 
    is2FARequired, 
    pending2FAUser, 
    sessionExpiredNotice, 
    dismissSessionExpiredNotice, 
    requestPasswordReset, 
    quickFillDemo 
  } = useVaultAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetInput, setResetInput] = useState('');
  const [resetFeedback, setResetFeedback] = useState<{ success: boolean; msg: string; tempPass?: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await login(username, password);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to authenticate.');
      }
    } catch {
      setErrorMsg('An unexpected security error occurred during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      const res = await verify2FA(twoFactorCode);
      if (!res.success) {
        setErrorMsg(res.error || 'Invalid 2FA security code.');
      }
    } catch {
      setErrorMsg('Error verifying two-factor authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyQuickDemo = (role: 'admin' | 'staff' | 'client') => {
    const creds = quickFillDemo(role);
    setUsername(creds.username);
    setPassword(creds.password);
    setErrorMsg(null);
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetInput.trim()) return;
    const res = await requestPasswordReset(resetInput);
    setResetFeedback({
      success: res.success,
      msg: res.message,
      tempPass: res.tempPass
    });
  };

  return (
    <div className="min-h-[85vh] py-8 sm:py-16 px-3.5 sm:px-6 bg-gradient-to-b from-[#F7F9FC] via-white to-[#EEF5FC] flex flex-col items-center justify-center relative overflow-hidden font-inter">
      {/* Background architectural glow */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#0969C7]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#F28C18]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Inactivity Expiry Notice */}
      {sessionExpiredNotice && (
        <div className="max-w-md w-full mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center justify-between shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={15} className="text-amber-600 shrink-0" />
            <span>Session expired due to 30 minutes of inactivity. Please re-authenticate.</span>
          </div>
          <button onClick={dismissSessionExpiredNotice} className="p-1 hover:text-amber-900">
            <X size={13} />
          </button>
        </div>
      )}

      {/* Main Glass Vault Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#D9E2EC] p-6 sm:p-8 relative z-10 text-left">
        
        {/* Top Brand & Security Lockup */}
        <div className="flex flex-col items-center text-center pb-5 mb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] p-2.5 shadow-md flex items-center justify-center mb-3 text-white">
            <Lock className="w-7 h-7 text-[#F28C18]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10.5px] font-semibold mb-1.5">
            <ShieldCheck size={13} className="text-emerald-600" />
            <span>Encrypted Data Sandbox &middot; 256-bit AES</span>
          </div>

          <h2 className="font-manrope text-xl sm:text-2xl font-bold text-[#062A5A] tracking-tight">
            Client Vault Access
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            PANJIYAR KRISHNA &amp; CO. &middot; Confidential Portal
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-500" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* View A: 2FA Verification Challenge */}
        {is2FARequired && pending2FAUser ? (
          <form onSubmit={handle2FASubmit} className="space-y-4 animate-in fade-in">
            <div className="p-3 bg-[#EEF5FC] rounded-2xl border border-[#D9E2EC] text-xs text-[#062A5A]">
              <div className="flex items-center gap-2 font-bold mb-1">
                <Fingerprint size={16} className="text-[#0969C7]" />
                <span>Two-Factor Authentication Required</span>
              </div>
              <p className="text-slate-600 text-[11.5px] leading-relaxed">
                Enter the 6-digit security code from your authenticator device for <strong>{pending2FAUser.fullName}</strong>.
              </p>
              <div className="mt-2 text-[10.5px] font-mono bg-white px-2 py-1 rounded border border-slate-200 inline-block text-slate-500">
                Demo Test Code: <span className="text-[#0969C7] font-bold">123456</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                6-Digit Security Token
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-[0.3em] font-mono text-lg font-bold py-2.5 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0969C7] bg-white"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <>
                    <span>Verify &amp; Enter Vault</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={cancel2FA}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel &amp; Back to Login
              </button>
            </div>
          </form>
        ) : (
          /* View B: Standard Credentials Login */
          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username or Corporate Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin.krishna or user@company.com"
                  className="w-full text-xs py-2.5 pl-9 pr-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0969C7] bg-white"
                />
                <User size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Secure Password
                </label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[11px] font-semibold text-[#0969C7] hover:underline"
                >
                  Forgot Key?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs py-2.5 pl-9 pr-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0969C7] bg-white font-mono"
                />
                <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 mt-1"
            >
              {isSubmitting ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <>
                  <KeyRound size={15} className="text-[#F28C18]" />
                  <span>Authenticate &amp; Open Vault</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Quick-Credential Roles Selector for Demonstration & Evaluation */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10.5px] uppercase tracking-wider font-bold text-slate-400">
              Instant Account Test Fill
            </span>
            <span className="text-[10px] text-[#0969C7] font-semibold flex items-center gap-1">
              <Sparkles size={11} /> 3 Distinct Roles
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyQuickDemo('admin')}
              className="p-2 rounded-xl border border-slate-200 hover:border-[#062A5A] hover:bg-[#EEF5FC] text-left transition-colors group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#062A5A] group-hover:text-[#0969C7]">
                <Building2 size={12} className="text-[#F28C18] shrink-0" />
                <span>Admin</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">Full Rights</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyQuickDemo('staff')}
              className="p-2 rounded-xl border border-slate-200 hover:border-[#0969C7] hover:bg-[#EEF5FC] text-left transition-colors group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#062A5A] group-hover:text-[#0969C7]">
                <Briefcase size={12} className="text-[#0969C7] shrink-0" />
                <span>Staff CA</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">Assigned Clients</span>
            </button>

            <button
              type="button"
              onClick={() => handleApplyQuickDemo('client')}
              className="p-2 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-left transition-colors group"
            >
              <div className="flex items-center gap-1 text-[11px] font-bold text-[#062A5A] group-hover:text-emerald-700">
                <UserCheck size={12} className="text-[#159447] shrink-0" />
                <span>Client</span>
              </div>
              <span className="text-[9px] text-slate-400 block truncate">Apex Precision</span>
            </button>
          </div>
        </div>

        {/* Regulatory footer note */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <span>Protected under ICAI IT Security Guidelines</span>
          <span className="font-mono text-emerald-600 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Live Vault Sentinel
          </span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-left relative animate-in zoom-in-95">
            <button
              onClick={() => {
                setResetModalOpen(false);
                setResetFeedback(null);
                setResetInput('');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-5 h-5 text-[#F28C18]" />
              <h3 className="font-manrope font-bold text-lg text-[#062A5A]">
                Vault Credential Recovery
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Enter your registered username or email to verify identity and issue a secure temporary access key.
            </p>

            {resetFeedback ? (
              <div className="space-y-4">
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  resetFeedback.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  <p>{resetFeedback.msg}</p>
                  {resetFeedback.tempPass && (
                    <div className="mt-2.5 p-2 bg-white rounded-lg border border-emerald-300 font-mono text-sm font-bold text-[#062A5A] select-all">
                      Temporary Key: <span className="text-[#0969C7]">{resetFeedback.tempPass}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (resetFeedback.tempPass) {
                      setPassword(resetFeedback.tempPass);
                    }
                    setResetModalOpen(false);
                    setResetFeedback(null);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#062A5A] text-white text-xs font-semibold"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username or Registered Email
                  </label>
                  <input
                    type="text"
                    required
                    value={resetInput}
                    onChange={(e) => setResetInput(e.target.value)}
                    placeholder="e.g. apex.singhal"
                    className="w-full text-xs py-2 px-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969C7]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#062A5A] text-white text-xs font-bold"
                  >
                    Generate Reset Key
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
