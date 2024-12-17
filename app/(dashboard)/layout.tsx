


import { Analytics } from '@vercel/analytics/react';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';
import { ToastContainer, Zoom } from 'react-toastify';
import Header from '@/components/header';




const barlow = Barlow({
  subsets: ['latin'], // Specify the subsets you need
  weight: ['300', '400', '500', '600', '700'], // Specify the weights you want to use
  style: ['normal', 'italic'], // Specify the styles if needed
  variable: '--font-barlow', // Optional: Define a CSS variable for the font
});

export default async function DashLayout({
  children
}: {
  children: React.ReactNode;
}) {


   
  const session = await getSession();

  if (!session || !session.user) {
    // Handle unauthenticated user
    // For example, you can redirect to the login page
    // or render a message prompting the user to log in

    // Example: Redirecting to login
    redirect('/api/auth/me');

    // Alternatively, render a message
    // return <p>Please log in to access the dashboard.</p>;
  }

 return (
    <html lang='en' className={barlow.variable}>
      <UserProvider>
      <body className={`flex min-h-screen w-full flex-col bg-secondary ${barlow.className}`}>
        <Header />
        {children}
        <ToastContainer  />
      </body>
      <Analytics />
    </UserProvider>
  </html>
 )
    
}