'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavItem({
  href,
  label,
  children
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
   <>
    <Link
          href={href}
          className={clsx(
            'flex w-full h-[50px] items-center justify-start  text-muted-foreground transition-colors hover:text-foreground',
            {
              'bg-accent text-black': pathname === href
            }
          )}
        >
          {children}
          <span className="sr-only">{label}</span>
      </Link>
   
   </>
       
        )
}
