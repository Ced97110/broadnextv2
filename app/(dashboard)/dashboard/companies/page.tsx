import React, { Suspense } from 'react'
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { DataTable } from './data-table';
import Loading from '../../load';






export const runtime = 'edge';

export default async function CompaniesPage ({params}) {
  return (
    <section className="px-4 py-8">
          <DataTable  /> 
     </section>
  )
}

