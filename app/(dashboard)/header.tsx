'use client'

import { VercelLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { 
    NavigationMenu, 
    NavigationMenuContent, 
    NavigationMenuItem, 
    NavigationMenuLink, 
    NavigationMenuList, 
    NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { useUser } from '@auth0/nextjs-auth0/client';
import { Home, Newspaper, Store, LogIn, LogOut } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // For App Router
// If using Pages Router, use: import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FiChevronDown, FiLogOut } from 'react-icons/fi';
import Loading from './load';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const MenuLinks = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: Home,
    },
    {
        name: 'News',
        href: '/news',
        icon: Newspaper,
    },
    {
        name: 'Companies',
        href: '/dashboard/companies',
        icon: Store,
    }
]

export const Header = () => {

  const { user, error, isLoading } = useUser();
  const pathname = usePathname(); 
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

    return (
      <header className="w-full fixed top-0 z-30 h-20 bg-[#141d2a] flex justify-between items-center px-4 mb-16">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <VercelLogo width={56} height={56} />
        </div>

        {/* Center Section: Navigation Menu */}
        <div className="flex-1 flex justify-center">
          <NavigationMenu className="flex justify-center items-center">
            <NavigationMenuList className="flex items-center space-x-4">
              {MenuLinks.map(({ name, href, icon: Icon }, i) => {
                // Determine if the current path matches the link's href
                const isActive = pathname === href || pathname.startsWith(`${href}/company`) || pathname.startsWith(`${href}/news`) 
                
                
                return (
                  <NavigationMenuItem key={i}>
                    <NavigationMenuLink 
                      href={href} 
                      className={`flex items-center ${
                        isActive ? 'text-white' : 'text-white opacity-30'
                      } hover:text-blue-300`}
                    >
                      {Icon && <Icon className="w-6 h-6 mr-2" />}
                      {name}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section: User Controls */}
        <div className="flex items-center space-x-4">
          {isLoading && <Loading />}
          {error && <p className="text-red-500">Error: {error.message}</p>}
          {!isLoading && !user && (
            <a href="/api/auth/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                <LogIn className="mr-2" /> Login
              </button>
            </a>
          )}
          {user && (
            <div className="relative">
              <Button
                onClick={toggleDropdown}
                className="flex items-center focus:outline-none"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                <Avatar>
                  <AvatarImage src={user.picture}  alt={user.name} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <FiChevronDown className="ml-1 text-white" />
              </Button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                  {/* Profile Link (Optional) */}
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </a>
                  {/* Settings Link (Optional) */}
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FiLogOut className="mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    )
}

export default Header;