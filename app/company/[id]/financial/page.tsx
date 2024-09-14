import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import CompanyFinancials from './chart';
import { prepareData, prepareDataSentiment } from '@/app/data';
import { promise } from 'zod';


export const runtime = 'edge';

export default async function Financials ({params}:{params:{id:string}}) {

  console.log('params',params.id);

  const [financials, company] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'FinancialCharts',
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`
    ),
  ]);



   const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results || [];

   console.log('QUARTERS',quarters);

   
   const data = quarters.map((quarter,index) => {
    const row = {Quarter: quarter}
    financials.Results?.forEach(({Label,Results,ChartType}) => {
      if(Label !== 'QUARTER') {
        row[Label] = Results[index]
        row['ChartType'] = ChartType
      }
    })
    return row
   })




  return (
    <section>
     <CompanyFinancials data={data} raw={financials}  company={company} />
    </section>
  )
}