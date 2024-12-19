import React from "react";


export const UserExperience = () => {
  return (
    <>
    <section id="frames" className="bg-white w-full py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Pill */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#f7f7f7] border border-[#29293e26] rounded-full">
              <span className="font-semibold text-[#29293e] text-base">User Experience</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="font-bold text-[#29293e] text-2xl text-center mb-12">
            Empowering Informed Investment Decisions
          </h2>

          {/* Image Container */}
          <div className="flex justify-center">
            <img 
              src="/companies.svg" 
              alt="Illustration" 
              className="mx-auto w-full max-w-4xl h-auto" 
            />
          </div>
        </div>
    </section>
    </>
   
  );
};
