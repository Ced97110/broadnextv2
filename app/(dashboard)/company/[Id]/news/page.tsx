import { CardNews } from "@/app/card-news";
import { DataFetchNews, prepareData, prepareDataGo } from "@/lib/data";
import NewsCard from "./news-card";
import WrapperChatNews from "./wrapperchat";


export async function generateStaticParams() {
  const response = await fetch(`https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/ListCompanies`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data.map((item) => ({
    Id: String(item.Id)
   }));
   
 }

export default async function NewsPage({ params }: { params: { Id: string } }) {
  const results = await DataFetchNews(params.Id)
      console.log('EntitiesNews', results);
      return (
        <>
         <WrapperChatNews Id={params.Id}>
            <NewsCard data={results} />
         </WrapperChatNews>
        </>
      ); 
}
