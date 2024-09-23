import React from 'react'
import { TableCompanies } from './companies-table';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';
import { prepareData } from '@/lib/data';


export const runtime = 'edge';

export default async function CompaniesPage ({params}) {

  const cookieStore = cookies();
  const accessToken = cookieStore.get('appSession');


    const companiesData = await prepareData(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List`,accessToken.value);

 
  return (
    <section className="px-4 py-8">
      <TableCompanies data={companiesData} /> 
     </section>
  )
}
