import { CardNews } from "@/app/card-news";
import { prepareData } from "@/app/data";


export default async function NewsPage({ params }: { params: { id: string } }) {
  console.log('params', params.id);

  const newsData = await prepareData(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${params.id}`);

  console.log('EntitiesNews', newsData);

  return (
    <section className="w-full p-4">
      {/* Responsive News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {newsData && newsData.Results?.map((news: any) => (
          <CardNews key={news.id} {...news} />
        ))}
      </div>
    </section>
  );
}