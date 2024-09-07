'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';



export default function TabMenu() {



const path = usePathname();
const searchParams = useSearchParams()

  return (
    <nav className="flex flex-wrap items-center justify-between w-full p-4 bg-white shadow-md">
      {/* Responsive menu for tabs */}
      <ul className="flex flex-wrap justify-around w-full gap-4 md:gap-6 md:w-auto">
        <li>
          <Link href="summary" className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            Summary
          </Link>
        </li>
        <li>
          <Link href={`financial`} className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            Financial
          </Link>
        </li>
        <li>
          <Link href="twitter-sentiment" className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            Twitter Sentiment
          </Link>
        </li>
        <li>
          <Link href="news-sentiment" className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            News Sentiment
          </Link>
        </li>
      </ul>

      {/* Action buttons on the right side */}
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Summaries
          </span>
        </Button>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}