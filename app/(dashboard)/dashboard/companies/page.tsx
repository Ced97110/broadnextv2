import React, { Suspense } from 'react'
import { DataTable } from './data-table';
import { TableList } from '@/lib/data';
import Loading from '../../load';

export const runtime = 'edge';

export default async function CompaniesPage () {
 const data = await TableList()
  return (
    <section className="px-4 py-8">
      <Suspense fallback={<Loading/>}>
          <DataTable dataCompany={data} /> 
      </Suspense>
     </section>
  )
}

