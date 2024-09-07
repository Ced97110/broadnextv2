'use client'
import { File } from 'lucide-react'; // Assuming File icon is from lucide-react
import Link from 'next/link'; // Assuming you're using Next.js Link
import { Button } from '@/components/ui/button'; // Assuming ShadCN Button component
import { usePathname, useSearchParams } from 'next/navigation';

export default function TabMenu() {

  const path = usePathname(); // Next.js hook
  const searchParams = useSearchParams(); // Next.js hook

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between w-full p-4 bg-white shadow-md rounded-lg">
      {/* Tab Links */}
      <ul className="flex flex-col md:flex-row w-full md:w-auto gap-4 md:gap-6 mb-4 md:mb-0">
        <li>
          <Link
            href="/summary"
            className={`text-sm md:text-base font-medium ${path === '/summary' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition-colors`}
          >
            Summary
          </Link>
        </li>
        <li>
          <Link
            href="/financial"
            className={`text-sm md:text-base font-medium ${path === '/financial' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition-colors`}
          >
            Financial
          </Link>
        </li>
        <li>
          <Link
            href="/news"
            className={`text-sm md:text-base font-medium ${path === '/news' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition-colors`}
          >
            News
          </Link>
        </li>
        <li>
          <Link
            href="/twitter-sentiment"
            className={`text-sm md:text-base font-medium ${path === '/twitter-sentiment' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition-colors`}
          >
            Twitter Sentiment
          </Link>
        </li>
        <li>
          <Link
            href="/news-sentiment"
            className={`text-sm md:text-base font-medium ${path === '/news-sentiment' ? 'text-blue-500' : 'text-gray-700'} hover:text-blue-500 transition-colors`}
          >
            News Sentiment
          </Link>
        </li>
      </ul>

      {/* Button Section */}
      <div className="flex items-center">
        <Button size="sm" variant="outline" className="h-8 gap-1">
          <File className="h-4 w-4" />
          <span className=" ">
            Summaries
          </span>
        </Button>
      </div>
    </nav>
  );
}