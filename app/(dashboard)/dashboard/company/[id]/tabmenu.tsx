'use client'
import { File } from 'lucide-react'; // Assuming File icon is from lucide-react
import Link from 'next/link'; // Assuming you're using Next.js Link
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button component
import { useParams, usePathname, useSearchParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


export default function TabMenu() {

  const path = usePathname();
  const lastSegment = path.split('/').pop();

  return (
    <Tabs value={lastSegment} orientation="horizontal" className="h-fit rounded-lg">
      <TabsList className="flex flex-wrap h-full w-full">
        <TabsTrigger
          value="summary"
          className="px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-blue-500 transition-colors duration-200"
          asChild
        >
          <Link href="summary" prefetch={true}>Summary</Link>
        </TabsTrigger>

        <TabsTrigger
          value="financial"
          className="px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-blue-500 transition-colors duration-200"
          asChild
        >
          <Link href="financial" prefetch={true}>Financial</Link>
        </TabsTrigger>

        <TabsTrigger
          value="news"
          className=" px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-blue-500 transition-colors duration-200"
          asChild
        >
          <Link href="news" prefetch={true}>News</Link>
        </TabsTrigger>

        <TabsTrigger
          value="twitter-sentiment"
          className=" px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-blue-500 transition-colors duration-200"
          asChild
        >
          <Link href="twitter-sentiment" prefetch={true}>Twitter Sentiment</Link>
        </TabsTrigger>

        <TabsTrigger
          value="news-sentiment"
          className=" px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-blue-500 transition-colors duration-200"
          asChild
        >
          <Link href="news-sentiment" prefetch={true}>News Sentiment</Link>
        </TabsTrigger>
        <TabsTrigger
          value="copilot"
          className=" px-4 py-2 rounded-lg text-sm md:text-base font-medium text-gray-700 hover:text-blue-500 transition-colors duration-200"
          asChild
        >
          <Link href="copilot" prefetch={true}>Copilot</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}