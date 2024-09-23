import React from 'react'
import TwitterSentiment from './graph';
import NewsSentiment from './graph';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { cookies } from 'next/headers';
import { prepareData, prepareDataSentiment } from '@/lib/data';


export const runtime = 'edge';

export default async function NewsSentimentPage({params}: {params: {id: string}}) {

  const cookieStore = cookies();
  const accessToken = cookieStore.get('appSession');

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
      SignalSource: '2',
      endpoint: 'SentimenAnalysis/PeriodOptions',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'Entities',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      SignalSource: '2',
      endpoint: 'Entities',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      SignalSource: '2',
      endpoint: 'Entities',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '3',
      SignalSource: '2',
      endpoint: 'Entities',
      token: accessToken.value
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenSeries',
      token: accessToken.value
    }),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
      accessToken.value
    ),
  ]);

  console.log('Entities', Entities);

  return (
    <div>
      <NewsSentiment
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