import { getAccessToken } from '@auth0/nextjs-auth0/edge'
import React from 'react'
import { PricesGraph } from './prices-graph'

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

export default async function HistoricalPrice({id, company}) {
    const data = await FetchPrices(id)
    console.log("prices", data)
  return (
    <>
     <PricesGraph data={data} company={company} />
    </>
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