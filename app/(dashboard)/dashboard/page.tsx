
import Link from "next/link";
import { CardNews } from "../../card-news";
import { UserGreeting } from "../../user-greeting";
import ProductsPage from "./user-selection";
import { CompanyUser, fetchNews, prepareData } from "@/lib/data";
import { Suspense } from "react";
import Loading from "../load";
import UserSelection from "./user-selection";




export const runtime = 'edge';

export default async function HomePage() {

  const [CompanyNews,results] = await Promise.all([
    fetchNews(),
    CompanyUser() 
  ]);


  return (
    <main className="w-full">
      <div className="flex flex-col items-center">
        <div className="flex flex-col md:flex-row w-full items-center">
        <Suspense fallback={<Loading/>} >
           <UserSelection results={results} /> 
        </Suspense>
        </div>

        {/* News Section */}
        <div className="container mx-auto mt-10">
          {/* Tesla News Section */}
          <div className="mb-6 flex flex-col">
            <div className="flex justify-between mb-2">
              <h5 className="text-lg font-semibold underline">Tesla News</h5>
              {CompanyNews?.CompanyId && (
                <Link className="underline hover:no-underline text-gray-600" href={`/dashboard/company/${CompanyNews?.CompanyId}/summary`}>
                  View Tesla
                </Link>
              )} 
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            <Suspense fallback={<Loading/>} >
              {CompanyNews?.Results?.slice(0, 3).map((item, index) => (
                <CardNews key={index} {...item} />
              )) || <p>No news available at the moment.</p>}
            </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



