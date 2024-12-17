import React from 'react'
import { DataFetch, TableList } from '@/lib/data';
import Financials from './financial';


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

export default async function FinancialsWrapper({ params }: { params: { Id: string } }) {
  const result = await DataFetch(params.Id);
  return (
    <div>
      <Financials data={result} params={params.Id}/>
    </div>
  )
}
