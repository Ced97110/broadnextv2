
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/navbar';





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

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang='en'>
     <body className={`${barlow.variable} flex min-h-screen w-full flex-col bg-secondary text-black `}>
       <Navbar/>
        {children}
      </body>
      <Analytics />
    </html>
  );
}