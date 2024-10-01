import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Suspense, useEffect } from 'react';
import FinancialTable from './financial-tab';
import DashboardSentimentChart from './sentiment-tab';
import { Loader } from 'lucide-react';
import Loading from '@/app/(dashboard)/load';
import { prepareData } from '@/lib/data';



export const runtime = 'edge';

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

  // Ajustement pour correspondre à la structure de l'objet renvoyé par l'API
  const company = companyData.company;

  console.log('companyDataResResult', company);

  return (
    <section className="py-4 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left side for the blog content */}
        <div className="lg:col-span-4">
          <Suspense fallback={<Loading />}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{company?.Description ?? 'No description available.'}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="font-bold">Exchange:</p>
                    <p>{company?.Relation?.Exchange ?? ''}</p>
                    <p className="font-bold mt-4">Ticker:</p>
                    <p>{company?.Relation?.Ticker ?? ''}</p>
                  </div>

                  <div>
                    <p className="font-bold">Website:</p>
                    <a
                      href={company?.Website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {company?.Website ?? 'N/A'}
                    </a>
                    <p className="font-bold mt-4">Sector:</p>
                    <p>{company?.Relation?.Sectors?.[0]?.Name ?? ''}</p>
                  </div>

                  <div>
                    <p className="font-bold">CEO:</p>
                    <p>{company?.Relation?.CEO ?? ''}</p>
                    <p className="font-bold mt-4">Employees:</p>
                    <p>{company?.EmployeesCount ?? '0'}</p>
                    <p className="font-bold mt-4">Location:</p>
                    <p>{company?.Location ?? 'N/A'}</p>
                  </div>

                  <div>
                    <p className="font-bold">Last Price Date:</p>
                    <p>${company?.LastPrice ?? ''}</p> <p className="font-bold">Last Price Date:</p>
                    <p>{new Date(company?.LastPriceDate).toLocaleDateString() ?? ''}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </div>
        <div className="lg:col-span-2">
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



async function CompanyFetch (id: string) {
  const response = await fetch(`https://broadgo.onrender.com/api/company/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      
    },
    cache:'no-cache'
  });
  const data = await response.json();
  return data;
}