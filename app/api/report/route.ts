// /pages/api/ai-agent-report.js


import { Chart } from 'chart.js/auto';
import { prepareData, prepareDataSentiment } from '@/app/data';
import { cacheResponse, generateCacheKey, getCachedResponse } from '@/app/(dashboard)/dashboard/company/[id]/financial/page';
import OpenAI from 'openai';
import fetch from 'node-fetch';   // Correct ESM import for node-fetch
import QuickChart from 'quickchart-js';  // Correct ESM import for QuickChart
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';  // Import for PDF generation
import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0';
import { useMemo } from 'react';
import processData from '@/app/(dashboard)/dashboard/company/[id]/financial/memoize';



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  
  

export  async function POST(req, res) {
  const { accessToken } = await getAccessToken();

  const { userRequest } = req.body;

  const id = '1527'

  try {

        const [financials, company,newsData,relation,entities,positiveSentiment,negativeSentiment,sentimentSeries] = await Promise.all([
            prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: 'no',
            periodParams: { periodType: '0' },
            PeriodStartDate: '',
            PeriodEndDate: '',
            endpoint: 'FinancialCharts',
            }),
            prepareData(
            `https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${id}`,
            accessToken

            ),
            prepareData(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${id}`,accessToken),
            prepareData(
            `https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/Relations?CompanyId=${id}`,
            accessToken
            ),
            prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: 'no',
            periodParams: { periodType: '0' },
            PeriodStartDate: '',
            PeriodEndDate: '',
            endpoint: 'Entities',
            SignalSource: '1',
            token: accessToken,
            }),
            prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: 'no',
            periodParams: { periodType: '0' },
            PeriodStartDate: '',
            PeriodEndDate: '',
            FilterSentiment: '1',
            endpoint: 'Entities',
            SignalSource: '1',
            token: accessToken,
            }),
            prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: 'no',
            periodParams: { periodType: '0' },
            PeriodStartDate: '',
            PeriodEndDate: '',
            FilterSentiment: '2',
            endpoint: 'Entities',
            SignalSource: '1',
            token: accessToken,
            }),
            prepareDataSentiment({
            CompanyId: id,
            AddNeutralSignal: 'no',
            periodParams: { periodType: '0' },
            PeriodStartDate: '',
            PeriodEndDate: '',
            endpoint: 'SentimenSeries',
            SignalSource: '1',
            token: accessToken,
            }),
        ]);

        console.log('Data fetched successfully',financials,company,newsData,relation,);
        const datafinance = await processData(financials);

        const {
            executiveSummary,
            financialSummary,
            sentimentSummary,
            newsSummary,
            recommendations,
          } = await generateSummaries({
            datafinance,
            company,
            newsData,
            sentimentSeries,
            entities,
            positiveSentiment,
            negativeSentiment,
          });

          const formatFinancialSummary = (summary) => {
            // Replace numbered points with <br> for line breaks, or bullet points.
            return summary
              .replace(/(\d+)\./g, '<br><strong>$1.</strong>')  // Makes 1., 2., etc. bold
              .replace(/-/g, '•')  // Convert dashes to bullet points
              .replace(/\n/g, '<br>');  // Ensure line breaks are preserved
          };
          
          // Example of calling the function to format financial summary
          const formattedFinancialSummary = formatFinancialSummary(
            financialSummary.choices[0].message.content.trim()
          );
          const formattedExecutiveSummary = formatFinancialSummary(
            executiveSummary.choices[0].message.content.trim()
          );

        

        
        async function generateLiquiditySolvencyChart(financials) {
          const chart = new QuickChart();
      
          // Extract liquidity and solvency data
          const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results;
          const currentRatio = financials.Results?.find(item => item.Label === 'Current Ratio')?.Results.map(Number);
          const quickRatio = financials.Results?.find(item => item.Label === 'Quick Ratio')?.Results.map(Number);
          const debtToEquity = financials.Results?.find(item => item.Label === 'Debt-to-Equity Ratio')?.Results.map(Number);
      
          // Configure the chart
          chart.setConfig({
              type: 'bar',
              data: {
                  labels: quarters, // X-axis labels
                  datasets: [
                      {
                          label: 'Current Ratio',
                          data: currentRatio,
                          backgroundColor: 'rgba(54, 162, 235, 0.7)',
                          borderColor: 'rgba(54, 162, 235, 1)',
                      },
                      {
                          label: 'Quick Ratio',
                          data: quickRatio,
                          backgroundColor: 'rgba(75, 192, 192, 0.7)',
                          borderColor: 'rgba(75, 192, 192, 1)',
                      },
                      {
                          label: 'Debt-to-Equity Ratio',
                          data: debtToEquity,
                          backgroundColor: 'rgba(255, 99, 132, 0.7)',
                          borderColor: 'rgba(255, 99, 132, 1)',
                      }
                  ],
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: true,
                          title: {
                              display: true,
                              text: 'Ratio',
                          },
                      },
                      x: {
                          title: {
                              display: true,
                              text: 'Quarter',
                          },
                      },
                  },
                  plugins: {
                      legend: {
                          display: true,
                          position: 'top',
                      },
                  },
              },
          });
      
          chart.setWidth(800).setHeight(400).setBackgroundColor('white');
          return await chart.getShortUrl();
      }

     

  async function generateProfitabilityChart(financials) {
    const chart = new QuickChart();

    // Extract profitability data
    const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results;
    const netProfitMargin = financials.Results?.find(item => item.Label === 'Net Profit Margin')?.Results.map(value => (value * 100).toFixed(2));
    const operatingMargin = financials.Results?.find(item => item.Label === 'Operating Margin')?.Results.map(value => (value * 100).toFixed(2));

    // Configure the chart
    chart.setConfig({
        type: 'bar',
        data: {
            labels: quarters, // X-axis labels
            datasets: [
                {
                    label: 'Net Profit Margin (%)',
                    data: netProfitMargin,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                },
                {
                    label: 'Operating Margin (%)',
                    data: operatingMargin,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                }
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Margin (%)',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Quarter',
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
            },
        },
    });

    chart.setWidth(800).setHeight(400).setBackgroundColor('white');
    return await chart.getShortUrl();
}


async function generateChallengesRisksChart(financials) {
  const chart = new QuickChart();

  // Extract challenges & risks data
  const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results;
  const interestCoverage = financials.Results?.find(item => item.Label === 'Interest Coverage Ratio')?.Results.map(Number);
  const assetTurnover = financials.Results?.find(item => item.Label === 'Asset Turnover')?.Results.map(Number);

  // Configure the chart
  chart.setConfig({
      type: 'bar',
      data: {
          labels: quarters, // X-axis labels
          datasets: [
              {
                  label: 'Interest Coverage Ratio',
                  data: interestCoverage,
                  backgroundColor: 'rgba(255, 206, 86, 0.7)',
                  borderColor: 'rgba(255, 206, 86, 1)',
              },
              {
                  label: 'Asset Turnover',
                  data: assetTurnover,
                  backgroundColor: 'rgba(231, 233, 237, 0.7)',
                  borderColor: 'rgba(231, 233, 237, 1)',
              }
          ],
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Value',
                  },
              },
              x: {
                  title: {
                      display: true,
                      text: 'Quarter',
                  },
              },
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
              },
          },
      },
  });

  chart.setWidth(800).setHeight(400).setBackgroundColor('white');
  return await chart.getShortUrl();
}

async function generateValuationChart(financials) {
  const chart = new QuickChart();

  // Extract valuation data
  const quarters = financials.Results?.find(item => item.Label === 'QUARTER')?.Results;
  const peRatio = financials.Results?.find(item => item.Label === 'Price-to-Earnings (P/E) Ratio')?.Results.map(Number);
  const pbRatio = financials.Results?.find(item => item.Label === 'Price-to-Book (P/B) Ratio')?.Results.map(Number);

  // Configure the chart
  chart.setConfig({
      type: 'bar',
      data: {
          labels: quarters, // X-axis labels
          datasets: [
              {
                  label: 'P/E Ratio',
                  data: peRatio,
                  backgroundColor: 'rgba(75, 192, 192, 0.7)',
                  borderColor: 'rgba(75, 192, 192, 1)',
              },
              {
                  label: 'P/B Ratio',
                  data: pbRatio,
                  backgroundColor: 'rgba(54, 162, 235, 0.7)',
                  borderColor: 'rgba(54, 162, 235, 1)',
              }
          ],
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: 'Value',
                  },
              },
              x: {
                  title: {
                      display: true,
                      text: 'Quarter',
                  },
              },
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
              },
          },
      },
  });

  chart.setWidth(800).setHeight(400).setBackgroundColor('white');
  return await chart.getShortUrl();
}

async function generateAllCharts(financials) {
  const liquiditySolvencyChart = await generateLiquiditySolvencyChart(financials);
  const profitabilityChart = await generateProfitabilityChart(financials);
  const challengesRisksChart = await generateChallengesRisksChart(financials);
  const valuationChart = await generateValuationChart(financials);

  console.log('Liquidity & Solvency Chart:', liquiditySolvencyChart);
  console.log('Profitability Chart:', profitabilityChart);
  console.log('Challenges & Risks Chart:', challengesRisksChart);
  console.log('Valuation Chart:', valuationChart);

  return {
      liquiditySolvencyChart,
      profitabilityChart,
      challengesRisksChart,
      valuationChart,
  };
}
          const data = {
            executiveSummary: formattedExecutiveSummary,
            financialSummary: formattedFinancialSummary,
            sentimentSummary: sentimentSummary.choices[0].message.content.trim(),
            newsSummary: newsSummary.choices[0].message.content.trim(),
            recommendations: recommendations.choices[0].message.content.trim(),
            companyName: company.Name,
            financialChart: await generateAllCharts(financials),
            relation: relation,
            company: company,
          };


          console.log('Data generated successfully:', data);
          console.log('Data generated successfully:', data.executiveSummary);

           // Generate the PDF using fetch
           const base64PDF = await generatePDFWithAPI(data);

           if (!base64PDF || !base64PDF.response) {
            throw new Error('Failed to generate PDF');
          }
      
          // Convert the base64-encoded PDF to a buffer
          const buffer = Buffer.from(base64PDF.response, 'base64');
      
          console.log('PDF generated successfully:', buffer);
      
          // Return the PDF as a downloadable response
          return new NextResponse(buffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename=Company_Report.pdf',
            },
          });
  } catch (error) {
    console.error('Error generating summary:', error.message);
    return new Response(JSON.stringify({ message: 'Error generating summary', error: error.message }), { status: 500 });
  }
      

}



async function generatePDFWithAPI(data): Promise<any> {
  const apiKey =  process.env.PDFKEY // Use your PDF Generator API key
  const templateId = '1209971';   // Use the template ID you created in PDF Generator API

  const options = {
    method: 'POST',
    headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI0NjU5ZmFhYjU5YWVhN2E4YzM4NGY1MWIwYTQyMjY2M2U0N2I5ZWI2ODQ0NzEwZTA2M2Y2YmQzZjY3MmQ0Njg4Iiwic3ViIjoiY2VkbWFuY2hhdUBnbWFpbC5jb20iLCJleHAiOjE3MjcwNzQ2MDZ9.b6-wVsJOfuU3YX36dHCCSaQ4McmjwaHSyRUaLRbdJqg",
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
      template: {
        id: templateId,
        data: data,  // The dynamic data for your template
      },
      format: 'pdf',
      output: 'base64',  // You can also choose 'base64' if you want the raw data instead
      name: 'Company Report',  // The name for the generated PDF
    }),
  };

  try {
    const response = await fetch('https://us1.pdfgeneratorapi.com/api/v4/documents/generate', options);

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`);
    }


    const responseData = (await response.json()) 
     
    console.log('PDF generated successfully:', responseData);
    
    // The URL of the generated PDF
    const base64PDF = responseData  // The base64-encoded PDF document
    return base64PDF;
  } catch (error) {
    console.error('Error generating PDF with API:', error.message);
    throw new Error('PDF generation failed');
  }
}







async function generateSummaries({
    datafinance,
    company,
    newsData,
    sentimentSeries,
    entities,
    positiveSentiment,
    negativeSentiment,
  }) {
    // Executive Summary Prompt
    const executiveSummaryPrompt = `
  
      Executive Summary of  ${company.Name}

        Provide a high-level executive summary of the company, summarizing its financial performance, key developments, and overall market outlook. The executive summary should serve as a concise overview for stakeholders such as executives, investors, or board members.

          1.	Company Overview:
        Briefly introduce the company, its core business model, and industry positioning. Highlight any notable achievements or strategic focus areas that set the company apart within its sector.
        Company Name:
        ${company.Name}
          2.	Financial Performance Overview:
        Summarize the company’s recent financial performance, focusing on key metrics that reflect its health and stability. Address important financial figures such as Revenue, Net Income, Profit Margins, and Return on Equity (ROE). Provide a high-level assessment of the company’s liquidity and solvency, using key ratios such as the Current Ratio and Debt to Equity Ratio.
        Financial Data Highlights:
        ${JSON.stringify((datafinance))}
        What do these numbers suggest about the company’s ability to maintain profitability, manage debt, and capitalize on growth opportunities?
          3.	Recent News and Key Developments:
        Summarize the most recent and impactful news regarding the company. Highlight any positive developments such as new product launches, partnerships, or financial results. Also, address any challenges or risks, including competitive pressures, regulatory issues, or operational setbacks.
        Recent News:
        ${newsData.Results.slice(0, 3).map((news) => news.Title).join(', ')}
        How have these developments affected the company’s reputation and future prospects?
          4.	Market Sentiment and Stakeholder Outlook:
        Provide an overview of market sentiment, integrating feedback from investors, analysts, and customers. Is the sentiment around the company largely positive or negative? How is the company perceived in terms of its ability to navigate market challenges, innovate, or grow its market share? Highlight any significant shifts in sentiment based on recent performance or external conditions.
          5.	Overall Strategic Outlook:
        Conclude the executive summary with a forward-looking statement about the company’s strategic priorities and potential growth opportunities. Based on the financial overview, news analysis, and sentiment, what should stakeholders expect in terms of the company’s future performance? Are there areas of concern or opportunity that may require strategic adjustments?


    `;
   
  
    // Financial Summary Prompt
    const financialSummaryPrompt = `
      Comprehensive Financial Analysis of the Company

      Based on the latest financial data, evaluate the company’s overall financial health by analyzing key metrics related to liquidity, solvency, profitability, growth, and valuation. Specifically, address the following:

        1.	Financial Health & Stability:
        •	Assess liquidity and solvency through the Current Ratio, Quick Ratio, and Debt to Equity Ratio.
        •	Analyze profitability using the Net Profit Margin and Return on Equity (ROE).
      What do these metrics indicate about the company’s financial position, and are there areas of concern or opportunities for improvement?
        2.	Challenges & Risks:
        •	Evaluate the company’s performance through the Revenue Growth Rate, Gross Margin, Operating Margin, Interest Coverage Ratio, and Asset Turnover.
      What do these figures suggest about the company’s competitive positioning and potential vulnerabilities, including risks related to competition or operational challenges?
        3.	Valuation & Market Sentiment:
        •	Examine the company’s valuation metrics, such as the Price to Earnings (P/E) Ratio of 25x (vs. industry average of 20x), the Price to Book (P/B) Ratio of 3.5x (vs. industry average of 2.5x), and a Dividend Yield of 2% (vs. industry average of 3%).
      Based on these valuation ratios, is the company overvalued, undervalued, or fairly valued? What are the implications for investors?

      Provide a holistic analysis of the company’s financial health, including areas of strength, potential risks, and how its valuation compares to industry standards.
      ${JSON.stringify(datafinance)}
    `;
   
  
    // Sentiment Summary Prompt
    const sentimentSummaryPrompt = `
      Analyze the sentiment data for the company by evaluating both positive and negative sentiment trends across various financial and operational metrics. Provide a detailed assessment of the following:

        1.	Positive Sentiment Analysis:
        •	Evaluate the key drivers of positive sentiment, such as strong financial performance, positive news coverage, product innovations, or market expansion. Consider metrics like Revenue Growth, Net Profit, Return on Equity (ROE), and other relevant indicators.
      How do these metrics reflect favorable market sentiment, and what are the potential long-term benefits for the company’s reputation and investor confidence?
      Positive Sentiment Data:
      ${JSON.stringify( datafinance)}
        2.	Negative Sentiment Analysis:
        •	Identify factors contributing to negative sentiment, including underperformance, unfavorable market conditions, financial weaknesses, or operational challenges. Analyze metrics such as Declining Margins, Debt Levels, Competition Risks, and other concerns.
      What are the underlying causes of negative sentiment, and how might they impact the company’s market perception and future prospects?
      Negative Sentiment Data:
      ${JSON.stringify(datafinance)}
        3.	Overall Sentiment Trend:
        •	Provide a holistic view of the overall sentiment trend by integrating both positive and negative aspects. Assess whether the overall sentiment is skewed positively or negatively, and evaluate the potential for future sentiment shifts based on upcoming events, earnings reports, or market developments.
      What is the overarching narrative around the company, and how might this influence investor behavior or market positioning?
      Overall Sentiment Data:
      ${JSON.stringify(datafinance)}
    `;
    
  
    // News Summary Prompt
    const newsSummaryPrompt = `
      Comprehensive News Summary and Insights for the Company

      Analyze the recent news coverage of the company to extract valuable insights that could influence its financial outlook, market position, and investor sentiment. Summarize the key points from the latest news articles, and address the following aspects:

        1.	Positive Developments:
        •	Identify any news highlighting favorable developments such as new product launches, strategic partnerships, market expansions, or positive earnings reports. Discuss how these stories reflect the company’s strengths and potential for future growth.
      What implications do these positive developments have on the company’s reputation and market position?
        2.	Challenges and Risks Highlighted:
        •	Summarize any news that outlines operational challenges, financial risks, or regulatory pressures the company may be facing. Examine issues like competition, supply chain disruptions, leadership changes, or negative market sentiment.
      How might these challenges affect the company’s strategic direction or investor confidence?
        3.	Market Reactions and Investor Sentiment:
        •	Evaluate any market reactions mentioned in the news, such as stock price movements, analyst opinions, or shifts in investor sentiment. How are stakeholders responding to the company’s recent performance or announcements?
      What is the overall tone of these articles—positive, negative, or neutral—and how might this affect the company’s short- to medium-term prospects?
        4.	Key Insights for Investors:
        •	Based on the summarized articles, provide key insights for investors to consider. Are there emerging trends or signals that suggest future opportunities or risks? What can investors infer about the company’s strategic priorities, financial health, or competitive position?

      News Summary Based on Recent Articles:
       ${newsData.Results.slice(0, 5).map((news) => `Title: ${news.Title}, Content: ${news.Description}`).join('\n')}
    `;
    
  
    // Recommendations Prompt
    const recommendationsPrompt = `
     Strategic Recommendations for the Company

          Based on an in-depth analysis of the company’s financial performance, sentiment trends, and recent news coverage, provide actionable strategic recommendations that can enhance the company’s growth, mitigate risks, and strengthen its market position. The analysis should address the following:

            1.	Financial Performance Improvements:
            •	Review key financial metrics such as liquidity, solvency, profitability, and growth trends (e.g., Current Ratio, Net Profit Margin, Return on Equity).
          What steps can the company take to improve underperforming areas? Are there any opportunities for operational efficiency, cost reduction, or improved asset utilization that could enhance financial health?
          Financial Data:
          ${JSON.stringify(datafinance)}
            2.	Addressing Sentiment Concerns:
            •	Based on the sentiment analysis, evaluate how the company can address any negative sentiment from stakeholders (investors, customers, market participants).
          What strategic moves, such as public relations campaigns, customer outreach, or market repositioning, could help counteract negative perceptions and strengthen positive sentiment?
          Sentiment Data:
          ${JSON.stringify(datafinance)}
            3.	Leveraging Positive News and Mitigating Risks:
            •	Summarize any favorable developments from recent news (e.g., new partnerships, innovations) and discuss how the company can capitalize on these strengths to improve market positioning.
          Conversely, identify any risks or challenges mentioned in the news (e.g., competitive threats, regulatory issues), and propose strategies for mitigating these risks. How should the company react to maintain stability and avoid disruption?
          Latest News:
          ${newsData.Results.slice(0, 3).map((news) => news.Title).join(', ')}
            4.	Investment and Growth Strategy:
            •	Recommend strategies for growth and long-term value creation, such as investing in R&D, expanding into new markets, or acquiring strategic assets. What initiatives could drive revenue growth, improve profitability, or increase the company’s competitive edge?
          Additionally, consider any adjustments to the company’s capital structure (e.g., debt management) that may optimize financial leverage.
            5.	Final Recommendations:
            •	Based on the comprehensive analysis of financial performance, sentiment, and news, provide an overall recommendation. Should the company focus on strengthening internal operations, expanding market share, or addressing external risks? What are the key actions the leadership should prioritize to ensure sustained growth and market success?
              `;


     const [executiveSummary, financialSummary, sentimentSummary, newsSummary, recommendations] = await Promise.all([
        getOpenAIResponse(executiveSummaryPrompt),
        getOpenAIResponse(financialSummaryPrompt),
        getOpenAIResponse(sentimentSummaryPrompt),
        getOpenAIResponse(newsSummaryPrompt),
        getOpenAIResponse(recommendationsPrompt)
      ]);
  
    return { executiveSummary, financialSummary, sentimentSummary, newsSummary, recommendations };
  }


export async function getOpenAIResponse(prompt, ttl = 3600) {
    const cacheKey = generateCacheKey(prompt);
    const cachedResponse = await getCachedResponse(cacheKey);
  
  
    if (cachedResponse) {
      return cachedResponse;
    } else {
      try {
        const response = await openai.chat.completions.create({
          model:"gpt-3.5-turbo",
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 500,
        });
  
        await cacheResponse(cacheKey, response, ttl);
        return response;
      } catch (error) {
        console.error('Error fetching OpenAI response:', error);
        return null;
      }
    }
  
  }
  
  