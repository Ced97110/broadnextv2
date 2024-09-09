import Dashboard from '@/components/base-layout';
import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from '@auth0/nextjs-auth0/client';

export const metadata = {
  title: 'Broadwalk',
  description:
    'Broadwalk is a platform that provides insights into the financial health of companies.',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <UserProvider>
      <body className="flex min-h-screen w-full flex-col">
        <Dashboard>
           {children}
        </Dashboard>
      </body>
      <Analytics />
      </UserProvider>
    </html>
  );
}