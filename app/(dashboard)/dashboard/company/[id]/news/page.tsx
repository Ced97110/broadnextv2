import { CardNews } from "@/app/card-news";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prepareData, prepareDataGo } from "@/lib/data";
import { getAccessToken } from "@auth0/nextjs-auth0/edge";



export const runtime = 'edge';

export default async function NewsPage({ params }: { params: { id: string } }) {
  console.log('params', params.id);


  const [results,companyResult] = await Promise.all([
    DataFetchNews(params.id),
    prepareData({
      CompanyId: params.id,  
    },'1'),
  ]);

  
  console.log('TesId', results,companyResult.CompanyId);
  console.log('TesId2', results.CompanyId);

   const summary = 'hello'
      
      console.log(summary); // First summary
      console.log(summary); // Second summary
      console.log(summary); // Third summary

      console.log('EntitiesNews', results);

      return (
        <section className="w-full flex flex-col space-y-12 relative">
          <div className="flex flex-col space-y-12 p-2 relative">
            <div className="flex w-full py-12 px-12">
             
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 relative py-8">
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {results && results.Results?.map((news: any, i) => (
                <CardNews key={i} {...news} />
              ))}
            </div>
          </div>
        </section>
      ); 
}


async function DataFetchNews (id: string) {
  const { accessToken } = await getAccessToken();
  const response = await fetch(`https://broadwalkgo.onrender.com/api/prepare-news/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,

      
    },
    cache:'no-cache'
  });
  const data = await response.json();
  return data;
}