'use client'


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prepareData } from '@/app/data';
import { DataCompany, useCompanyStore } from '@/app/hooks/useCompanyStore';
import { useEffect } from 'react';
import { set } from 'zod';


export default  function SummaryPage({ params }: { params: { id: string } }) {

  const setCompany = useCompanyStore(state => state.setCompany);
  const company = useCompanyStore(state => state.company)

  console.log('COMPANY', company)

  useEffect(() => {
    async function fetchData() {
      try {
        const [companyDataRes, companyRelation] = await Promise.all([
          prepareData(
            `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`
          ),
          prepareData(
            `https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/Relations?CompanyId=${params.id}`
          ),
        ]);
  
        // Combine the results
        const company = {
          ...companyDataRes,
          ...companyRelation,
        } as DataCompany;

        setCompany(company);
  
        // You can now set state or handle the data here
        console.log(company);
  
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }
  
    fetchData(); // Call the async function
  
  }, [params.id]);


 

 

  return (
    <section className="px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left side for the blog content */}
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{company?.Description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
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
        </div>

        {/* Right side for two additional blocks */}
        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Additional Block 1</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content for the first additional b</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Additional Block 2</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content for the second additional block goes here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}