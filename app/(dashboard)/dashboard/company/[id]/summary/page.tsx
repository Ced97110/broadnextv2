import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense } from 'react';
import FinancialTable from './financial-tab';
import DashboardSentimentChart from './sentiment-tab';
import Loading from '@/app/(dashboard)/load';
import { CompanyFetch, prepareData, TableList } from '@/lib/data';
import HistoricalPrice from './historicalPrice';


export const revalidate = 3660

export async function generateStaticParams() {
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.map((item) => ({
    id: String(item.Id)
   }));
   
 }



export default async function SummaryPage({ params }: { params: { id: string } }) {
  const [
    companyData, // Mettez à jour ce nom pour refléter la structure actuelle
    periodOptionsResult,
    sourceOptionResult,
  ] = await Promise.all([
    CompanyFetch(params.id),
    prepareData({ CompanyId: params.id, endpoint: 'SentimenAnalysis/PeriodOptions' }, '1'),
    prepareData({ CompanyId: params.id, endpoint: 'SentimenAnalysis/SignalSourceOptions' }, '1'),
  ]);

  console.log('companyDataResResult', companyData);

  return (
    <section className="py-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-2">
          <Suspense fallback={<Loading />}>
            <HistoricalPrice id={params.id} company={companyData} />
          </Suspense>
        </div>
        {/* Left side for the blog content */}
        <div className="lg:col-span-2">
          <Suspense fallback={<Loading />}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-pretty text-[14px]'>{companyData?.Description ?? 'No description available.'}</p>

                <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 text-[14px]">

                  <div>
                    <p className="font-bold">Exchange:</p>
                    <p>{companyData?.Exchange ?? ''}</p>
                    <p className="font-bold mt-4">Ticker:</p>
                    <p>{companyData?.Ticker ?? ''}</p>
                    <p className="font-bold mt-4">Location:</p>
                    <p>{companyData?.Location ?? 'N/A'}</p>
                    
                  </div>

                  <div>
                    <p className="font-bold">Website:</p>
                    <a
                      href={companyData?.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {companyData?.Website ?? 'N/A'}
                    </a>
                    <p className="font-bold mt-4">Sector:</p>
                    <p>{companyData?.Sectors?.[0]?.Name ?? ''}</p>
                    <p className="font-bold mt-4">CIK:</p>
                    <p>{companyData?.CIK ?? 'N/A'}</p>
                  </div>

                  <div>
                    <p className="font-bold">CEO:</p>
                    <p>{companyData?.CEO ?? ''}</p>
                    <p className="font-bold mt-4">Employees:</p>
                    <p>{companyData?.EmployeesCount ?? '0'}</p>
                  </div>

                  <div>
                
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </div>
        <div className="lg:col-span-4">
          <Suspense fallback={<Loading />}>
            <FinancialTable id={params.id} />
          </Suspense>
        </div>
      
        <div className="lg:col-span-2">
          <Suspense fallback={<Loading />}>
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

