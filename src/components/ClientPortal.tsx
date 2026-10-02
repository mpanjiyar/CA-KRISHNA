import React from 'react';
import { useVaultAuth } from '../context/VaultAuthContext';
import { VaultLogin } from './ClientVault/VaultLogin';
import { ClientVaultContainer } from './ClientVault/ClientVaultContainer';
import { ShieldCheck, Lock } from 'lucide-react';
import { CaEmblem } from './CaLogo';

export const ClientPortal: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useVaultAuth();

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 bg-[#F7F9FC]">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#062A5A] to-[#0969C7] p-3 text-white flex items-center justify-center shadow-lg mb-4 animate-pulse">
          <CaEmblem className="w-10 h-10" />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#062A5A] uppercase tracking-widest mb-1">
          <Lock size={14} className="text-[#F28C18]" />
          <span>Encrypted Session Verification</span>
        </div>
        <p className="text-xs text-slate-500 max-w-xs text-center">
          Validating cryptographic session token and access permissions...
        </p>
      </div>
    );
  }

  // Enforce zero-access without successful authentication
  if (!isAuthenticated || !user) {
    return <VaultLogin />;
  }

  return (
    <div className="w-full bg-[#F7F9FC] min-h-screen py-6 sm:py-8 px-3 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-7xl mx-auto">
        <ClientVaultContainer />
      </div>
    </div>
  );
};
