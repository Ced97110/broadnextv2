import React from 'react'
import { TableCompanies } from './companies-table';
import { DataCompaniesNews } from '@/lib/data';


export const runtime = 'edge';

export default async function CompaniesPage ({params}) {


    const companiesData = await DataCompaniesNews();
    console.log('ff',companiesData);

  return (
    <section className="px-4 py-8">
      <TableCompanies data={companiesData} /> 
     </section>
  )
}

