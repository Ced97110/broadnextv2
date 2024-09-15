import { CompanyCard } from "./card";
import { CardNews } from "./card-news";
import Chat from "./chat";
import fetchNews, { prepareData } from "./data";
import { UserGreeting } from "./user-greeting";



export const runtime = 'edge';


export default async function ProductsPage() {

  const companiesData = await prepareData(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List`);
  const companiesNews = await fetchNews();

  const teslaNews = companiesNews[0];
  const nikolaNews = companiesNews[1];
  const lucidNews = companiesNews[2];

  console.log(companiesData);

  return (
    <section>
      <div className="flex p-4">
       <UserGreeting />
      </div>
      <div className='flex flex-col items-center pt-16'>
      <div className='flex flex-col md:flex-row w-full justify-evenly items-center'>
        {/* Company Cards */}
        <div className='w-full md:w-1/3 p-4'>
          <CompanyCard
            title="My Portfolio"
            company={companiesData?.filter((item) => ['Tesla', 'Rivian Automotive', 'Gogoro', 'Lordstown', 'Livewire', 'Xos'].includes(item.Name))}
          />
        </div>
        <div className='w-full md:w-1/3 p-4'>
          <CompanyCard
            title="My Portfolio"
            company={companiesData?.filter((item) => ['Proterra', 'MULLEN AUTOMOTIVE', 'Lordstown Motors', 'Livewire', 'Arrival'].includes(item.Name))}
          />
        </div>
        <div className='w-full md:w-1/3 p-4'>
          <CompanyCard
            title="My Portfolio"
            company={companiesData?.filter((item) => ['Volvo', 'Canoo', 'Aptera Motors', 'Lucid Motors', 'Livewire'].includes(item.Name))}
          />
        </div>
      </div>

      {/* News Section */}
      <div className="container mx-auto mt-10">
        {/* Tesla News Section */}
        <div className="mb-6 flex flex-col">
          <div className="flex justify-between mb-2">
            <h5 className="text-lg font-semibold underline">Tesla News</h5>
            <a className="underline hover:no-underline text-gray-600" href={`company/${teslaNews?.CompanyId}/summary`}>
              View Tesla
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            {teslaNews?.Results?.slice(0, 3).map((item, index) => (
              <CardNews key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Nikola News Section */}
        <div className="mb-6 flex flex-col">
          <div className="flex justify-between mb-2">
            <h5 className="text-lg font-semibold underline">Nikola News</h5>
            <a className="underline hover:no-underline text-gray-600" href={`company/${nikolaNews?.CompanyId}/summary`}>
              View Nikola
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            {nikolaNews?.Results?.slice(0, 3).map((item, index) => (
              <CardNews key={index} {...item} />
            ))}
          </div>
        </div>

        {/* Lucid News Section */}
        <div className="mb-6 flex flex-col">
          <div className="flex justify-between mb-2">
            <h5 className="text-lg font-semibold underline">Lucid News</h5>
            <a className="underline hover:no-underline text-gray-600" href={`company/${lucidNews?.CompanyId}/summary`}>
              View Lucid
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
            {lucidNews?.Results?.slice(0, 3).map((item, index) => (
              <CardNews key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
  </div>
    </section>
  
  );
}