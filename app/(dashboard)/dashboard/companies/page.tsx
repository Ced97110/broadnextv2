import React, { Suspense } from 'react'
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { DataTable } from './data-table';
import Loading from '../../load';
import { TableList } from '@/lib/data';
import { Toaster } from '@/components/ui/toaster';






export const runtime = 'edge';

export default async function CompaniesPage ({params}) {
 const data = await TableList()
  return (
    <section className="px-4 py-8">
          <Toaster />
          <DataTable dataCompany={data} /> 
          <Toaster />
     </section>
  )
}

