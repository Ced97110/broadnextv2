import { getAccessToken } from "@auth0/nextjs-auth0";
import { CompanyCard } from "../../card";
import { CardNews } from "../../card-news";
import Chat from "../../chat";
import fetchNews, { prepareData } from "../../../lib/data";
import { UserGreeting } from "../../user-greeting";
import { cookies } from "next/headers";
import { useMemo } from "react";
import ProductsPage from "./product-page";

export const runtime = 'edge';

export default async function HomePage() {

  const cookieStore = cookies();
  const accessToken = cookieStore.get('appSession');

  console.log('token',accessToken.value);

  const companiesData = await prepareDataCompany(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List`, accessToken.value);
  const companiesNews = await fetchNews(accessToken.value);

  const teslaNews = companiesNews[0];
  const nikolaNews = companiesNews[1];
  const lucidNews = companiesNews[2];

  console.log(companiesData);

  return (
    <section>
      <div className="flex p-4">
       <UserGreeting />
      </div>
      <div className='flex flex-col items-center pt-16'>
      <div className='flex flex-col md:flex-row w-full justify-evenly items-center'>
        {/* Company Cards */}
       <ProductsPage  companiesData={companiesData}/>
      </div>

      {/* News Section */}
      <div className="container mx-auto mt-10">
        {/* Tesla News Section */}
        <div className="mb-6 flex flex-col">
          <div className="flex justify-between mb-2">
            <h5 className="text-lg font-semibold underline">Tesla News</h5>
            <a className="underline hover:no-underline text-gray-600" href={`company/${teslaNews?.CompanyId}/summary`}>
              View Tesla
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            {teslaNews?.Results?.slice(0, 3).map((item, index) => (
              <CardNews key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Nikola News Section */}
        <div className="mb-6 flex flex-col">
          <div className="flex justify-between mb-2">
            <h5 className="text-lg font-semibold underline">Nikola News</h5>
            <a className="underline hover:no-underline text-gray-600" href={`company/${nikolaNews?.CompanyId}/summary`}>
              View Nikola
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            {nikolaNews?.Results?.slice(0, 3).map((item, index) => (
              <CardNews key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Lucid News Section */}
        <div className="mb-6 flex flex-col">
          <div className="flex justify-between mb-2">
            <h5 className="text-lg font-semibold underline">Lucid News</h5>
            <a className="underline hover:no-underline text-gray-600" href={`company/${lucidNews?.CompanyId}/summary`}>
              View Lucid
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            {lucidNews?.Results?.slice(0, 3).map((item, index) => (
              <CardNews key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
  </div>
    </section>
  
  );
}




async function prepareDataCompany (url:string,token:string) {
 
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    
  });

  const data = await response.json();

  return data;
}