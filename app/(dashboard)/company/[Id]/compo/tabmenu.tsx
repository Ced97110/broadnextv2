'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Assurez-vous d'importer vos composants Tabs appropriés

interface TabMenuProps {
  id: string;
  hasFinancial?: boolean;
  hasTwitter?: boolean;
  tabs: any
  currentPath?: string;
  className?: string
}



const TabMenu = ({ id, hasFinancial, hasTwitter, tabs, currentPath, className }: TabMenuProps) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  
  return (
    <nav className="w-full bg-transparent flex justify-center md:block" aria-label="Main Navigation">
    <Tabs
      // If activePath doesn't map neatly to your tabs, pick a default fallback or leave it undefined.
      value={activePath}
    >
      <TabsList
        className="
          flex space-x-2 px-2 overflow-x-auto text-pretty
        
        "
      >
        {tabs.map(({ name, href }, i) => {
          // Conditions pour afficher certains onglets
          if (name === "Financials" && !hasFinancial) return null
          if (name === "Twitter Sentiment" && !hasTwitter) return null

          // Your existing 'isActive' logic
          const isActive =
            href === activePath ||
            (name === "Twitter Sentiment" && activePath.includes("/twitter-sentiment")) ||
            (href.includes("/twitter-sentiment") && activePath.startsWith(href)) ||
            (name === "News Sentiment" && activePath.includes("/news-sentiment")) ||
            (href.includes("/news-sentiment") && activePath.startsWith(href))

          return (
            <TabsTrigger
              key={i}
              // "value" determines which tab is highlighted if it matches <Tabs value={...}>
              value={href}
              // asChild lets us wrap the entire trigger in a Next.js Link
              asChild
              // The className can combine ShadCN styling with your custom rules
              className={`
                ${className}
                text-xs font-medium transition-colors duration-200
                ${isActive
                  ? "bg-white border-b-2 "
                  : "text-gray-600 hover:text-blue-600"
                }
              `}
            >
              {/* Next.js Link as the actual clickable element */}
              <Link
                href={href}
                role="tab"
                aria-selected={isActive}
              >
                {name}
              </Link>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  </nav>
  );
};

export default TabMenu;