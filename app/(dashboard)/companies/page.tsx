import React, { Suspense } from 'react'
import { DataTable } from './data-table';
import { TableList } from '@/lib/data';
import Loading from '../load';
import { ToastContainer } from 'react-toastify';



export default async function CompaniesPage ({params}: {params: {Id: string}}) {
 const data = await TableList()
  return (
    <section className="px-4 py-8">
      <Suspense fallback={<Loading/>}>
          <DataTable dataCompany={data} Id={params.Id}/> 
      </Suspense>
     </section>
  )
}

