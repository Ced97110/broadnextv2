'use client'

import Dashboard from '@/components/base-layout';
import { Analytics } from '@vercel/analytics/react';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';

export default function DashLayout({
  children
}: {
  children: React.ReactNode;
}) {



  return (
    <html lang='en'>
       <UserProvider>
        <body className={`font-sans flex min-h-screen w-full flex-col bg-secondary `}>
        <Dashboard>
           {children}
        </Dashboard>
      </body>
      <Analytics />
      </UserProvider>
    </html>
  );
}