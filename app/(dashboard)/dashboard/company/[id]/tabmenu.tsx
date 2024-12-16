'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Assurez-vous d'importer vos composants Tabs appropriés

interface TabMenuProps {
  id: string;
  hasFinancial: boolean;
  hasTwitter: boolean;
}

const TabMenu = ({ id, hasFinancial, hasTwitter }: TabMenuProps) => {
  const pathname = usePathname(); 
  
 console.log("Pathname", pathname);

  console.log("Twitter", hasTwitter);
  console.log("financial", hasFinancial);

  // Définition des onglets avec des flags cohérents
  const tabs = [
    { name: 'Summary', href: `/dashboard/company/${id}/summary` },
    { name: 'Financials', href: `/dashboard/company/${id}/financial` },
    { name: 'News', href: `/dashboard/company/${id}/news` },
    { name: 'News Sentiment', href: `/dashboard/company/${id}/news-sentiment` },
    { name: 'Twitter Sentiment', href: `/dashboard/company/${id}/twitter-sentiment` },
   
   
  ];

  // Filtrer les onglets basés sur les flags

  return (
    <Tabs
      value={
        tabs.find(tab => pathname.startsWith(tab.href))?.name.toLowerCase() || 'summary'
      }
      orientation="horizontal"
      className="h-fit rounded-lg"
    >
      <TabsList className="flex flex-wrap h-full justify-normal">
        {tabs.map(({ name, href }, i) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`) || pathname.endsWith(`${href}/news-sentiment`);
          if (name === 'Financials' && !hasFinancial) return null;
          if (name === 'Twitter Sentiment' && !hasTwitter) return null;
          return (
            <TabsTrigger
              key={i}
              value={name.toLowerCase()}
              className={`px-4 py-2 rounded-lg text-sm md:text-base font-medium ${
                isActive ? 'text-blue-500 border-b-2 border-blue-950' : 'text-black hover:text-blue-500'
              } transition-colors duration-200`}
              asChild
            >
              <Link href={href} prefetch={true}>
                {name}
              </Link>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default TabMenu;