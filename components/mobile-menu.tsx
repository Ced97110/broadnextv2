'use client'

import React, { useState } from 'react'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from './ui/navigation-menu';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import { VercelLogo } from './icons';
import { FiX } from 'react-icons/fi';
import { MenuLinks } from './header';
import { Avatar } from '@radix-ui/react-avatar';

export const MobileMenu = ({setMobileMenuOpen}) => {

    const { user, error, isLoading } = useUser();
    const pathname = usePathname(); 
    

    const handleLogout = () => {
        window.location.href = '/api/auth/logout';
    };


  return (
    <div>
        <div className="fixed inset-0 z-50 bg-white">
            <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
                <VercelLogo width={56} height={56} color='text-black' />
            </div>
            <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="text-2xl"
            >
                <FiX />
            </button>
            </div>
            <div className="flex flex-col space-y-4 p-4">
            {MenuLinks.map(({ name, href, icon: Icon }, i) => {
                // Determine if the current path matches the link's href
                const isActive = pathname === href || pathname.startsWith(`${href}/company`) || pathname.startsWith(`${href}/news`) 
                return (
                    <div>

                       
                    </div>
                );
            })}
            </div>
        </div>
    </div>
  )
}
                                         