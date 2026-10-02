import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  User,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Briefcase,
  HelpCircle,
  Clock,
  ChevronDown
} from 'lucide-react';
import { useVaultAuth } from '../../context/VaultAuthContext';
import { CaEmblem } from '../CaLogo';

interface VaultLoginProps {
  onSuccess?: () => void;
}

export const VaultLogin: React.FC<VaultLoginProps> = ({ onSuccess }) => {
  const { login } = useVaultAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 2FA state
  const [require2FA, setRequire2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [maskedEmail, setMaskedEmail] = useState<string>('');
  const [demoOtp, setDemoOtp] = useState<string | null>(null);

  // Lockout state
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);

  // Demo accounts helper accordion
  const [showDemoAccounts, setShowDemoAccounts] = useState(true);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining === null || lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setErrorMessage(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both your username and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await login(
      username.trim(),
      password,
      require2FA ? twoFactorCode.trim() : undefined,
      tempToken || undefined
    );

    setIsSubmitting(false);

    if (res.locked && res.remainingSeconds) {
      setLockoutRemaining(res.remainingSeconds);
      setErrorMessage(res.error || 'Account temporarily locked.');
      return;
    }

    if (res.require2FA) {
      setRequire2FA(true);
      setTempToken(res.tempToken || null);
      setMaskedEmail(res.maskedEmail || 'registered email');
      setDemoOtp(res.demoOtp || null);
      if (res.demoOtp) {
        setTwoFactorCode(res.demoOtp);
      }
      return;
    }

    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials. Please verify and try again.');
      return;
    }

    // Success!
    if (onSuccess) onSuccess();
  };

  const fillQuickCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
    setRequire2FA(false);
    setTempToken(null);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F7F9FC] via-[#EEF5FC]/60 to-[#F7F9FC] text-left">
      
      {/* Outer Max Width Container */}
      <div className="w-full max-w-xl">
        
        {/* Top Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-2xs mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>256-Bit SSL/TLS &bull; End-to-End Encrypted Gateway</span>
          </div>

          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] p-2.5 shadow-md text-white flex items-center justify-center">
              <CaEmblem className="w-9 h-9" />
            </div>
          </div>

          <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-[#062A5A] tracking-tight">
            Client Vault Access Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            PANJIYAR KRISHNA &amp; CO. &bull; Chartered Accountants
            <br />
            Sign in to access your confidential tax filings, statutory audits, and financial dossiers.
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative">
          <div className="h-1.5 w-full bg-gradient-to-r from-[#062A5A] via-[#0969C7] to-[#F28C18]" />

          <div className="p-6 sm:p-8">
            
            {/* Lockout Warning Banner */}
            {lockoutRemaining !== null && lockoutRemaining > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold">Account Temporarily Locked</p>
                  <p className="mt-0.5 text-red-700">
                    Failed login limit exceeded. Security lockout active for another{' '}
                    <span className="font-mono font-bold text-red-900">{lockoutRemaining} seconds</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && !lockoutRemaining && (
              <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* Two-Factor Authentication Step */}
            {require2FA ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <KeyRound size={16} className="text-[#0969C7]" />
                    <span>Two-Factor Authentication Required</span>
                  </div>
                  <p className="text-blue-700 text-[11.5px] leading-relaxed">
                    A 6-digit verification code has been generated for your account. Please enter it below to complete sign-in.
                  </p>
                  {demoOtp && (
                    <div className="mt-2.5 p-2 bg-white rounded-xl border border-blue-200 text-[11px] font-mono text-[#062A5A] flex items-center justify-between">
                      <span>Verification Code: <strong>{demoOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => setTwoFactorCode(demoOtp)}
                        className="text-[10px] text-[#0969C7] font-bold hover:underline"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Enter 6-Digit Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] font-mono font-bold text-xl px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0969C7] bg-white shadow-2xs"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRequire2FA(false);
                      setTwoFactorCode('');
                      setTempToken(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || twoFactorCode.length < 6}
                    className="flex-2 py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Enter Vault'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            ) : (
              /* Standard Credentials Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Account Username or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin.krishna, sneha.ca, or apex.singhal"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0969C7] bg-white shadow-2xs transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <span className="text-[11px] text-slate-400 font-medium">
                      PBKDF2 Salted Encryption
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0969C7] bg-white shadow-2xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit Sign-in Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (lockoutRemaining !== null && lockoutRemaining > 0)}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#062A5A] to-[#0969C7] hover:from-[#031C3D] hover:to-[#062A5A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] min-h-[44px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating Encrypted Session...</span>
                    </div>
                  ) : (
                    <>
                      <Lock size={15} />
                      <span>Sign In to Secure Vault</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Panel for Effortless Testing */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-[#0969C7] transition-colors py-1"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#F28C18]" />
                  <span>Sample Login Credentials for Testing</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${showDemoAccounts ? 'rotate-180' : ''}`}
                />
              </button>

              {showDemoAccounts && (
                <div className="mt-3 space-y-2 text-xs">
                  {/* Super Admin */}
                  <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EEF5FC] border border-slate-200/80 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#062A5A] text-white">ADMIN</span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate">CA Krishna Panjiyar</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        User: <strong className="text-slate-700">admin.krishna</strong> &bull; Pass: <strong className="text-slate-700">Admin@Vault2026!</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('admin.krishna', 'Admin@Vault2026!')}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0969C7] hover:text-[#0969C7] text-[10.5px] font-bold shadow-2xs"
                    >
                      Fill
                    </button>
                  </div>

                  {/* Staff Member */}
                  <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EEF5FC] border border-slate-200/80 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#0969C7] text-white">STAFF</span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate">CA Sneha Mehta (Audit Lead)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        User: <strong className="text-slate-700">sneha.ca</strong> &bull; Pass: <strong className="text-slate-700">Staff@Vault2026!</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('sneha.ca', 'Staff@Vault2026!')}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0969C7] hover:text-[#0969C7] text-[10.5px] font-bold shadow-2xs"
                    >
                      Fill
                    </button>
                  </div>

                  {/* Corporate Client */}
                  <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-[#EEF5FC] border border-slate-200/80 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#159447] text-white">CLIENT</span>
                        <span className="font-semibold text-slate-800 text-[11px] truncate">Rajesh Singhal (Apex Precision)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                        User: <strong className="text-slate-700">apex.singhal</strong> &bull; Pass: <strong className="text-slate-700">Client@Vault2026!</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('apex.singhal', 'Client@Vault2026!')}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0969C7] hover:text-[#0969C7] text-[10.5px] font-bold shadow-2xs"
                    >
                      Fill
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Card Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              Auto-lock &amp; Session Invalidation Active
            </span>
            <span className="text-slate-400">
              ICAI Standard Practice 2026
            </span>
          </div>
        </div>

        {/* Security Bottom Notice */}
        <div className="text-center mt-6 text-[11.5px] text-slate-500 space-y-1">
          <p>
            Confidential repository protected under ICAI Code of Ethics and Information Technology Act.
          </p>
          <p className="text-slate-400 text-[10.5px]">
            Need vault credentials or password assistance? Contact firm administrator at{' '}
            <span className="font-semibold text-slate-600">cakrishanpanjiyar@gmail.com</span>
          </p>
        </div>

      </div>

    </div>
  );
};
