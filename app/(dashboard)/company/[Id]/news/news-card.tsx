import { CardNews } from "@/app/card-news";
import { DataFetchNews, prepareData, prepareDataGo } from "@/lib/data";



export default async function NewsCard({data}) {
      console.log('EntitiesNews', data);
      return (
        <section className="w-full flex flex-col space-y-12 relative">
          <div className="grid grid-cols-3 gap-3 relative py-8">
            <div className="col-span-3 grid grid-cols-3 gap-2">
              {data && data?.Results?.map((news: any, i) => (
                <CardNews key={i} {...news} />
              ))}
            </div>
          </div>
        </section>
      ); 
}
