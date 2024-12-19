import React, { Suspense } from 'react'
import Loading from '../../load';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyFetch, prepareData } from '@/lib/data';
import HistoricalPrice from './summary/historicalPrice';
import FinancialTable from './summary/financial-tab';
import DashboardSentimentChart from './summary/sentiment-tab';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { Information } from './summary/info';


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
    periodOptionsResult,
    sourceOptionResult,
  ] = await Promise.all([
    prepareData({ CompanyId: params.Id, endpoint: 'SentimenAnalysis/PeriodOptions' }, '1'),
    prepareData({ CompanyId: params.Id, endpoint: 'SentimenAnalysis/SignalSourceOptions' }, '1'),
  ]);

  return (
    <section className="py-4 w-full">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left side for the blog content */}
      <div className="lg:col-span-4">
        <Suspense fallback={<Loading />}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Information/>
            </CardContent>
          </Card>
        </Suspense>
      </div>
      <div className="lg:col-span-2">
        <Suspense fallback={<Loading />}>
          <HistoricalPrice Id={params.Id} />
        </Suspense>
      </div>
      <div className="lg:col-span-2">
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