import React from 'react';
import { useCms } from '../context/CmsContext';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminLogin } from '../components/admin/AdminLogin';

export const AdminPage: React.FC = () => {
  const { adminUser } = useCms();

  if (adminUser) {
    return <AdminDashboard />;
  }

  return <AdminLogin />;
};
