import React from 'react'
import { prepareDataSentiment } from '../../../data'
import TwitterSentiment from './graph';
export default async function FinancialPage({params}: {params: {id: string}}) {

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
      periodParams: { periodType: 0 },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenAnalysis/PeriodOptions',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: 0 },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: 0 },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '1',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: 0 },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '2',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: 0 },
      PeriodStartDate: '',
      PeriodEndDate: '',
      FilterSentiment: '3',
      endpoint: 'Entities',
    }),
    prepareDataSentiment({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: 0 },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenSeries',
    }),
  ]);

  console.log('Entities', Entities);

  return (
    <div>
      <TwitterSentiment
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