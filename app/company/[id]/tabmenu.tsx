'use client'
import { File } from 'lucide-react'; // Assuming File icon is from lucide-react
import Link from 'next/link'; // Assuming you're using Next.js Link
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button component
import { usePathname, useSearchParams } from 'next/navigation';


export default function TabMenu() {

  const path = usePathname();
  const searchParams = useSearchParams()

  return (
    <nav className="flex items-center justify-evenly w-fit p-4 bg-white shadow-md">
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
          <Link href={`news`} className="text-sm md:text-base font-medium text-gray-700 hover:text-blue-500">
            News
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

    
      <div className="ml-4">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Summaries
          </span>
        </Button>
      </div>
    </nav>
  );
}