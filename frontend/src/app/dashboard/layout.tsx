import React from 'react';
import { ClientDashboardWrapper } from '@/components/providers/client-dashboard-wrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientDashboardWrapper>
      {children}
    </ClientDashboardWrapper>
  );
}
