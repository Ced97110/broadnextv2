'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Assurez-vous d'importer vos composants Tabs appropriés

interface TabMenuProps {
  id: string;
  hasFinancial: boolean;
  hasTwitter: boolean;
  tabs: any
}



const TabMenu = ({ id, hasFinancial, hasTwitter,tabs }: TabMenuProps) => {
  const pathname = usePathname(); 
 
  return (
    <nav className="w-full bg-transparent" aria-label="Main Navigation">
    <ul className="flex space-x-6 px-4 py-3 overflow-x-auto">
      {tabs.map(({ name, href }, i) => {
        // Conditions pour afficher certains onglets
        if (name === 'Financials' && !hasFinancial) return null;
        if (name === 'Twitter Sentiment' && !hasTwitter) return null;

        const isActive = href === pathname;

        return (
          <li key={i} role="presentation">
            <Link href={href}
                role="tab"
                aria-selected={isActive}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {name}
              
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
  );
};

export default TabMenu;