'use client'

import { VercelLogo } from '@/components/icons'
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu'
import { Home, Newspaper, Store } from 'lucide-react'
import React from 'react'


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
        href: 'dashboard/companies',
        icon: Store ,
    }
]



export const Header = () => {
    return (
        <header className="w-full fixed top-0 z-30 h-20 bg-[#141d2a] flex justify-between items-center px-4 mb-16">
            <div className='flex items-center'>
            <VercelLogo width={56} height={56} /> 
            </div>
            <div className='flex-1 flex justify-center'>
            <NavigationMenu className="flex justify-center items-center">
                <NavigationMenuList className="flex items-center space-x-4">
                {MenuLinks.map(({ name, href, icon: Icon }, i) => (
                    <NavigationMenuItem key={i}>
                    <NavigationMenuLink href={href} className="text-white flex items-center">
                        {Icon && <Icon className="w-6 h-6 mr-2" />}
                        {name}
                    </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
                </NavigationMenuList>
            </NavigationMenu>
            </div>
        </header>
    )
}
