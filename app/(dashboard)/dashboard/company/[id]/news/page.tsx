import { CardNews } from "@/app/card-news";
import { Chat } from "../financial/chat";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prepareData, prepareDataGo } from "@/lib/data";



export const runtime = 'edge';

export default async function NewsPage({ params }: { params: { id: string } }) {
  console.log('params', params.id);


  const [results,companyResult] = await Promise.all([
    DataFetchNews(params.id),
    prepareData({
      CompanyId: params.id,  
    },'1'),
  ]);

  console.log('News', results,companyResult);

   const summary = 'hello'
      
      console.log(summary); // First summary
      console.log(summary); // Second summary
      console.log(summary); // Third summary

      console.log('EntitiesNews', results);

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
              {results && results.Results?.map((news: any, i) => (
                <CardNews key={i} {...news} />
              ))}
            </div>
            <div className="sticky top-0 right-0 col-span-1 h-screen overflow-y-scroll">
              <Chat raw={results?.Results || []} endpoint='news' company={companyResult} title={`Ask for insights from ${companyResult?.Name}`} />
            </div>
          </div>
        </section>
      ); 
}


async function DataFetchNews (id: string) {
  const response = await fetch(`https://broadwalkgo.onrender.com/api/prepare-news/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      
    },
    cache:'no-cache'
  });
  const data = await response.json();
  return data;
}