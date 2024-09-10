

import { prepareData } from "@/app/data";
import { useCompanyStore } from "../../hooks/useCompanyStore";
import Providers from "../../providers";
import TabMenu from "./tabmenu";
import Image from 'next/image'
import { shallow } from 'zustand/shallow';

export default async function DashboardLayout({
    children,
    params,
  }: {
    children: React.ReactNode;
    params: {
      id: string
    }
  }) {

    const company = await prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/Logo?CompanyId=${params.id}`
    );

    console.log('COMPANY', company)
   
    console.log('WEBPARAMS', params.id)
  
    return (
      <Providers>
        <div className="flex w-full flex-col space-y-6 bg-muted/40">
              <div className="flex justify-end">
                  <TabMenu />
                </div>
                <div className="">
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