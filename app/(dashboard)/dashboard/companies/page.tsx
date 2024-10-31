import React from 'react'
import { TableCompanies } from './companies-table';
import { getAccessToken } from '@auth0/nextjs-auth0/edge';





export const runtime = 'edge';

export default async function CompaniesPage ({params}) {
  const accessToken = await getAccessToken();


    const companiesData = await List();
    console.log('LISTDATA',companiesData);

  return (
    <section className="px-4 py-8">
      <TableCompanies data={companiesData} token={accessToken} /> 
     </section>
  )
}


 async function List () {
  const response = await fetch(`https://broadwalkgo.onrender.com/api/company-list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    
  });
  const data = await response.json();
  return data;
}