
import { CompanyFetch} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import Script from "next/script";
import { CompanyRelation } from "@/app/types/types";
import ImageLoading from "./compo/Image-loading";
import PriceIndicator from "./price-indicator";
import { InteractiveLayoutBadges } from "./interactive-layout";
import TabMenu from "./compo/tabmenu";
import { Providers } from "./provider";



export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      Id: string
    }
  }) {


    const session = await getSession();
    if (!session || !session.user) {
      redirect('/api/auth/me');
    }


    const { user } = session;
    const companyRelation = await CompanyFetch(params.Id) as CompanyRelation;
 
    if (!session) {
      return (
        redirect('/api/auth/login')
      )
    }
    return (
      <>
      <Providers companyRelation={companyRelation}>
      
          <div className="flex flex-col space-y-6 mt-28  px-8">
            {/* Company Information Section */}
            <div className="flex  h-full flex-row items-center justify-between space-x-6">
              <div className="flex flex-row gap-5  items-center text-black">
                {/* Company Logo */}
                  <ImageLoading imageUrl={companyRelation?.LogoUrl}/>
                {/* Company Details */}
              
                  <h1 className="text-xl font-medium">{companyRelation?.Name}</h1>
                  <p className="text-md">{companyRelation?.Ticker ?? 'N/A'}</p>
                  <p className="text-md">${companyRelation?.ClosePrice ?? 'N/A'}</p> 
                
                
                  <div>
                    <PriceIndicator PriceMovement={Number(companyRelation?.PriceMovement)} PriceChange={Number(companyRelation?.PriceChange)}/>
                  </div> 
                  <Badge className={companyRelation?.Type === 'Public' ? 'bg-blue-300 hover:bg-blue-300' : 'bg-yellow-300 hover:bg-yellow-300'}>
                    <p className={companyRelation?.Type === 'Public' ? 'text-blue-700' : 'text-yellow-700'}>{companyRelation?.Type}</p>
                  </Badge> 
                
              </div>
              <InteractiveLayoutBadges Id={companyRelation?.Id} data={companyRelation}/>
            </div>

            {/* Tab Menu Section */}
            <div className="w-full">
              <TabMenu id={params.Id} hasFinancial={companyRelation?.HasFinancials} hasTwitter={companyRelation?.HasTwitter} />
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

