import React from 'react'
import { prepareData } from '@/app/data';
import { TableCompanies } from './companies-table';
import { getAccessToken } from '@auth0/nextjs-auth0';


export const runtime = 'edge';


export default async function CompaniesPage ({params}) {

  const { accessToken } = await getAccessToken();


    const companiesData = await prepareData(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List`,accessToken);

 
  return (
    <section className="px-4 py-8">
      <TableCompanies data={companiesData} /> 
     </section>
  )
}
