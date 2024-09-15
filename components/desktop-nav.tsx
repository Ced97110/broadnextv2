'use client'

import Link from "next/link";
import { useState } from "react";
import { VercelLogo } from "./icons";
import { NavItem } from "@/app/nav-item";
import { Home, LineChart, Package, Settings, Store } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export default function DesktopNav({ isCollapsed, toggleSidebar }) {
  return (
    <aside
      className={`fixed hidden sm:flex  inset-y-0 left-0 z-10 md:flex flex-col border-r bg-background transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <nav className="flex flex-col items-center gap-4  py-5 w-full space-y-4">

        <div className={`flex items-center  gap-2 w-full  ${isCollapsed ? 'justify-center pl-0':'justify-start pl-2'} `}>
          <div className="flex items-center gap-2 justify-center">
            <Link
              href="/"
              className="group flex items-center h-9 text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
            >
              <VercelLogo />
              {!isCollapsed && <span className="ml-2 text-black">Broadwalk</span>}
            </Link>
          </div>
        </div>
      
        <div className="flex flex-col items-start space-y-3 w-full h-full">
          <NavItem href="/" label="Dashboard">
            <div className={`flex items-center  gap-2 w-full  ${isCollapsed ? 'justify-center pl-0':'justify-start pl-4'} `}>
              <Home className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Dashboard</span>}
            </div>
          </NavItem>

          <NavItem href="/companies" label="Companies">
            <div className={`flex items-center  gap-2 w-full  ${isCollapsed ? 'justify-center pl-0':'justify-start pl-4'} `}>
              <Store className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Companies</span>}
            </div>
          </NavItem>

          <NavItem href="#" label="My Watchlist">
            <div className={`flex items-center  gap-2 w-full  ${isCollapsed ? 'justify-center pl-0':'justify-start pl-4'} `}>
              <Package className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">My Watchlist</span>}
            </div>
          </NavItem>

          <NavItem href="#" label="Analytics">
            <div className={`flex items-center  gap-2 w-full  ${isCollapsed ? 'justify-center pl-0':'justify-start pl-4'} `}>
              <LineChart className="h-5 w-5" />
              {!isCollapsed && <span className="ml-2">Analytics</span>}
            </div>
          </NavItem>
        </div>
   
      </nav>

      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="sr-only">Toggle Sidebar</span>
            <span className="text-2xl">{isCollapsed ? '>' : '<'}</span> {/* Toggle Arrow */}
        </button>
      </nav>
    </aside>
  );
}