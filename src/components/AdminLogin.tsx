import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowLeft, 
  Building2, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { OfficialFirmLogo } from './CaLogo';
import { useFirmData } from '../context/FirmDataContext';

interface AdminLoginProps {
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToWebsite }) => {
  const { login } = useAdminAuth();
  const { firmDetails } = useFirmData();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const success = login(password);
      if (!success) {
        setError('Invalid administrator password. Please verify and try again.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031C3D] via-[#062A5A] to-[#0A3D78] flex flex-col justify-between text-white relative overflow-hidden select-none p-4 sm:p-6 lg:p-8">
      {/* Background Decorative Ambient Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0969C7]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F28C18]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Back Link */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft size={16} />
          <span>Back to Main Website</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck size={16} className="text-[#159447]" />
          <span className="hidden sm:inline">256-bit Encrypted Admin Session</span>
        </div>
      </header>

      {/* Central Login Card */}
      <main className="max-w-md w-full mx-auto my-auto z-10 py-8">
        <div className="bg-white/95 backdrop-blur-md text-[#172033] rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
          {/* Top Brand Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#062A5A] via-[#0969C7] to-[#F28C18]" />

          {/* Firm Logo & Title */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-[#062A5A] p-2.5 shadow-md mb-3 flex items-center justify-center">
              <OfficialFirmLogo sizePx={44} />
            </div>

            <span className="font-brand font-bold text-lg text-[#062A5A]">
              {firmDetails.name}
            </span>
            <span className="text-[11px] font-semibold text-[#0969C7] tracking-wider uppercase mb-1">
              Central Administration Console
            </span>
            <p className="text-xs text-slate-500 max-w-xs">
              Authorized managing partner and administrator access only.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between"
              >
                <span>Master Admin Password</span>
                <span className="text-[11px] text-[#0969C7] font-normal flex items-center gap-1">
                  <KeyRound size={12} />
                  Required
                </span>
              </label>

              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full text-sm px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0969C7] focus:border-transparent transition-all pr-11 bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full py-3 px-4 rounded-xl bg-[#062A5A] hover:bg-[#031C3D] disabled:opacity-50 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Authenticate &amp; Access Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
            <Lock size={12} />
            <span>Protected under Indian Information Technology Act (Sec 43A)</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400 z-10">
        &copy; {new Date().getFullYear()} {firmDetails.name} &middot; All Rights Reserved.
      </footer>
    </div>
  );
};
