import React, { Suspense } from 'react'
import Loading from '../../loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyFetch, prepareData } from '@/lib/data';
import HistoricalPrice from './summary/historicalPrice';
import FinancialTable from './summary/financial-tab';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { Information } from './summary/info';
import { DashboardSentimentChart } from './summary/sentiment-tab';


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
    data,
  ] = await Promise.all([
    DataFetch(params.Id),
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
          <FinancialTable data={data} />
        </Suspense>
      </div>
    
      <div className="lg:col-span-2">
        <Suspense fallback={<Loading />}>
          <DashboardSentimentChart
            id={params.Id}
          />
        </Suspense>
      </div>
    </div>
  </section>
  )
}




async function DataFetch (id: string) {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`https://broadwalkgo.onrender.com/api/financial-summary/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    cache:'force-cache'
  });
  const data = await response.json();
  return data;
}