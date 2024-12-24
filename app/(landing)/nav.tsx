'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

export default function NavbarLanding() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 z-50">
      <div className="max-w-screen-xl px-5 h-[94px] flex items-center justify-between">
        
        {/* Left section: Brand */}
        <div className="flex items-center gap-2">
          {/* Icon Placeholder */}
          <div className="flex items-center justify-center">
              <Image src="/logo.png" alt='logo' width={70} height={70} />
            <div className="w-2 h-2 bg-brand-color rounded" />
          </div>
          <span className="font-semibold text-brand-color text-[15px] whitespace-nowrap">
            Broadwalk
          </span>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-sm text-[#29293e] hover:underline">The Problem</a>
          <a href="#solution" className="text-sm text-[#29293e] hover:underline">Our Solution</a>
          <a href="#advantage" className="text-sm text-[#29293e] hover:underline">Competitive Advantage</a>
          <a href="#financial" className="text-sm text-[#29293e] hover:underline">Financial Insights</a>
          <a href="#serve" className="text-sm text-[#29293e] hover:underline">Who We Serve</a>
        </div>

        {/* Right section: App Link and Register */}
        <div className="hidden lg:flex items-center gap-8">
          
          <a href="/api/auth/login">
           <Button className="bg-[#141d2a] rounded-full px-8 py-2 text-white text-sm font-semibold hover:bg-[#0f1822] transition-colors">
             Sign Up / Log in
          </Button>
          </a>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="outline"
          className="md:hidden text-black focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
         <HamburgerMenuIcon/>
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 px-4 py-4">
          <ul className="flex flex-col gap-4">
          <a href="#problem" className="text-sm text-[#29293e] hover:underline">The Problem</a>
          <a href="#solution" className="text-sm text-[#29293e] hover:underline">Our Solution</a>
          <a href="#advantage" className="text-sm text-[#29293e] hover:underline">Competitive Advantage</a>
          <a href="#financial" className="text-sm text-[#29293e] hover:underline">Financial Insights</a>
          <a href="#serve" className="text-sm text-[#29293e] hover:underline">Who We Serve</a>
            <li>
             <a href="/api/auth/login">
              <Button className="bg-[#141d2a] rounded-full px-8 py-2 text-white text-sm font-semibold hover:bg-[#0f1822] transition-colors">
                Sign Up / Log in
              </Button>
             </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}