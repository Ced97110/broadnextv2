import React, { useEffect, useMemo, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { format } from 'd3-format';
import { prepareDataSentiment } from '@/app/(dashboard)/data';
import CompanyFinancials from './chart';



export default async function Financials ({params}:{params:{id:string}}) {

  console.log('params',params.id);


  const response = await prepareDataSentiment({
    CompanyId: params.id,
    AddNeutralSignal: 'no',
    periodParams: { periodType: 0 },
    PeriodStartDate: '',
    PeriodEndDate: '',
    endpoint: 'FinancialCharts',
  });


  return (
    <section>
     <CompanyFinancials data={response} />
    </section>
  )

}