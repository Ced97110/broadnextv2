import React from 'react'
import { DataTable } from './data-table';
import { TableList } from '@/lib/data';

export default async function CompaniesPage ({params}) {
 const data = await TableList()
  return (
    <section className="px-4 py-8">
          <DataTable dataCompany={data} /> 
     </section>
  )
}

