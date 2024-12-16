

import { CompanyUser, fetchNews, prepareData } from "@/lib/data";
import { Suspense } from "react";
import Loading from "../load";
import UserSelection from "./user-selection";
import { scan } from "react-scan";




export const runtime = 'edge';

export default async function HomePage() {

  const [results] = await Promise.all([
    CompanyUser() 
  ]);

  console.log("Company results:", results);




  return (
    <main className="w-full p-4 pt-24">
      <div className="flex flex-col w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-col">
            <h1 className="text-2xl">Dashboard</h1>
          </div>
            <UserSelection results={results} /> 
        </div>
      </div>
    </main>
  );
}



