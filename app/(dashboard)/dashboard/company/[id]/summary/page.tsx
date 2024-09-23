import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prepareData, prepareDataSentiment } from '@/app/data';
import { DataCompany, useCompanyStore } from '@/app/hooks/useCompanyStore';
import { Suspense, useEffect } from 'react';
import { set } from 'zod';
import FinancialTable from './financial-tab';
import DashboardSentimentChart from './sentiment-tab';
import { getAccessToken } from '@auth0/nextjs-auth0';




export default  async function SummaryPage({ params }: { params: { id: string } }) {
  const { accessToken } = await getAccessToken();


   const [companyDataRes, companyRelation, financialSummary,periodOptions,sourceOption,sentimentAnalysis] = await Promise.all([
          prepareData(
            `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
            accessToken
          ),
          prepareData(
            `https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/Relations?CompanyId=${params.id}`,
            accessToken
          ),
          prepareData(
            `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/FinancialSummary?CompanyId=${params.id}`,
            accessToken
          ),
          prepareData(
            `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/SentimenAnalysis/PeriodOptions`,
            accessToken
          ),
          prepareData(
            `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/SentimenAnalysis/SignalSourceOptions`,
            accessToken
          ),
          prepareDataSentiment({
            CompanyId: params.id,
            AddNeutralSignal: 'no',
            periodParams: { periodType: '0' },
            PeriodStartDate: '',
            PeriodEndDate: '',
            endpoint: 'SentimenAnalysis',
            token: accessToken
          })
        ]);
  
        const company = {
          ...companyDataRes,
          ...companyRelation,
        } as DataCompany;





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
              {/* Column 1 */}
              <div>
                <p className="font-bold">Exchange:</p>
                <p>{company?.Exchange ?? ''}</p>
                <p className="font-bold mt-4">Ticker:</p>
                <p>{company?.Ticker ?? ''}</p>
              </div>
  
              {/* Column 2 */}
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
  
              {/* Column 3 */}
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
          <FinancialTable data={financialSummary} />
        </Suspense>
      </div>
      <div className='lg:col-span-2'>
          <DashboardSentimentChart periodOptions={periodOptions} sourceOption={sourceOption} sentimentAnalysis={sentimentAnalysis} id={params.id} />
      </div>
    </div>
  </section>
  );
}