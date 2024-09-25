
import { CardNews } from "../../card-news";
import { UserGreeting } from "../../user-greeting";
import ProductsPage from "./product-page";
import { fetchNews, prepareData } from "@/lib/data";



export const runtime = 'edge';

export default async function HomePage() {

 
 
  const results = await Promise.allSettled([
    prepareData({
      endpoint: 'List',
    },),
    fetchNews()
  ]);

  // Destructure results
  const [companiesDataResult, companiesNewsResult] = results;

  // Handle the results, checking if each request was fulfilled or rejected
  const companiesData = companiesDataResult.status === 'fulfilled' ? companiesDataResult.value : null;
  const companiesNews = companiesNewsResult.status === 'fulfilled' ? companiesNewsResult.value : null;

  // Log any errors for debugging purposes
  if (companiesDataResult.status === 'rejected') {
    console.error('Error fetching companies data:', companiesDataResult.reason);
  }

  if (companiesNewsResult.status === 'rejected') {
    console.error('Error fetching companies news:', companiesNewsResult.reason);
  }

  return (
    <section>
      <div className="flex p-4">
        <UserGreeting />
      </div>
      <div className="flex flex-col items-center pt-16">
        <div className="flex flex-col md:flex-row w-full justify-evenly items-center">
          {/* Company Cards */}
          {companiesData ? <ProductsPage companiesData={companiesData} /> : <p>Unable to fetch companies data.</p>}
        </div>

        {/* News Section */}
        <div className="container mx-auto mt-10">
          {/* Tesla News Section */}
          <div className="mb-6 flex flex-col">
            <div className="flex justify-between mb-2">
              <h5 className="text-lg font-semibold underline">Tesla News</h5>
              {companiesNews?.CompanyId && (
                <a className="underline hover:no-underline text-gray-600" href={`company/${companiesNews?.CompanyId}/summary`}>
                  View Tesla
                </a>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-1">
              {companiesNews?.Results?.slice(0, 3).map((item, index) => (
                <CardNews key={index} {...item} />
              )) || <p>No news available at the moment.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Async function to fetch company data
async function prepareDataCompany(url: string ) {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      
    },
  });

  const data = await response.json();
  return data;
}
