import { CardNews } from "@/app/card-news";
import { prepareData } from "@/app/data";
import { Chat } from "../financial/chat";
import { Card } from "@/components/ui/card";
import OpenAI from "openai";
import { cacheResponse, generateCacheKey, getCachedResponse, getOpenAIResponse } from "../financial/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAccessToken } from "@auth0/nextjs-auth0";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



export default async function NewsPage({ params }: { params: { id: string } }) {
  console.log('params', params.id);

  const { accessToken } = await getAccessToken();

  

  const [newsData, company] = await Promise.all([
    prepareData(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${params.id}`,accessToken),
    prepareData(
      `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${params.id}`,
      accessToken
    ),

  ]);

  const merged = {...newsData, ...company}


  const prompt = `
        You are an expert financial analyst specializing in providing insights for hedge fund investors. Analyze the following array of news articles related to a specific company—**Tesla**. Extract and summarize the key insights focusing on **market trends** that could impact investment decisions. Your summary should highlight:

        - **Industry Growth:** Trends in the electric vehicle (EV) market and related industries.
        - **Competitive Landscape:** Movements and strategies of Tesla's main competitors.
        - **Consumer Behavior:** Shifts in consumer preferences and adoption rates of EVs.
        - **Economic Indicators:** Relevant economic factors such as supply chain developments, raw material prices, and technological advancements.

        **Requirements:**

        - Write a concise, data-driven summary of approximately 200-300 words.
        - Use a formal and professional tone suitable for hedge fund investors.
        - Ensure the summary is objective and based solely on the provided articles.
        - Do not include personal opinions or external information not present in the articles.

        **News Articles Data:**

        ${JSON.stringify(merged, null, 2)}
    `;


      const prompt1 = `
            You are an expert financial analyst specializing in providing insights for hedge fund investors. Analyze the following array of news articles related to a specific company—**Tesla**. Extract and summarize the key insights focusing on **announcements and challenges** that could impact investment decisions. Your summary should highlight:

        - **Significant Announcements:** New product launches, strategic partnerships, or corporate initiatives.
        - **Operational Challenges:** Supply chain issues, production delays, or logistical hurdles.
        - **Financial Obstacles:** Revenue fluctuations, debt management, or cost-related challenges.
        - **Market Risks:** Potential threats from market volatility, regulatory changes, or geopolitical factors.

        **Requirements:**

        - Write a concise, data-driven summary of approximately 200-300 words.
        - Use a formal and professional tone suitable for hedge fund investors.
        - Ensure the summary is objective and based solely on the provided articles.
        - Do not include personal opinions or external information not present in the articles.

        **News Articles Data:**

        ${JSON.stringify(merged, null, 2)}
    `;



      const prompt2 = `
            You are an expert financial analyst specializing in providing insights for hedge fund investors. Analyze the following array of news articles related to a specific company—**Tesla**. Extract and summarize the key insights focusing on **regulatory matters and legal issues** that could impact investment decisions. Your summary should highlight:

        - **Regulatory Changes:** New laws, regulations, or compliance requirements affecting Tesla.
        - **Legal Proceedings:** Ongoing or potential lawsuits, legal disputes, or compliance investigations.
        - **Government Policies:** Incentives, subsidies, or restrictions imposed by governments that influence Tesla's operations.
        - **Environmental Regulations:** Standards and policies related to emissions, sustainability, and environmental impact.

        **Requirements:**

        - Write a concise, data-driven summary of approximately 200-300 words.
        - Use a formal and professional tone suitable for hedge fund investors.
        - Ensure the summary is objective and based solely on the provided articles.
        - Do not include personal opinions or external information not present in the articles.

        **News Articles Data:**

        ${JSON.stringify(merged, null, 2)}
      `;


    const [response, responsePrompt1, responsePrompt2] = await Promise.all([

      getOpenAIResponse(prompt),
      getOpenAIResponse(prompt1),
      getOpenAIResponse(prompt2)

    ]);
      
    const summary = response.choices[0].message.content.trim(); 
    const summary1 = responsePrompt1.choices[0].message.content.trim(); 
    const summary2 = responsePrompt2.choices[0].message.content.trim(); 
 
  console.log('OpenAI Response:', response);
  console.error('Error fetching OpenAI response:');


  console.log('EntitiesNews', newsData);

  return (
    <section className="w-full flex flex-col space-y-12  relative">
      <div className="flex flex-col space-y-12 p-2 relative">
      <div className="flex w-full py-12 px-12">
      <Tabs defaultValue="Market Trends" orientation="vertical" className="w-full flex flex-row space-x-6">
        <TabsList className="flex flex-col items-start space-y-2 mt-10">
          <TabsTrigger value="Market Trends">Market trends</TabsTrigger>
          <TabsTrigger value="Announcements">Announcement</TabsTrigger>
          <TabsTrigger value="Regulatory Matters">Regulatory matters</TabsTrigger>
        </TabsList>
  
        <div className="w-full">
          <TabsContent value="Market Trends">
          <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{summary}</Card>
          </TabsContent>
          <TabsContent value="Announcements">
            <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{summary1}</Card>
          </TabsContent>
          <TabsContent value="Regulatory Matters">
            <Card className='p-6' style={{ whiteSpace: 'pre-line' }}>{summary2}</Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
      </div>
   
      <div className="grid grid-cols-3 gap-3 relative py-8">
        <div className="col-span-2 grid grid-cols-2 gap-2">
          {newsData && newsData.Results?.map((news: any,i) => (
            <CardNews key={i} {...news} />
          ))}
        </div>
        <div className="sticky top-0 right-0 col-span-1 h-screen overflow-y-scroll">
          <Chat raw={newsData.Results} endpoint='news' company={company} title={`Ask for insights from ${company?.Name}`}  />
        </div>
      </div>
    </section>
  );
}
