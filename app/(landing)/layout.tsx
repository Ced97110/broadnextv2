
import { Analytics } from '@vercel/analytics/react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Barlow } from 'next/font/google';
import '../globals.css';
import Navbar from '@/components/layout/navbar';
import Script from 'next/script';
import { getSession } from '@auth0/nextjs-auth0/edge';



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

  const { user } = await getSession();
  console.log('user', user)

  return (
    <html lang='en'>
     <body className={`${barlow.variable} flex min-h-screen w-full flex-col bg-secondary text-black `}>
       <Navbar/>
        {children}
      </body>
      <Analytics />
      <Script type="text/javascript">
        {`window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","identifyHashed","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
          heap.load("1884442793")
          heap.identify("${user?.sub}")
           heap.addUserProperties({
            Name: "${user?.name}",
            Email: "${user?.email}",
           })`}
      </Script>
    </html>
  );
}