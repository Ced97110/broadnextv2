import React, { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
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
  console.log('response',response);


  return (
    <section>
     <CompanyFinancials data={response} />
    </section>
  )

}