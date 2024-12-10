import React from 'react'
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { DataTable } from './data-table';






export const runtime = 'edge';

export default async function CompaniesPage ({params}) {
  const accessToken = await getAccessToken();


    const companiesData = await List();
    console.log('LISTDATA',companiesData);

  return (
    <section className="px-4 py-8">
      <DataTable data={companiesData}  /> 
     </section>
  )
}


 async function List () {
  const accessToken = await getAccessToken();
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    cache:'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    
  });
  const data = await response.json();
  return data;
}