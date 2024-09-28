import React from 'react'
import { TableCompanies } from './companies-table';
import { prepareData } from '@/lib/data';

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


export async function DataCompaniesNews () {
  const response = await fetch(`https://broadgo.onrender.com/api/companies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      
    },
    cache:'force-cache'
  });
  const data = await response.json();
  return data;
}