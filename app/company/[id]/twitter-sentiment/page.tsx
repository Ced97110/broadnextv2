import React from 'react'
import { prepareData, prepareDataSentiment } from '../../../data'
import TwitterSentiment from './graph';
import Image from 'next/image';


export default async function FinancialPage({params}: {params: {id: string}}) {

  console.log('paramsPaArams', params.id);
  
  const [
    periodOption,
    Entities,
    positiveEntities,
    negativeEntities,
    neutralEntities,
    sentimentData,
    company
  ] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenAnalysis/PeriodOptions',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '3',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenSeries',
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`
    ),
  ]);

 

  return (
    <div>
      <TwitterSentiment
        id={params.id}
        period={periodOption}
        dataEntities={Entities}
        positiveEntitiesData={positiveEntities}
        negativeEntitiesData={negativeEntities}
        neutralEntitiesData={neutralEntities}
        sentimentSeriesData={sentimentData}
        company={company}
      />
    </div>
  );
}