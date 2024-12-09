import Providers from "@/app/providers";
import TabMenu from "./tabmenu";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { CompanyFetch } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import ImageLoading from "./Image-loading";
import Script from 'next/script';
import PriceIndicator from "../price-indicator";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";


export interface CompanyRelation {
  Company: {
    Logo: string;
    Name: string;
    Description: string;
    website: string;
    Sector: string;
    Industry: string;
    EmployeesCount: number;
    Relation?: {
      Ticker?: string;
    };
    LastPrice?: number;
    PriceMovement?: string;
    PriceChange?: number;
    // Add other relevant fields
  };
}




export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      id: string
    }
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

    const companyRelation = await CompanyFetch(params.id) as CompanyRelation;
    const companyData = companyRelation.Company;
    const {PriceMovement, PriceChange} = companyData;

  

    console.log("Company Data:", companyData);

    return (
      <>
      <Providers>
        <div className="flex flex-col space-y-6 mt-28  px-8">
          {/* Company Information Section */}
          <div className="flex  h-full flex-row items-center justify-between space-x-6">
            <div className="flex flex-row gap-5  items-center text-black">
              {/* Company Logo */}
                <ImageLoading imageUrl={companyData?.Logo}/>
              {/* Company Details */}
            
                <h1 className="text-xl font-bold">{companyData?.Name}</h1>
                <p className="text-md">{companyData?.Relation?.Ticker ?? 'N/A'}</p>
                <p className="text-md">${companyData?.LastPrice ?? 'N/A'}</p> 
               
               
                <div>
                  <PriceIndicator PriceMovement={Number(PriceMovement)} PriceChange={PriceChange}/>
                </div> 
                <Badge className="bg-yellow-300 hover:bg-yellow-300">
                  <p className="text-yellow-700">Electric vehicle</p>
                </Badge> 
                <Badge className="bg-blue-300 hover:bg-blue-300">
                   <p className="text-blue-700">Public</p>
                </Badge> 
              
            </div>
            <div className="flex gap-4">
                <Button className="rounded-full" variant="outline">
                 <Plus className="mr-2 h-4 w-4" />
                   Add to my portfolio
                </Button>
            </div>
          </div>

          {/* Tab Menu Section */}
          <div className="w-full bg-slate-300">
            <TabMenu id={params.id} />
          </div>

          {/* Main Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </Providers>
      <Script type="text/javascript" strategy="lazyOnload">
        {`window.heapReadyCb=window.heapReadyCb||[],window.heap=window.heap||[],heap.load=function(e,t){window.heap.envId=e,window.heap.clientConfig=t=t||{},window.heap.clientConfig.shouldFetchServerConfig=!1;var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src="https://cdn.us.heap-api.com/config/"+e+"/heap_config.js";var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(a,r);var n=["init","startTracking","stopTracking","track","resetIdentity","identify","identifyHashed","getSessionId","getUserId","getIdentity","addUserProperties","addEventProperties","removeEventProperty","clearEventProperties","addAccountProperties","addAdapter","addTransformer","addTransformerFn","onReady","addPageviewProperties","removePageviewProperty","clearPageviewProperties","trackPageview"],i=function(e){return function(){var t=Array.prototype.slice.call(arguments,0);window.heapReadyCb.push({name:e,fn:function(){heap[e]&&heap[e].apply(heap,t)}})}};for(var p=0;p<n.length;p++)heap[n[p]]=i(n[p])};
          heap.load("1884442793")
          heap.identify("${user?.sub}")
           heap.addUserProperties({
            Name: "${user?.name}",
            Email: "${user?.email}",
           })`}
      </Script>
       </>
    )
  }

  export const runtime = 'edge';