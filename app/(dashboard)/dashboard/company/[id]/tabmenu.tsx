'use client'
import { File } from 'lucide-react'; // Assuming File icon is from lucide-react
import Link from 'next/link'; // Assuming you're using Next.js Link
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button component
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';



const TabMenu = ({ id }) => {
  const pathname = usePathname(); // For App Router
 
  const tabs = [
    { name: 'Summary', href: `/dashboard/company/${id}/summary` },
    { name: 'Financials', href: `/dashboard/company/${id}/financial` },
    { name: 'News', href: `/dashboard/company/${id}/news` },
    { name: 'Twitter Sentiment', href: `/dashboard/company/${id}/twitter-sentiment` },
    { name: 'News Sentiment', href: `/dashboard/company/${id}/news-sentiment` },
  ];

  return (
    <Tabs value={tabs.find(tab => pathname.startsWith(tab.href))?.name.toLowerCase() || 'summary'} orientation="horizontal" className="h-fit rounded-lg">
      <TabsList className="flex flex-wrap h-full justify-normal">
        {tabs.map((tab, index) => {
          const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <TabsTrigger
              key={index}
              value={tab.name.toLowerCase()}
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium ${
                isActive ? 'text-blue-500 border-b-2 border-blue-950' : 'text-black hover:text-blue-500'
              } transition-colors duration-200`}
              asChild
            >
              <Link href={tab.href} prefetch={true}>{tab.name}</Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default TabMenu;