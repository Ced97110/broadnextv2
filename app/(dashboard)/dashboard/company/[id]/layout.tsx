

import { prepareData } from "@/app/data";
import TabMenu from "./tabmenu";
import Image from 'next/image'
import { shallow } from 'zustand/shallow';
import Providers from "@/app/providers";

export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      id: string
    }
  }) {

    const company = await prepareDataCompany(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/Logo?CompanyId=${params.id}`
    );

    console.log('COMPANY', company)
   
    console.log('WEBPARAMS', params.id)
  
    return (
      <Providers>
        <div className="flex flex-col space-y-6">
              <div className="flex justify-between">
                <div className="hidden lg:block">
                {company?.LogoUrl && (
              
                  <Image
                    src={company?.LogoUrl}
                    alt={company?.Name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                
                )}
                </div>
                <div className="lg:pt-16">
                  <TabMenu />
                </div>
                </div>
                <div className="lg:hidden mx-auto">
                {company?.LogoUrl && (
                  <Image
                    src={company?.LogoUrl}
                    alt={company?.Name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                )}
                </div>
              </div>
            <div className="">
              {children}
            </div>
    </Providers>
    )
     
  }


export const revalidate = 3600

async function prepareDataCompany (url:string) {
 
  const response = await fetch(url, {
    method: 'GET',

    headers: {
      'Content-Type': 'application/json',
    },
    cache:"reload"
    
  });

  const data = await response.json();

  return data;
}