import { Card } from "@/components/ui/card";

export const Solution = () => {
    return (
      <>
      <section id="solution" className="bg-white w-full py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Optional: A pill or heading similar to previous sections */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-[#f7f7f7] border border-[#29293e26] rounded-full">
              <span className="font-semibold text-[#29293e] text-base">Our Solution</span>
            </div>
          </div>
  
          {/* Heading */}
          <h2 className="font-bold text-[#29293e] text-2xl text-center mb-12">
          Streamlined Data, Powerful Insights
          </h2>
          <p className="text-center text-md text-gray-400">
           Broadwalk aggregates data to provide insights into growth drivers and potential risks. We capture early warnings and trends through
          </p>
  
          {/* Image Grid */}
          <div className="grid gap-8 md:grid-cols-2 items-center pt-16">
            <div className="flex-shrink-0">
              <img src="/chart.svg" alt="Illustration 1" className="max-w-full h-auto" />
            </div>
           
           <div className="flex flex-col space-y-6">
              <div>
                <img src="/sentiment-1.svg" alt="Illustration 2" className="max-w-full h-auto" />
              </div>

              <div>
                <img src="/market.svg" alt="Illustration 3" className="max-w-full h-auto" />
              </div>
           </div>
            
          </div>
        </div>
      </section>
      </>
     
    );
  };
  