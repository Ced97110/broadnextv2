import Providers from "@/app/providers";
import TabMenu from "./tabmenu";
import { CompanyFetch, handleRemove, handleWatchList, TableList } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import ImageLoading from "./Image-loading";
import PriceIndicator from "../price-indicator";
import { useCallback, useEffect, useMemo } from "react";
import { useState } from "react";
import { debounce } from 'lodash';
import { useUser } from "@auth0/nextjs-auth0/client";
import Loading from "@/app/(dashboard)/load";
import Link from "next/link";
import { InteractiveLayoutBadges } from "../interactive-layout";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";


export interface CompanyRelation {
    Id:number
    Logo: string;
    Name: string;
    Description: string;
    website: string;
    Sector: string;
    LogoUrl: string;
    Industry: string;
    EmployeesCount: number;
    Ticker?: string;
    Exchange?: string;
    IsWatched?: boolean;
    Location?: string;
    CEO?: string;
    Website?: string;
    Sectors?: {
      Name: string;
    }[];
  
    ClosePrice?: number;
    PriceMovement?: string;
    PriceChange?: number;
    // Add other relevant fields
  
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
      redirect('/api/auth/me');
    }

    const { user } = session;

    const companyRelation = await CompanyFetch(params.id) as CompanyRelation;
 
  
    if (!session) {
      return (
        <Link href="/api/auth/login"><a>Login</a></Link>
      )
    }

    console.log("Company Data:", companyRelation);

    return (
      <>
      <Providers>
        <div className="flex flex-col space-y-6 mt-28  px-8">
          {/* Company Information Section */}
          <div className="flex  h-full flex-row items-center justify-between space-x-6">
            <div className="flex flex-row gap-5  items-center text-black">
              {/* Company Logo */}
                <ImageLoading imageUrl={companyRelation?.LogoUrl}/>
              {/* Company Details */}
            
                <h1 className="text-xl font-bold">{companyRelation?.Name}</h1>
                <p className="text-md">{companyRelation?.Ticker ?? 'N/A'}</p>
                <p className="text-md">${companyRelation?.ClosePrice ?? 'N/A'}</p> 
               
               
                <div>
                  <PriceIndicator PriceMovement={Number(companyRelation?.PriceMovement)} PriceChange={Number(companyRelation?.PriceChange)}/>
                </div> 
                <Badge className="bg-yellow-300 hover:bg-yellow-300">
                  <p className="text-yellow-700">Electric vehicle</p>
                </Badge> 
                <Badge className="bg-blue-300 hover:bg-blue-300">
                   <p className="text-blue-700">Public</p>
                </Badge> 
              
            </div>
            <InteractiveLayoutBadges Id={companyRelation?.Id}/>
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
       </>
    )
  }

  export const runtime = 'edge';