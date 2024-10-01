'use client'

import { CompanyCard } from '@/app/card';


export default function ProductsPage({ companiesData }) {

  const {trendingCompanies, watchlistCompanies, recentlyViewedCompanies} = companiesData
 
  return (
    <section>
      <div className='flex flex-col items-center pt-16'>
        <div className='flex flex-col md:flex-row w-full justify-evenly items-center'>
          {/* Company Cards */}
          <div className='w-full md:w-1/3 p-4 rounded-lg'>
            <CompanyCard  title="Trending" company={trendingCompanies} />
          </div>
          <div className='w-full md:w-1/3 p-4'>
            <CompanyCard title="Watchlist" company={watchlistCompanies} />
          </div>
          <div className='w-full md:w-1/3 p-4'>
            <CompanyCard  title="Recently Viewed" company={recentlyViewedCompanies} />
          </div>
        </div>
      </div>
    </section>
  );
}

