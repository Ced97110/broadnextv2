

import { CompanyUser, fetchNews, prepareData } from "@/lib/data";
import { Suspense } from "react";
import Loading from "../load";
import UserSelection from "./user-selection";
import MyPortfolioAlloc from "./my-portfolio-alloc";




export const runtime = 'edge';

export default async function HomePage() {

  const [CompanyNews,results] = await Promise.all([
    fetchNews(),
    CompanyUser() 
  ]);


  return (
    <main className="w-full">
      <div className="flex flex-col items-center w-full h-full">
        <div className="flex flex-col md:flex-row w-full items-center">
          <Suspense fallback={<Loading/>} >
            <UserSelection results={results} /> 
          </Suspense>
        </div>

        {/* News Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
          <div className="lg:col-span-2">
            <MyPortfolioAlloc/>
          </div>
          <div className="lg:col-span-2">
            <MyPortfolioAlloc/>
          </div>
        </div>
      </div>
    </main>
  );
}



