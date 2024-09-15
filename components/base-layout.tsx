'use client'

import Link from 'next/link';
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users2,
  Store,
  Menu,
  User
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { redirect } from 'next/navigation' 
import { VercelLogo } from '@/components/icons';
import { auth } from '@/lib/auth';
import Providers from '../app/providers';
import { NavItem } from '../app/nav-item';
import { SearchInput } from '../app/search';
import { UserAccount } from '@/app/user';
import { SessionProvider, useSession, signOut, signIn } from "next-auth/react";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import DesktopNav from './desktop-nav';


export default function Dashboard({
  children
}: {
  children: React.ReactNode;
}) {

  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <UserProvider>
  <Providers>
    <main className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <DesktopNav
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
         
        />

        {/* Main content area */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            isCollapsed ? 'sm:ml-16' : 'sm:ml-64'
          }`} // Margin is applied only on larger screens (sm and up)
        >
          <header className="sticky top-0 z-30 flex h-24 items-center gap-4 border-b bg-background px-4 sm:static sm:h-24 sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <SearchInput />
            <UserAccount />
          </header>

          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </div>

      <Analytics />
    </main>
  </Providers>
</UserProvider>
  );
}

 

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
        <Link
              href="/"
              className="group flex items-center h-9 text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
            >
              <VercelLogo />
            <span className="ml-2 text-black">Broadwalk</span>
            </Link>
          <Link
            href="/"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/companies"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Store className="h-5 w-5" />
            Companies
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Package className="h-5 w-5" />
            My Watchlist
          </Link>
          <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Products</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>All Products</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}



async function getData() {
  
  const session = await auth()
  return {
      session,
  }
}   
