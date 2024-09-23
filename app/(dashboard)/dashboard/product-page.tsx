'use client'

import { CompanyCard } from '@/app/card';
import { useMemo } from 'react';

export default function ProductsPage({ companiesData }) {
  const trendingCompanies = useMemo(() => {
    return companiesData?.filter((item) =>
      ['Tesla', 'Rivian Automotive', 'Gogoro', 'Lordstown', 'Livewire', 'Xos'].includes(item.Name)
    );
  }, [companiesData]);

  const watchlistCompanies = useMemo(() => {
    return companiesData?.filter((item) =>
      ['Proterra', 'MULLEN AUTOMOTIVE', 'Lordstown Motors', 'Livewire', 'Arrival'].includes(item.Name)
    );
  }, [companiesData]);

  const recentlyViewedCompanies = useMemo(() => {
    return companiesData?.filter((item) =>
      ['Volvo', 'Canoo', 'Aptera Motors', 'Lucid Motors', 'Livewire'].includes(item.Name)
    );
  }, [companiesData]);

  return (
    <section>
      <div className='flex flex-col items-center pt-16'>
        <div className='flex flex-col md:flex-row w-full justify-evenly items-center'>
          {/* Company Cards */}
          <div className='w-full md:w-1/3 p-4'>
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