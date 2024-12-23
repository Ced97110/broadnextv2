import { getAccessToken } from '@auth0/nextjs-auth0/edge'
import React from 'react'
import { PricesGraph } from './prices-graph'


export default async function HistoricalPrice({Id}) {
  const data = await FetchPrices(Id)
  return (
    <>
     <PricesGraph data={data}  />
    </>
  )
}



async function FetchPrices (Id) {
    const {accessToken} = await getAccessToken()
    const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/CompanyHistoricalPrices?CompanyId=${Id}`,{
      cache: 'force-cache',
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`

        },
    })

    const data = await response.json()
    return data

}