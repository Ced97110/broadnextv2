import { CardNews } from "@/app/card-news";
import { DataFetchNews, prepareData, prepareDataGo } from "@/lib/data";



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

export default async function NewsPage({ params }: { params: { Id: string } }) {
  const results = await DataFetchNews(params.Id)

      console.log('EntitiesNews', results);

      return (
        <section className="w-full flex flex-col space-y-12 relative">
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
