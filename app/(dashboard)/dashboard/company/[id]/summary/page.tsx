import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense, useEffect } from 'react';
import FinancialTable from './financial-tab';
import DashboardSentimentChart from './sentiment-tab';
import { prepareData} from '@/lib/data';


export const runtime = 'edge';

export default async function SummaryPage({ params }: { params: { id: string } }) {


 

  const results = await Promise.allSettled([
    prepareData({
      CompanyId: params.id,
    },'1' ),
    prepareData({
      CompanyId: params.id,
      endpoint: 'Relations',
    },),
    DataFetch(params.id),
    prepareData({
      CompanyId: params.id,
      endpoint: 'SentimenAnalysis/PeriodOptions',
    },'1'),
    prepareData({
      CompanyId: params.id,
      endpoint: 'SentimenAnalysis/SignalSourceOptions',
    },'1'),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenAnalysis',
    }, '1')
  ]);

  // Destructure the results from the Promise.allSettled array
  const [
    companyDataResResult,
    companyRelationResult,
    financialSummaryResult,
    periodOptionsResult,
    sourceOptionResult,
    sentimentAnalysisResult
  ] = results;

  // Check each result for success or failure and handle accordingly
  const companyDataRes = companyDataResResult.status === 'fulfilled' ? companyDataResResult.value : null;
  const companyRelation = companyRelationResult.status === 'fulfilled' ? companyRelationResult.value : null;
  const financialSummary = financialSummaryResult.status === 'fulfilled' ? financialSummaryResult.value : null;
  const periodOptions = periodOptionsResult.status === 'fulfilled' ? periodOptionsResult.value : [];
  const sourceOption = sourceOptionResult.status === 'fulfilled' ? sourceOptionResult.value : [];
  const sentimentAnalysis = sentimentAnalysisResult.status === 'fulfilled' ? sentimentAnalysisResult.value : [];

  // Combine companyDataRes and companyRelation
  const company = {
    ...companyDataRes,
    ...companyRelation,
  } as any;

  return (
    <section className="py-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side for the blog content */}
        <div className="lg:col-span-4">
          <Suspense fallback={<p>Loading...</p>}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{company?.Description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="font-bold">Exchange:</p>
                    <p>{company?.Exchange ?? ''}</p>
                    <p className="font-bold mt-4">Ticker:</p>
                    <p>{company?.Ticker ?? ''}</p>
                  </div>

                  <div>
                    <p className="font-bold">Website:</p>
                    <a
                      href={company?.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company?.Website}
                    </a>
                    <p className="font-bold mt-4">Sector:</p>
                    <p>{company?.Sectors?.[0]?.Name ?? ''}</p>
                  </div>

                  <div>
                    <p className="font-bold">CEO:</p>
                    <p>{company?.CEO ?? ''}</p>
                    <p className="font-bold mt-4">Employees:</p>
                    <p>{company?.EmployeesCount ?? '0'}</p>
                    <p className="font-bold mt-4">Location:</p>
                    <p>{company?.Location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </div>

        {/* Right side for two additional blocks */}
        <div className="lg:col-span-2">
          <Suspense fallback={<p>Loading feed...</p>}>
            <FinancialTable data={financialSummary.data} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <DashboardSentimentChart
            periodOptions={periodOptions}
            sourceOption={sourceOption}
            sentimentAnalysis={sentimentAnalysis}
            id={params.id}
            
          />
        </div>
      </div>
    </section>
  );
}


async function DataFetch (id: string) {
  const response = await fetch(`https://broadgo.onrender.com/financial-summary/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      
    },
    cache:'force-cache'
  });
  const data = await response.json();
  return data;
}