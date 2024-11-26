import Providers from "@/app/providers";
import TabMenu from "./tabmenu";
import Image from "next/image";
import { getPriceIndicator } from "../../cardTrending";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { CompanyFetch } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
// components/DashboardLayout.js


export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      id: string
    }
  }) {

    const companyRelation = await CompanyFetch(params.id);
    const companyData = companyRelation.Company;

   

    console.log("Company Data:", companyData);

    return (
      <Providers>
        <div className="flex flex-col space-y-6 mt-28 px-8">
          {/* Company Information Section */}
          <div className="flex flex-row items-center justify-between space-x-6">
            <div className="flex flex-row gap-5  items-center text-black">
              {companyData?.Logo && (
                <Image
                  src={companyData?.Logo}
                  alt={companyData?.Name}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              )}

              {/* Company Details */}
            
                <h1 className="text-xl font-bold">{companyData?.Name}</h1>
                <p className="text-md">{companyData?.Relation?.Ticker ?? 'N/A'}</p>
                <p className="text-md">${companyData?.LastPrice ?? 'N/A'}</p> 

                <Badge className="bg-yellow-300 hover:bg-yellow-300">
                  <p className="text-yellow-700">Electric vehicle</p>
                </Badge> 
                <Badge className="bg-blue-300 hover:bg-blue-300">
                   <p className="text-blue-700">Public</p>
                </Badge> 
              
            </div>
            <div className="flex gap-4">
                <Button className="rounded-full">
                 <Download className="mr-2 h-4 w-4 " />
                   Download report
                </Button>
                <Button className="rounded-full" variant="outline">
                 <Plus className="mr-2 h-4 w-4" />
                   Add to my portfolio
                </Button>
            </div>
          </div>

          {/* Tab Menu Section */}
          <div className="w-full">
            <TabMenu id={params.id} />
          </div>

          {/* Main Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </Providers>
    )
  }