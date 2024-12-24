
import { CompanyCard } from './company-card';
import { Suspense } from 'react';
import { BsBuildingsFill } from 'react-icons/bs';
import { IoMdTrendingUp } from 'react-icons/io';
import { FaRegStar } from "react-icons/fa6";
import Loading from '../loading';



interface UserSelectionProps {
  results: any;
}


export default function UserSelection({results}: UserSelectionProps) {


  const { Trending, Watched, Portfolio } = results;
  
  return (
    <section className='w-full'>
       <div className='flex flex-col w-full pt-16'>
        <div className='flex flex-col md:flex-row w-full items-center flex-wrap'>
          {/* Company Cards */}
          <div className='w-full md:w-3/6 p-1'>
           <Suspense fallback={<Loading/>}>
            <CompanyCard name='My Portfolio' data={Portfolio} icon={<BsBuildingsFill />} />
           </Suspense>
          </div>
          <div className='w-full md:w-3/6 p-1'>
          <Suspense fallback={<Loading/>}>
            <CompanyCard name='My Watchlist' data={Watched} icon={<FaRegStar />} />
          </Suspense>
          </div>
          <div className='w-full flex-1 md:w-6/6 p-1 rounded-lg'>
          <Suspense fallback={<Loading/>}>
            <CompanyCard name='Trending Companies' data={Trending} icon={<IoMdTrendingUp />} />
          </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}

