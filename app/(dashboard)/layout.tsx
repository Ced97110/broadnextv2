'use client'


import { Analytics } from '@vercel/analytics/react';
import { UserProvider, useUser } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';
import { Header } from './header';
import Script from 'next/script';



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

  const { user, error, isLoading } = useUser();

  


 return (
    <html lang='en' className={barlow.variable}>
      <UserProvider>
      <body className={`flex min-h-screen w-full flex-col bg-secondary ${barlow.className}`}>
        <Header />
        {children}
      </body>
      <Analytics />
      <Script type="text/javascript">
        {`window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","identifyHashed","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
          heap.load("1884442793")
          heap.identify("${user?.email}")`}
      </Script>
    </UserProvider>
  </html>
 )
    
}