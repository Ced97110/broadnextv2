import { CardNews } from "@/app/card-news";
import { Chat } from "../financial/chat";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prepareData } from "@/lib/data";



export const runtime = 'edge';

export default async function NewsPage({ params }: { params: { id: string } }) {
  console.log('params', params.id);


  const results = await Promise.allSettled([
    prepareData({
      CompanyId: params.id,
      endpoint: 'News',
    },'1'),
    prepareData({
      CompanyId: params.id,  
    },'1'),
  ]);

  const [newsDataResult, companyResult] = results;

  // Handle the results, logging or providing fallback values on failure
  const newsData = newsDataResult.status === 'fulfilled' ? newsDataResult.value : null;
  const company = companyResult.status === 'fulfilled' ? companyResult.value : null;

  if (newsDataResult.status === 'rejected') {
    console.error('Error fetching news data:', newsDataResult.reason);
  }
  if (companyResult.status === 'rejected') {
    console.error('Error fetching company data:', companyResult.reason);
  }

  const merged = { ...newsData, ...company };

   const summary = 'hello'
      
      console.log(summary); // First summary
      console.log(summary); // Second summary
      console.log(summary); // Third summary

      console.log('EntitiesNews', newsData);

      return (
        <section className="w-full flex flex-col space-y-12 relative">
          <div className="flex flex-col space-y-12 p-2 relative">
            <div className="flex w-full py-12 px-12">
              <Tabs defaultValue="Market Trends" orientation="vertical" className="w-full flex flex-row space-x-6">
                <TabsList className="flex flex-col items-start space-y-2 mt-10">
                  <TabsTrigger value="Market Trends">Market trends</TabsTrigger>
                  <TabsTrigger value="Announcements">Announcement</TabsTrigger>
                  <TabsTrigger value="Regulatory Matters">Regulatory matters</TabsTrigger>
                </TabsList>

                <div className="w-full">
                  <TabsContent value="Market Trends">
                    <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{summary}</Card>
                  </TabsContent>
                  <TabsContent value="Announcements">
                    <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{summary}</Card>
                  </TabsContent>
                  <TabsContent value="Regulatory Matters">
                    <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{summary}</Card>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 relative py-8">
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {newsData && newsData.Results?.map((news: any, i) => (
                <CardNews key={i} {...news} />
              ))}
            </div>
            <div className="sticky top-0 right-0 col-span-1 h-screen overflow-y-scroll">
              <Chat raw={newsData?.Results || []} endpoint='news' company={company} title={`Ask for insights from ${company?.Name}`} />
            </div>
          </div>
        </section>
      ); 
}