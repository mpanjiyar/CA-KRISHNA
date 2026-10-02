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
  ChevronDown,
  X,
  Mail,
  Fingerprint,
  Cpu
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
  const [rememberMe, setRememberMe] = useState(true);
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

  // Forgot password modal
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // Demo accounts helper
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
    <div className="relative min-h-[92vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#030B17] text-left select-none">
      
      {/* 1. Futuristic Digital Grid & Ambient Ambient Glow Layer */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(9, 105, 199, 0.25), transparent 60%),
            radial-gradient(circle at 85% 80%, rgba(242, 140, 24, 0.12), transparent 45%),
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 48px 48px, 48px 48px'
        }}
      />

      {/* Floating subtle glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#0969C7]/20 via-[#062A5A]/30 to-[#159447]/10 rounded-full blur-[110px] pointer-events-none animate-pulse duration-1000" />

      {/* Outer Card Container */}
      <div className="relative z-10 w-full max-w-[480px]">
        
        {/* Top Header Badge & Logo Lockup */}
        <div className="text-center mb-7">
          
          {/* Subtle Security Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-slate-300 text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-inner mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <ShieldCheck size={13} className="text-emerald-400" />
            <span className="text-slate-200">256-Bit SSL/TLS &bull; Zero-Knowledge Perimeter</span>
          </div>

          {/* Logo with Animated Cyber Aura */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#0969C7] via-[#F28C18] to-[#159447] opacity-60 blur-md group-hover:opacity-100 transition duration-500" />
              <div className="relative w-16 h-16 rounded-2xl bg-[#061833] border border-white/20 p-3 text-white flex items-center justify-center shadow-2xl backdrop-blur-xl">
                <CaEmblem className="w-10 h-10 drop-shadow" />
              </div>
            </div>
          </div>

          <h1 className="font-manrope font-extrabold text-2xl sm:text-3xl text-white tracking-tight flex items-center justify-center gap-2">
            <span>Client Vault</span>
            <Lock size={18} className="text-[#F28C18]" />
          </h1>
          
          <p className="text-xs sm:text-[13px] text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Secure access to your projects, documents, and private files.
          </p>
        </div>

        {/* Futuristic Glass-Style Card */}
        <div className="bg-[#08152B]/90 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-slate-700/80 backdrop-blur-xl overflow-hidden relative">
          
          {/* Top Edge Neon Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-[#0969C7] via-[#F28C18] to-[#159447]" />

          <div className="p-6 sm:p-8">
            
            {/* Lockout Warning Banner */}
            {lockoutRemaining !== null && lockoutRemaining > 0 && (
              <div className="mb-5 p-4 rounded-2xl bg-rose-950/60 border border-rose-600/60 text-rose-200 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-bold text-rose-100">Security Lockout Active</p>
                  <p className="mt-0.5 text-rose-300">
                    Failed login limit exceeded. Please wait{' '}
                    <span className="font-mono font-bold text-white">{lockoutRemaining}s</span> before retrying.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message Banner */}
            {errorMessage && !lockoutRemaining && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle size={16} className="text-rose-400 shrink-0" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* 2FA Step */}
            {require2FA ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-[#0B2144]/80 border border-blue-500/30 rounded-2xl text-xs text-blue-200">
                  <div className="flex items-center gap-2 font-bold mb-1 text-white">
                    <KeyRound size={16} className="text-[#38BDF8]" />
                    <span>Two-Factor Authentication Required</span>
                  </div>
                  <p className="text-slate-300 text-[11.5px] leading-relaxed">
                    A cryptographic security code has been generated. Enter the 6-digit verification code to access your vault.
                  </p>
                  {demoOtp && (
                    <div className="mt-2.5 p-2 bg-[#051124] rounded-xl border border-blue-400/30 text-[11px] font-mono text-cyan-300 flex items-center justify-between">
                      <span>Verification Code: <strong className="text-white">{demoOtp}</strong></span>
                      <button
                        type="button"
                        onClick={() => setTwoFactorCode(demoOtp)}
                        className="text-[10px] text-cyan-400 font-bold hover:underline"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Enter 6-Digit Passcode
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.5em] font-mono font-bold text-2xl px-4 py-3 rounded-2xl border border-slate-700 focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20 bg-[#051124] text-white shadow-inner"
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
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || twoFactorCode.length < 6}
                    className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#0969C7] to-[#159447] hover:brightness-110 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Verifying...' : 'Authorize Vault Entry'}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            ) : (
              /* Main Credentials Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Username Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Username or Registered Email
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
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20 bg-[#040C1A] text-white placeholder-slate-500 shadow-inner transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[11px] text-[#38BDF8] hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
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
                      className="w-full pl-10 pr-11 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#38BDF8]/20 bg-[#040C1A] text-white placeholder-slate-500 shadow-inner transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-[#040C1A] text-[#0969C7] focus:ring-0 focus:ring-offset-0"
                    />
                    <span>Remember this secure device</span>
                  </label>
                  
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Cpu size={11} className="text-slate-500" />
                    PBKDF2 Salted
                  </span>
                </div>

                {/* Futuristic Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || (lockoutRemaining !== null && lockoutRemaining > 0)}
                  className="w-full mt-3 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#0969C7] via-[#062A5A] to-[#0969C7] hover:brightness-110 active:scale-[0.99] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(9,105,199,0.35)] border border-blue-400/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 min-h-[46px]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Cryptographic Credentials...</span>
                    </div>
                  ) : (
                    <>
                      <Lock size={15} className="text-[#38BDF8]" />
                      <span>Authenticate &amp; Enter Client Vault</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Credentials Panel for Effortless Testing */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors py-1"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#F28C18]" />
                  <span>Quick Test Accounts (Admin &bull; Staff &bull; Client)</span>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${showDemoAccounts ? 'rotate-180' : ''}`}
                />
              </button>

              {showDemoAccounts && (
                <div className="mt-3 space-y-2 text-xs">
                  {/* Super Admin */}
                  <div className="p-2.5 rounded-xl bg-[#040C1A] hover:bg-[#071630] border border-slate-800 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#0969C7] text-white">ADMIN</span>
                        <span className="font-semibold text-slate-200 text-[11px] truncate">CA Krishna Panjiyar</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        User: <strong className="text-slate-200">admin.krishna</strong> &bull; Pass: <strong className="text-slate-200">Admin@Vault2026!</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('admin.krishna', 'Admin@Vault2026!')}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#0969C7] hover:text-white text-slate-300 text-[10.5px] font-bold border border-slate-700 transition-colors"
                    >
                      Fill
                    </button>
                  </div>

                  {/* Staff Member */}
                  <div className="p-2.5 rounded-xl bg-[#040C1A] hover:bg-[#071630] border border-slate-800 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-blue-700 text-white">STAFF</span>
                        <span className="font-semibold text-slate-200 text-[11px] truncate">CA Sneha Mehta (Audit Lead)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        User: <strong className="text-slate-200">sneha.ca</strong> &bull; Pass: <strong className="text-slate-200">Staff@Vault2026!</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('sneha.ca', 'Staff@Vault2026!')}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#0969C7] hover:text-white text-slate-300 text-[10.5px] font-bold border border-slate-700 transition-colors"
                    >
                      Fill
                    </button>
                  </div>

                  {/* Corporate Client */}
                  <div className="p-2.5 rounded-xl bg-[#040C1A] hover:bg-[#071630] border border-slate-800 transition-colors flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#159447] text-white">CLIENT</span>
                        <span className="font-semibold text-slate-200 text-[11px] truncate">Rajesh Singhal (Apex Precision)</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                        User: <strong className="text-slate-200">apex.singhal</strong> &bull; Pass: <strong className="text-slate-200">Client@Vault2026!</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => fillQuickCredentials('apex.singhal', 'Client@Vault2026!')}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#0969C7] hover:text-white text-slate-300 text-[10.5px] font-bold border border-slate-700 transition-colors"
                    >
                      Fill
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Futuristic Bottom Status Strip */}
          <div className="bg-[#040A14] px-6 py-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Fingerprint size={13} className="text-[#38BDF8]" />
              Isolated Client-Perimeter Active
            </span>
            <span className="text-slate-500 font-mono text-[10px]">
              PANJIYAR CA &bull; 2026
            </span>
          </div>
        </div>

        {/* Security Bottom Notice */}
        <div className="text-center mt-6 text-[11.5px] text-slate-400 space-y-1">
          <p>
            Confidential repository protected under Section 43/66 of the Information Technology Act.
          </p>
          <p className="text-slate-500 text-[10.5px]">
            Need credentials or assistance? Contact firm administrator at{' '}
            <span className="text-slate-300 font-semibold">cakrishanpanjiyar@gmail.com</span>
          </p>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#08152B] rounded-3xl shadow-2xl border border-slate-700 max-w-md w-full p-6 text-left relative text-white">
            <button
              onClick={() => setIsForgotPasswordOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="text-[#38BDF8] w-5 h-5" />
              <h3 className="font-manrope font-bold text-lg text-white">
                Password Reset Assistance
              </h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              To maintain strict statutory confidentiality and protect privileged financial documents, Client Vault passwords cannot be reset through automated external links.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#040C1A] border border-slate-800 text-xs space-y-2 mb-4">
              <p className="font-bold text-slate-200">How to reset your access:</p>
              <ol className="list-decimal list-inside text-slate-400 space-y-1 text-[11.5px]">
                <li>Contact your dedicated CA audit manager or firm administrator.</li>
                <li>Your identity will be verified against registered KYC records.</li>
                <li>An encrypted temporary passcode will be generated and issued securely.</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href="mailto:cakrishanpanjiyar@gmail.com?subject=Client%20Vault%20Password%20Reset%20Request"
                className="px-4 py-2 rounded-xl bg-[#0969C7] hover:bg-[#07539e] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Mail size={13} />
                <span>Email Administrator</span>
              </a>

              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
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
