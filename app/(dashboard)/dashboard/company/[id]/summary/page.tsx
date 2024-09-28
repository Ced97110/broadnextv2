import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense, useEffect } from 'react';
import FinancialTable from './financial-tab';
import DashboardSentimentChart from './sentiment-tab';
import { prepareData} from '@/lib/data';
import { Loader } from 'lucide-react';
import Loading from '../loading';

export const runtime = 'edge';

export default async function SummaryPage({ params }: { params: { id: string } }) {

  const [
    companyDataResResult,
    companyRelationResult,
    financialSummaryResult,
    periodOptionsResult,
    sourceOptionResult,
  ] =  await Promise.all([
    prepareData({ CompanyId: params.id }, '1'),
    prepareData({ CompanyId: params.id, endpoint: 'Relations' }),
    prepareData({ CompanyId: params.id, endpoint: 'SentimenAnalysis/PeriodOptions' }, '1'),
    prepareData({ CompanyId: params.id, endpoint: 'SentimenAnalysis/SignalSourceOptions' }, '1'),
    prepareData({
      CompanyId: params.id,
      AddNeutralSignal: 'no',
      periodParams: { periodType: '0' },
      PeriodStartDate: '',
      PeriodEndDate: '',
      endpoint: 'SentimenAnalysis'
    }, '1')
  ]);

  console.log('comapnyDataResResult',  companyDataResResult,);

  return (
    <section className="py-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side for the blog content */}
        <div className="lg:col-span-4">
          <Suspense fallback={<Loading/>}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{companyDataResResult?.Description ?? 'No description available.'}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="font-bold">Exchange:</p>
                    <p>{companyRelationResult?.Exchange ?? ''}</p>
                    <p className="font-bold mt-4">Ticker:</p>
                    <p>{companyRelationResult?.Ticker ?? ''}</p>
                  </div>

                  <div>
                    <p className="font-bold">Website:</p>
                    <a
                      href={companyRelationResult?.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {companyDataResResult?.Website ?? 'N/A'}
                    </a>
                    <p className="font-bold mt-4">Sector:</p>
                    <p>{companyRelationResult?.Sectors?.[0]?.Name ?? ''}</p>
                  </div>

                  <div>
                    <p className="font-bold">CEO:</p>
                    <p>{companyRelationResult?.CEO ?? ''}</p>
                    <p className="font-bold mt-4">Employees:</p>
                    <p>{companyDataResResult?.EmployeesCount ?? '0'}</p>
                    <p className="font-bold mt-4">Location:</p>
                    <p>{companyDataResResult?.Location ?? 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<Loading/>} >
            <FinancialTable id={params.id} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
        <Suspense fallback={<Loading/>} >
          <DashboardSentimentChart
            periodOptions={periodOptionsResult}
            sourceOption={sourceOptionResult}
            id={params.id}
          />
         </Suspense>
        </div>
      </div>
    </section>
  );
}
