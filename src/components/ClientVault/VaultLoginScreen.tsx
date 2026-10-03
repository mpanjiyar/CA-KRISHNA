import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Key,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Smartphone,
  Shield,
  Layers,
  Fingerprint
} from 'lucide-react';
import { useVault } from '../../context/VaultContext';
import { VaultUser } from '../../types/vault';
import { calculatePasswordStrength } from '../../lib/vaultCrypto';

interface VaultLoginScreenProps {
  onSuccessLogin?: (user: VaultUser) => void;
  onBackToWebsite?: () => void;
}

export const VaultLoginScreen: React.FC<VaultLoginScreenProps> = ({
  onSuccessLogin,
  onBackToWebsite
}) => {
  const { users, loginWithCredentials, switchActiveUser } = useVault();

  const [username, setUsername] = useState('apex.singhal');
  const [password, setPassword] = useState('ApexSecure#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDemoUser, setSelectedDemoUser] = useState<VaultUser | null>(null);

  // Quick 1-click test drive profiles
  const demoProfiles = [
    {
      title: 'Managing Partner (Admin)',
      roleBadge: 'Super Admin',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      user: users.find((u) => u.accountType === 'super_admin') || users[0],
      desc: 'Full unconstrained governance, multi-tenant switcher, and security policies.'
    },
    {
      title: 'Senior Audit Manager',
      roleBadge: 'Senior Staff CA',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      user: users.find((u) => u.accountType === 'staff') || users[1],
      desc: 'Reviews audit working papers and reconciliations across assigned clients.'
    },
    {
      title: 'Apex Precision Engineering',
      roleBadge: 'Enterprise Client',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      user: users.find((u) => u.id === 'USR-CL-101') || users[2],
      desc: 'Isolated client vault: ITR filings, GST reconciliations, signed balance sheets.'
    },
    {
      title: 'Nexus BioPharma Solutions',
      roleBadge: 'Biotech Client',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      user: users.find((u) => u.id === 'USR-CL-102') || users[3],
      desc: 'High-security clinical trial NDA repository with encrypted audit trail.'
    }
  ];

  const handleSelectDemo = (user: VaultUser) => {
    setSelectedDemoUser(user);
    setUsername(user.username);
    setPassword(`${user.company.split(' ')[0]}#2026`);
    setErrorMsg(null);
  };

  const handleQuickLoginAs = async (user: VaultUser) => {
    setIsLoading(true);
    setErrorMsg(null);
    setTimeout(() => {
      switchActiveUser(user);
      setIsLoading(false);
      if (onSuccessLogin) onSuccessLogin(user);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both your vault ID and secure passphrase.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const result = await loginWithCredentials(username, password);
    setIsLoading(false);

    if (result.success && result.user) {
      if (onSuccessLogin) onSuccessLogin(result.user);
    } else {
      setErrorMsg(result.error || 'Authentication challenge failed. Please check credentials.');
    }
  };

  const strength = calculatePasswordStrength(password);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#F7F9FC] animate-vault-fade">
      <div className="w-full max-w-4xl space-y-6">

        {/* Top Bar with Return link */}
        <div className="flex items-center justify-between">
          {onBackToWebsite && (
            <button
              type="button"
              onClick={onBackToWebsite}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-[#062A5A] font-semibold text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Firm Website</span>
            </button>
          )}

          <div className="text-[11px] font-mono text-slate-400 ml-auto flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#159447]" />
            <span>ICAI Empanelled &middot; Encrypted Vault</span>
          </div>
        </div>
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#062A5A]/5 border border-[#062A5A]/10 text-xs font-semibold text-[#062A5A]">
            <Lock size={13} className="text-[#159447]" />
            <span>Zero-Knowledge Cryptographic Enclave &middot; AES-256-GCM</span>
          </div>

          <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#062A5A] tracking-tight">
            Client Vault &middot; Secure Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            PANJIYAR KRISHNA &amp; CO. Chartered Accountants &middot; End-to-end encrypted repository for statutory audit papers, tax filings, and confidential corporate mandates.
          </p>
        </div>

        {/* Main Grid: Sign In Form + 1-Click Role Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Form Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-7 text-left space-y-5">
            <div>
              <h2 className="font-manrope font-bold text-lg text-[#062A5A] flex items-center gap-2">
                <Fingerprint size={20} className="text-[#0969C7]" />
                <span>Sign In with Vault Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Passwords verified via PBKDF2 with 100,000 SHA-256 iterations.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
                <span className="leading-snug">{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Vault ID or Email
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. apex.singhal or email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7] outline-hidden min-h-[44px] transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Master Passphrase
                  </label>
                  <span className="text-[10px] text-[#0969C7] font-semibold hover:underline cursor-pointer">
                    Forgot key?
                  </span>
                </div>
                <div className="relative">
                  <Key size={15} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter cryptographic passphrase"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:border-[#0969C7] focus:ring-1 focus:ring-[#0969C7] outline-hidden min-h-[44px] transition-all bg-slate-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-medium">Cipher Strength:</span>
                      <span className="font-bold text-slate-700">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded text-[#062A5A] focus:ring-[#0969C7] h-4 w-4 border-slate-300"
                  />
                  <span className="text-xs text-slate-600">Hardware token remember</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 min-h-[46px] disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying SHA-256 Digest...</span>
                  </span>
                ) : (
                  <>
                    <Lock size={15} className="text-[#F28C18]" />
                    <span>Authenticate Session</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-[#159447]" />
                <span>TLS 1.3 Strict</span>
              </span>
              <span>ICAI &middot; Sec 43A IT Act</span>
            </div>
          </div>

          {/* Quick 1-Click Role Switcher Demo Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-manrope font-bold text-sm sm:text-base text-[#062A5A] flex items-center gap-2">
                    <Sparkles size={16} className="text-[#F28C18]" />
                    <span>Instant 1-Click Role Simulation</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Test the complete Client Vault from different identity viewpoints with strict authorization scoping.
                  </p>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold hidden sm:inline-block">
                  Live RBAC
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {demoProfiles.map((p, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between hover:border-[#0969C7] hover:shadow-md cursor-pointer ${
                      selectedDemoUser?.id === p.user.id
                        ? 'border-[#0969C7] bg-[#EEF5FC]/50 shadow-xs ring-1 ring-[#0969C7]'
                        : 'border-slate-200 bg-white hover:bg-slate-50/50'
                    }`}
                    onClick={() => handleSelectDemo(p.user)}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1.5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${p.badgeColor}`}>
                          {p.roleBadge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {p.user.username}
                        </span>
                      </div>

                      <div className="font-manrope font-bold text-xs sm:text-sm text-[#062A5A] truncate">
                        {p.user.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mb-1">
                        {p.user.company}
                      </div>
                      <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
                        {p.desc}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        {p.user.accountType === 'client' ? 'Isolated Vault' : 'Multi-Client Desk'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLoginAs(p.user);
                        }}
                        disabled={isLoading}
                        className="px-2.5 py-1 rounded-lg bg-[#062A5A] hover:bg-[#031C3D] text-white text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <span>Enter &rarr;</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invariant Trust Markers Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-[#062A5A]">AES-256 GCM</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Payload Encryption</div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-[#159447]">100% Invariants</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero Data Leaks</div>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                <div className="text-xs font-bold text-[#0969C7]">SHA-256 Ledger</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Immutable Hashes</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
