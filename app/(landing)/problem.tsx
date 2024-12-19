import React from 'react'
import { FiGrid } from "react-icons/fi";
import { BiGitBranch } from "react-icons/bi";
import { AiOutlineFileSearch } from "react-icons/ai";

export const Problem = () => {
  return (
    <section id='problem' className="bg-white w-full py-16">
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
        {/* Card 1: Fragmented Offerings */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full mb-4 flex items-center justify-center">
            <FiGrid className="w-6 h-6 text-[#141d2a]" />
          </div>
          <h3 className="font-bold text-lg text-[#29293e] mb-2">Fragmented Offerings</h3>
          <p className="text-sm text-gray-600 leading-6">
            Scattered tools make it hard to get a full picture.
          </p>
        </div>

        {/* Card 2: Complex Integrations */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full mb-4 flex items-center justify-center">
            <BiGitBranch className="w-6 h-6 text-[#141d2a]" />
          </div>
          <h3 className="font-bold text-lg text-[#29293e] mb-2">Complex Integrations</h3>
          <p className="text-sm text-gray-600 leading-6">
            Connecting systems is difficult and time-consuming.
          </p>
        </div>

        {/* Card 3: Lack of Actionable Insights */}
        <div className="bg-[#f7f7f7] border border-[#efefef] rounded-2xl p-6">
          <div className="w-[52px] h-[52px] bg-white border border-[#efefef] rounded-full mb-4 flex items-center justify-center">
            <AiOutlineFileSearch className="w-6 h-6 text-[#141d2a]" />
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
