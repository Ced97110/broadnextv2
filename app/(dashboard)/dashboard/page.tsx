

import { CompanyUser, fetchNews, prepareData } from "@/lib/data";
import { Suspense } from "react";
import Loading from "../load";
import UserSelection from "./user-selection";
import MyPortfolioAlloc from "./my-portfolio-alloc";
import GlobalEconomic from "./global-economic";
import EconomicIndex from "./economic-index";
import InvestmentPerformance from "./investment-performance";




export const runtime = 'edge';

export default async function HomePage() {

  const [results] = await Promise.all([
    CompanyUser() 
  ]);

  console.log("Company results:", results);


  return (
    <main className="w-full p-8">
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-col md:flex-row w-full items-center">
          <Suspense fallback={<Loading/>} >
            <UserSelection results={results} /> 
          </Suspense>
        </div>

      </div>
    </main>
  );
}



