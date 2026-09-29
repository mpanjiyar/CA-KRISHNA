import React from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminRouteProps {
  onBackToWebsite: () => void;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ onBackToWebsite }) => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin onBackToWebsite={onBackToWebsite} />;
  }

  return <AdminDashboard onBackToWebsite={onBackToWebsite} />;
};
