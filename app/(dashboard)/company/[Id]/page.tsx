import React, { Suspense } from 'react'
import Loading from '../../load';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyFetch, prepareData } from '@/lib/data';
import HistoricalPrice from './summary/historicalPrice';
import FinancialTable from './summary/financial-tab';
import DashboardSentimentChart from './summary/sentiment-tab';
import { getAccessToken } from '@auth0/nextjs-auth0';


export async function generateStaticParams() {
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.map((item) => ({
    Id: String(item.Id)
   }));
   
 }

export default async function CompanyPage({params} : {params: {Id: string}}) {
  const [
    companyData, // Mettez à jour ce nom pour refléter la structure actuelle
    periodOptionsResult,
    sourceOptionResult,
  ] = await Promise.all([
    CompanyFetch(params.Id),
    prepareData({ CompanyId: params.Id, endpoint: 'SentimenAnalysis/PeriodOptions' }, '1'),
    prepareData({ CompanyId: params.Id, endpoint: 'SentimenAnalysis/SignalSourceOptions' }, '1'),
  ]);

  return (
    <section className="py-4 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div className="lg:col-span-2">
        <Suspense fallback={<Loading />}>
          <HistoricalPrice Id={params.Id} company={companyData} />
        </Suspense>
      </div>
      {/* Left side for the blog content */}
      <div className="lg:col-span-2">
        <Suspense fallback={<Loading />}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-pretty text-[14px]'>{companyData?.Description ?? 'No description available.'}</p>

              <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 text-[14px]">

                <div>
                  <p className="font-bold">Exchange:</p>
                  <p>{companyData?.Exchange ?? ''}</p>
                  <p className="font-bold mt-4">Ticker:</p>
                  <p>{companyData?.Ticker ?? ''}</p>
                  <p className="font-bold mt-4">Location:</p>
                  <p>{companyData?.Location ?? 'N/A'}</p>
                  
                </div>

                <div>
                  <p className="font-bold">Website:</p>
                  <a
                    href={companyData?.Website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {companyData?.Website ?? 'N/A'}
                  </a>
                  <p className="font-bold mt-4">Sector:</p>
                  <p>{companyData?.Sectors?.[0]?.Name ?? ''}</p>
                  <p className="font-bold mt-4">CIK:</p>
                  <p>{companyData?.CIK ?? 'N/A'}</p>
                </div>

                <div>
                  <p className="font-bold">CEO:</p>
                  <p>{companyData?.CEO ?? ''}</p>
                  <p className="font-bold mt-4">Employees:</p>
                  <p>{companyData?.EmployeesCount ?? '0'}</p>
                </div>

                <div>
              
                </div>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
      <div className="lg:col-span-4">
        <Suspense fallback={<Loading />}>
          <FinancialTable id={params.Id} />
        </Suspense>
      </div>
    
      <div className="lg:col-span-2">
        <Suspense fallback={<Loading />}>
          <DashboardSentimentChart
            periodOptions={periodOptionsResult}
            sourceOption={sourceOptionResult}
            id={params.Id}
          />
        </Suspense>
      </div>
    </div>
  </section>
  )
}




async function FetchPrices (Id) {
  const {accessToken} = await getAccessToken()
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/CompanyHistoricalPrices?CompanyId=${Id}`,{
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`

      },
  })

  const data = await response.json()
  return data

}