import React from 'react'
import { prepareDataSentiment } from '../../../data'
import TwitterSentiment from './graph';
import NewsSentiment from './graph';

export default async function NewsSentimentPage({params}: {params: {id: string}}) {

  console.log('paramsPaArams', params.id);
  
  const [
    periodOption,
    Entities,
    positiveEntities,
    negativeEntities,
    neutralEntities,
    sentimentData,
  ] = await Promise.all([
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenAnalysis/PeriodOptions',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'Entities',
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
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      SignalSource: '2',
      endpoint: 'SentimenSeries',
    }),
  ]);

  console.log('Entities', Entities);

  return (
    <div>
      <NewsSentiment
        period={periodOption}
        dataEntities={Entities}
        positiveEntitiesData={positiveEntities}
        negativeEntitiesData={negativeEntities}
        neutralEntitiesData={neutralEntities}
        sentimentSeriesData={sentimentData}
      />
    </div>
  );
}