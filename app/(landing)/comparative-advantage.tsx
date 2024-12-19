
import React from 'react'
import { FaChartBar } from 'react-icons/fa'
import { MdInsights } from "react-icons/md";
import { RiRadarLine } from "react-icons/ri";
import { AiOutlineQuestionCircle, AiOutlineWarning } from "react-icons/ai";
import { FiTrendingUp } from "react-icons/fi";
import { IoIosPulse } from "react-icons/io";



export const ComparativeAdvantage = () => {
  return (
    <section id='advantage' className="bg-white w-full py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* "Our Competitive Advantage" pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#f7f7f7] border border-[#29293e26] rounded-full">
            <span className="font-semibold text-[#29293e] text-base">
              Our Competitive Advantage
            </span>
          </div>
        </div>

        {/* Main heading */}
        <h2 className="font-bold text-[#29293e] text-2xl text-center mb-12">
          Our Unique Approach to Market Intelligence
        </h2>

        {/* Cards Container */}
        <div className="space-y-8">
          {/* Card 1 - Qualitative Analysis */}
          <div className="max-w-5xl mx-auto bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              <MdInsights className="w-6 h-6 text-[#141d2a]" />
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Qualitative Analysis at the Core
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                We focus on qualitative analysis to provide deeper insights into 
                company performance and risks.
              </p>
            </div>
          </div>

          {/* Card 2 - Deep Insights from Multiple Sources */}
          <div className="max-w-5xl mx-auto bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              <RiRadarLine className="w-6 h-6 text-[#141d2a]" />
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Deep Insights from Multiple Sources
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                Gain actionable intelligence from social media, news, and 
                customer reviews, uncovering trends and sentiments.
              </p>
            </div>
          </div>

          {/* Card 3 - Answering Key Business Questions */}
          <div className="max-w-5xl mx-auto bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              <AiOutlineQuestionCircle className="w-6 h-6 text-[#141d2a]" />
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Answering Key Business Questions
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                Our platform addresses critical questions about company traction 
                and potential risks, helping you make informed decisions.
              </p>
            </div>
          </div>

          {/* Card 4 - Measure Traction and Risks */}
          <div className="max-w-5xl mx-auto bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-[#141d2a]" />
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Measure Traction and Risks
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                We track and measure company traction by analyzing social media 
                mentions, customer reviews, and news coverage.
              </p>
            </div>
          </div>

          {/* Card 5 - Monitor Engagement & Sentiment */}
          <div className="max-w-5xl mx-auto bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              <IoIosPulse className="w-6 h-6 text-[#141d2a]" />
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Monitor Engagement &amp; Sentiment
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                Monitor real-time engagement across platforms to assess company 
                performance and sentiment.
              </p>
            </div>
          </div>

          {/* Card 6 - Identify Emerging Risks Early */}
          <div className="max-w-5xl mx-auto bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6 flex items-start gap-4">
            <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full flex items-center justify-center">
              <AiOutlineWarning className="w-6 h-6 text-[#141d2a]" />
            </div>
            <div>
              <h3 className="font-bold text-wireframetext-black text-lg mb-2">
                Identify Emerging Risks Early
              </h3>
              <p className="text-sm text-gray-600 leading-6">
                Spot emerging risks and negative sentiments through comprehensive 
                monitoring of online discussions and trends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
