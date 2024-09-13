import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'd3-format';
import CompanyFinancials from './chart';
import { prepareDataSentiment } from '@/app/data';



export default async function Financials ({params}:{params:{id:string}}) {

  console.log('params',params.id);


  const response = await prepareDataSentiment({
    CompanyId: params.id,
    AddNeutralSignal: 'no',
    periodParams: { periodType: '0' },
    PeriodStartDate: '',
    PeriodEndDate: '',
    endpoint: 'FinancialCharts',
  });
  console.log('RESPONSE',response);

   const quarters = response.Results?.find(item => item.Label === 'QUARTER')?.Results || [];

   console.log('QUARTERS',quarters);

   
   const data = quarters.map((quarter,index) => {
    const row = {Quarter: quarter}
    response.Results?.forEach(({Label,Results,ChartType}) => {
      if(Label !== 'QUARTER') {
        row[Label] = Results[index]
        row['ChartType'] = ChartType
      }
    })
    return row
   })




  return (
    <section>
     <CompanyFinancials data={data} raw={response} />
    </section>
  )
}