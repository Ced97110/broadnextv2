'use client'

import Dashboard from '@/components/base-layout';
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';


const barlow = Barlow({
  subsets: ['latin'], // Specify the subsets you need
  weight: ['300', '400', '500', '600', '700'], // Specify the weights you want to use
  style: ['normal', 'italic'], // Specify the styles if needed
  variable: '--font-barlow', // Optional: Define a CSS variable for the font
});

export default function DashLayout({
  children
}: {
  children: React.ReactNode;
}) {

 return (
    <html lang='en' className={barlow.variable}>
      <UserProvider>
      <body className={`flex min-h-screen w-full flex-col bg-secondary ${barlow.className}`}>
        <Dashboard>
       
            {children}
      
        </Dashboard>
      </body>
      <Analytics />
    </UserProvider>
  </html>
 )
    
}