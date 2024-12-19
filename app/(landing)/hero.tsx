import { Button } from '@/components/ui/button'
import React from 'react'

export const Hero = () => {
    return (
        <div className="bg-[#f7f7f7] w-full flex justify-center max-h-screen">
            <div className="bg-[#f7f7f7] w-[1440px] relative h-auto pt-4 pb-0 px-10">
                {/* Main container with flex layout */}
                <div className="flex flex-col md:flex-row items-center md:items-center justify-between">
                    {/* Left Side: Text and Buttons */}
                    <div className="max-w-lg">
                        <p className="font-bold text-[#29293e] text-3xl leading-[46px] mb-4">
                            Corporate Intelligence Solutions.<br />
                            Delivering Insights, Not Just Data.
                        </p>

                        <p className="text-sm text-wireframetext-grey leading-6 mb-6">
                            Unlock market insight with AI-Powered intelligence. Stay ahead
                            of the competition with real-time data and actionable insight.
                        </p>

                        <div className="flex gap-4">
                        <a href="/api/auth/login">
                            <Button className="bg-[#141d2a] rounded-full px-8 py-2 text-white text-sm font-semibold hover:bg-[#0f1822] transition-colors">
                                Try For Free
                            </Button>
                          </a>
                        </div>
                    </div>

                    {/* Right Side: SVG Illustration */}
                    <div className="flex-shrink-0">
                      <img 
                        src="/property.svg" 
                        alt="Illustration" 
                        className="max-w-full h-auto" 
                       />
                    </div>
                </div>
            </div>
        </div>
    )
}
