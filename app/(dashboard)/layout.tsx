


import { Analytics } from '@vercel/analytics/react';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';
import { Header } from './header';
import Script from 'next/script';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { redirect } from 'next/navigation';




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

  const { user } = session;


 return (
    <html lang='en' className={barlow.variable}>
      <UserProvider>
      <body className={`flex min-h-screen w-full flex-col bg-secondary ${barlow.className}`}>
        <Header />
        {children}
      </body>
      <Analytics />
    </UserProvider>
  </html>
 )
    
}