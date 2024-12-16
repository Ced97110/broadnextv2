import React from 'react'
import { DataFetch } from '@/lib/data';
import Financials from './financial';

export const runtime = 'edge';

export default async function FinancialsWrapper({ params }: { params: { id: string } }) {
  const result = await DataFetch(params.id);
  return (
    <div>
      <Financials data={result} params={params.id}/>
    </div>
  )
}
