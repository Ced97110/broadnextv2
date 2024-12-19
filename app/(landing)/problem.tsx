import React from 'react'

export const Problem = () => {
  return (
    <section className="bg-white w-full py-16">
    <div className="max-w-screen-xl mx-auto px-4">
      {/* "The Problem" pill */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#f7f7f7] border border-[#29293e26] rounded-full">
          <span className="font-semibold text-[#29293e] text-base">The Problem</span>
        </div>
      </div>
      
      {/* Heading */}
      <h2 className="font-bold text-[#29293e] text-2xl text-center mb-12">
        Investors Face Challenges With
      </h2>
      
      {/* Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full mb-4" />
          <h3 className="font-bold text-lg text-[#29293e] mb-2">Fragmented Offerings</h3>
          <p className="text-sm text-gray-600 leading-6">
            Scattered tools make it hard to get a full picture.
          </p>
        </div>
  
        {/* Card 2 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full mb-4" />
          <h3 className="font-bold text-lg text-[#29293e] mb-2">Complex Integrations</h3>
          <p className="text-sm text-gray-600 leading-6">
            Connecting systems is difficult and time-consuming.
          </p>
        </div>
  
        {/* Card 3 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full mb-4">
            {/* If there's a specific icon (like subtract.svg), place it inside here:
                <img src="/subtract.svg" alt="icon" className="mx-auto my-auto" />
            */}
          </div>
          <h3 className="font-bold text-lg text-[#29293e] mb-2">Lack of Actionable Insights</h3>
          <p className="text-sm text-gray-600 leading-6">
            Too much data, not enough useful insights.
          </p>
        </div>
      </div>
    </div>
  </section>
  )
}
