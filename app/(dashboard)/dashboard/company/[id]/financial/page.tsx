import React, { useEffect, useMemo, useState } from 'react';
import CompanyFinancials from './chart';
import { prepareData,  } from '@/lib/data';


export const runtime = 'edge';

export default async function Financials({ params }: { params: { id: string } }) {

  const result = await DataFetch(params.id)

  console.log('result',result)

  const summary ='hello'

  return (
    <section>
      <CompanyFinancials
        data={result.data}
        companyprompt={summary}
        companyprompt1={summary}
        companyprompt2={summary}
       
      />
    </section>
  );
}


async function DataFetch(id: string) {
  const response = await fetch(`https://broadwalkgo.onrender.com/api/financials/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'force-cache',
  });
  const rawText = await response.text();
  console.log('Raw Response:', rawText);
  try {
    const data = JSON.parse(rawText);  // Explicitly use JSON.parse to catch any syntax issues
    return data;
  } catch (err) {
    console.error('Failed to parse JSON:', err);
    throw err;  // Re-throw the error to indicate the problem
  }
}