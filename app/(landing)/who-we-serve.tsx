import React from 'react'

export const WhoWeServe = () => {
  return (
    <section id='serve' className="bg-white w-full py-16">
    <div className="max-w-screen-xl mx-auto px-4">
      {/* "Who We Serve" Pill */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#f7f7f7] border border-[#29293e26] rounded-full">
          <span className="font-semibold text-[#29293e] text-base">Who We Serve</span>
        </div>
      </div>
  
      {/* Heading */}
      <h2 className="font-bold text-[#29293e] text-2xl text-center mb-12">
        Designed for Key Market Players
      </h2>
  
      {/* Cards Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Card 1 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              {/* Icon placeholder */}
              {/* Example: 
              <div className="w-6 h-6">
                <img src="/subtract-2.svg" alt="icon" className="w-full h-full" />
              </div>
              */}
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Venture Capitalists
              </h3>
              <p className="text-sm text-gray-600 leading-6 w-[560px] max-w-full">
                Empowering VCs with insights to identify high-growth startups and assess investment opportunities.
              </p>
            </div>
          </div>
        </div>
  
        {/* Card 2 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              {/* Icon placeholder */}
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Hedge Fund Analysts
              </h3>
              <p className="text-sm text-gray-600 leading-6 w-[560px] max-w-full">
                Providing hedge fund analysts with data to optimize portfolio performance and identify market trends.
              </p>
            </div>
          </div>
        </div>
  
        {/* Card 3 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              {/* Icon placeholder */}
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Corporate Development Teams
              </h3>
              <p className="text-sm text-gray-600 leading-6 w-[560px] max-w-full">
                Helping corporate teams make strategic decisions on mergers, acquisitions, and partnerships.
              </p>
            </div>
          </div>
        </div>
  
        {/* Card 4 */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              {/* Icon placeholder */}
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Investment Bankers
              </h3>
              <p className="text-sm text-gray-600 leading-6 w-[560px] max-w-full">
                Supporting investment bankers with critical financial insights to guide complex transactions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  )
}
