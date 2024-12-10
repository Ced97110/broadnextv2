


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
      <Script type="text/javascript" strategy="lazyOnload">
        {`window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","identifyHashed","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
          heap.load("1884442793")
          heap.identify("${user?.sub}")
           heap.addUserProperties({
           Name: "${user?.name}",
          Email: "${user?.email}",
           })`}
      </Script>
    </UserProvider>
  </html>
 )
    
}