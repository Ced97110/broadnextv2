import Dashboard from '@/components/base-layout';
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['400', '700'], // Define the weights you need
  variable: '--font-barlow', // Define the CSS variable for easy access
});

export const metadata = {
  title: 'Broadwalk',
  description:
    'Broadwalk is a platform that provides insights into the financial health of companies.',
};

export default function DashLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <UserProvider>
        <body className={`${barlow.variable} font-sans flex min-h-screen w-full flex-col bg-secondary `}>
        <Dashboard>
           {children}
        </Dashboard>
      </body>
      <Analytics />
      </UserProvider>
    </html>
  );
}