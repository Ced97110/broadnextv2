'use client'
import { File } from 'lucide-react'; // Assuming File icon is from lucide-react
import Link from 'next/link'; // Assuming you're using Next.js Link
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button component
import { usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function TabMenu() {

  const path = usePathname();
  const searchParams = useSearchParams()

  return (
    <Tabs orientation='horizontal' className=" h-fit rounded-lg">
      <TabsList className="flex flex-wrap h-full w-full">
        <TabsTrigger value='summary' asChild>
          <Link href="summary" className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            Summary
          </Link>
        </TabsTrigger>
        <TabsTrigger value='financial' asChild>
          <Link href={`financial`} className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            Financial
          </Link>
        </TabsTrigger>
        <TabsTrigger value='news' asChild>
          <Link href={`news`} className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            News
          </Link>
        </TabsTrigger>
        <TabsTrigger value='twitter-sentiment' asChild>
          <Link href="twitter-sentiment" className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            Twitter Sentiment
          </Link>
        </TabsTrigger>
        <TabsTrigger value='news-sentiment' asChild>
          <Link href="news-sentiment" className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            News Sentiment
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}