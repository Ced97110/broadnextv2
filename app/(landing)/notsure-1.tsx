import React from "react";


export const Frame = () => {
  return (
    <>
    <section id="frames" className="bg-white w-full py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Optional: A pill or heading similar to previous sections */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#f7f7f7] border border-[#29293e26] rounded-full">
            <span className="font-semibold text-[#29293e] text-base">Financial Insight</span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="font-bold text-[#29293e] text-2xl text-center mb-12">
          Transforming Financial Data into Actionable Insights
        </h2>

        {/* Image Grid */}
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="flex-shrink-0">
            <img src="/frame-1.svg" alt="Illustration 2" className="max-w-full h-auto" />
          </div>
          <div className="flex-shrink-0">
            <img src="/frame.svg" alt="Illustration 1" className="max-w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
    </>
   
  );
};
