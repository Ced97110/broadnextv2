


import TabMenu from "./tabmenu";
import Image from 'next/image'
import Providers from "@/app/providers";
import { prepareData } from "@/lib/data";

export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      id: string
    }
  }) {

    const company = await prepareDataCompany(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`)

    console.log("comp,",company)
   
    return (
      <Providers>
        <div className="flex flex-col space-y-2 mt-28 px-8">
              <div className="flex justify-between">
                <div className="hidden lg:block">
                {company?.Logo && (
              
                  <Image
                    src={company?.Logo}
                    alt={company?.Name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                
                )}
                </div>
                <div className="lg:pt-4">
                  <TabMenu id={params.id} />
                </div>
                </div>
                <div className="lg:hidden mx-auto">
                {company?.Logo && (
                  <Image
                    src={company?.Logo}
                    alt={company?.Name}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                )}
                </div>
              </div>
            <>
              {children}
            </>
    </Providers>
    )
     
  }



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