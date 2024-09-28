import React, { useEffect, useMemo, useState } from 'react';
import CompanyFinancials from './chart';
import { prepareData,  } from '@/lib/data';


export const runtime = 'edge';

export default async function Financials({ params }: { params: { id: string } }) {
  console.log('params', params.id);


  // Use Promise.allSettled for API calls
  const results = await Promise.allSettled([
    DataFetch(params.id),
    prepareData({
      CompanyId: params.id,
    },'1'),
  ]);


  const [financialsResult, companyResult] = results;

  console.log('financialsResult', financialsResult);
  console.log('companyResult', companyResult);

  // Check for fulfilled or rejected promises and assign default values
  const financials = financialsResult.status === 'fulfilled' ? financialsResult.value : null;
  const company = companyResult.status === 'fulfilled' ? companyResult.value : null;

  // Log errors for rejected promises
  if (financialsResult.status === 'rejected') {
    console.error('Error fetching financials:', financialsResult.reason);
  }
  if (companyResult.status === 'rejected') {
    console.error('Error fetching company data:', companyResult.reason);
  }

 const summary ='helo'

  return (
    <section>
      <CompanyFinancials
        data={financials.data}
        company={company}
        companyprompt={summary}
        companyprompt1={summary}
        companyprompt2={summary}
       
      />
    </section>
  );
}


async function DataFetch (id: string) {
  const response = await fetch(`https://broadgo.onrender.com/financials/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'force-cache',
  });
  const data = await response.json();
  return data;
}