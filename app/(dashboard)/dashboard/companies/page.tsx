import React from 'react'
import { TableCompanies } from './companies-table';




export const runtime = 'edge';

export default async function CompaniesPage ({params}) {


    const companiesData = await List();
    console.log('LISTDATA',companiesData);

  return (
    <section className="px-4 py-8">
      <TableCompanies data={companiesData} /> 
     </section>
  )
}


 async function List () {
  const response = await fetch(`http://localhost:8080/api/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
  const data = await response.json();
  return data;
}