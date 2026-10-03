import React from 'react';
import { useVault } from '../context/VaultContext';
import { VaultLoginScreen } from './ClientVault/VaultLoginScreen';
import { ClientVaultUnified } from './ClientVault/ClientVaultUnified';

interface ClientPortalProps {
  onBackToWebsite?: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ onBackToWebsite }) => {
  const { currentVaultUser, switchActiveUser, logoutVaultSession } = useVault();

  const handleBack = () => {
    if (onBackToWebsite) {
      onBackToWebsite();
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  if (!currentVaultUser) {
    return (
      <VaultLoginScreen
        onSuccessLogin={(user) => {
          switchActiveUser(user);
        }}
        onBackToWebsite={handleBack}
      />
    );
  }

  return (
    <ClientVaultUnified
      onLogout={() => {
        logoutVaultSession();
      }}
      onBackToWebsite={handleBack}
    />
  );
};
