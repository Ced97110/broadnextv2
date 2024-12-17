import React from 'react'
import { DataFetch, TableList } from '@/lib/data';
import Financials from './financial';

export const revalidate = 3600

export async function generateStaticParams() {
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.map((item) => ({
    id: String(item.Id)
   }));
   
 }



export default async function FinancialsWrapper({ params }: { params: { id: string } }) {
  const result = await DataFetch(params.id);
  return (
    <div>
      <Financials data={result} params={params.id}/>
    </div>
  )
}
