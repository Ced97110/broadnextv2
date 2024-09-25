import React from 'react'
import { TableCompanies } from './companies-table';
import { prepareData } from '@/lib/data';

export const runtime = 'edge';

export default async function CompaniesPage ({params}) {




    const companiesData = await prepareData(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List`);

 
  return (
    <section className="px-4 py-8">
      <TableCompanies data={companiesData} /> 
     </section>
  )
}
