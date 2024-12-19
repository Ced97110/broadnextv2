import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'

export const Footer = () => {
  return (
    <section className="bg-white w-full py-16">
  <div className="max-w-screen-xl mx-auto px-4 flex flex-col lg:flex-row items-start gap-8 relative">
    {/* Left Content */}
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-[#29293e] mb-4 text-center lg:text-left">
        Get Started with Broadwalk Today
      </h2>
      <p className="text-sm text-gray-600 leading-6 mb-6">
        Unlock powerful insights and make informed investment decisions in just a few 
        simple steps. Start exploring opportunities, analyzing trends, and downloading 
        actionable data now.
      </p>
      <a href="/api/auth/login">
        <Button className="bg-[#141d2a] rounded-full px-8 py-2 text-white text-sm font-semibold hover:bg-[#0f1822] transition-colors">
          Try For Free
       </Button>
      </a>
    </div>

    {/* Right Image - Adjust the src as needed */}
    <div className="flex-1 flex justify-center lg:justify-end">
     
    </div>
  </div>

  {/* Horizontal Divider */}
  <div className="max-w-screen-xl mx-auto px-4 mt-12">
    <hr className="border-gray-200" />
  </div>

  {/* Footer Section */}
  <div className="max-w-screen-xl mx-auto px-4 mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
    <div className="flex items-center gap-2">
      {/* Replace with your brand icon */}
      <div className="rounded-full flex items-center justify-center">
       <Image src="/logo.png" alt='logo' width={40} height={40} />
      </div>
      <span className="font-semibold text-[#141d2a]">Broadwalk</span>
    </div>
    <p className="mt-2 sm:mt-0">
      © Copyright 2024 Broadwalk, All rights reserved.
    </p>
  </div>
</section>
  )
}
