
import OpenAI from 'openai';
import fetch from 'node-fetch';   // Correct ESM import for node-fetch
import QuickChart from 'quickchart-js';  // Correct ESM import for QuickChart
import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0/edge';
import { getOpenAIResponseBatch } from '@/app/(dashboard)/dashboard/company/[id]/financial/memoize';
import { prepareData, prepareDataSentiment } from '@/lib/data';


  
export async function POST(req, res) {
  const { accessToken } = await getAccessToken();
  const { userRequest } = req.body;

  const id = '1527';

  try {
    // Fetch all data using Promise.allSettled to ensure partial failures don't crash the process
    const results = await Promise.allSettled([
      prepareDataSentiment({ CompanyId: id, AddNeutralSignal: 'no', periodParams: { periodType: '0' }, PeriodStartDate: '', PeriodEndDate: '', endpoint: 'FinancialCharts' }, accessToken),
      prepareData(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company?CompanyId=${id}`, accessToken),
      prepareData(`https://u4l8p9rz30.execute-api.us-east-2.amazonaws.com/Prod/Company/News?CompanyId=${id}`, accessToken),
      prepareData(`https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/Relations?CompanyId=${id}`, accessToken),
      prepareDataSentiment({ CompanyId: id, AddNeutralSignal: 'no', periodParams: { periodType: '0' }, PeriodStartDate: '', PeriodEndDate: '', endpoint: 'Entities', SignalSource: '1' }, accessToken),
      prepareDataSentiment({ CompanyId: id, AddNeutralSignal: 'no', periodParams: { periodType: '0' }, PeriodStartDate: '', PeriodEndDate: '', FilterSentiment: '1', endpoint: 'Entities', SignalSource: '1' }, accessToken),
      prepareDataSentiment({ CompanyId: id, AddNeutralSignal: 'no', periodParams: { periodType: '0' }, PeriodStartDate: '', PeriodEndDate: '', FilterSentiment: '2', endpoint: 'Entities', SignalSource: '1'  }, accessToken),
      prepareDataSentiment({ CompanyId: id, AddNeutralSignal: 'no', periodParams: { periodType: '0' }, PeriodStartDate: '', PeriodEndDate: '', endpoint: 'SentimenSeries', SignalSource: '1' }, accessToken),
    ]);

    // Extract results from Promise.allSettled
    const [financialsResult, companyResult, newsDataResult, relationResult, entitiesResult, positiveSentimentResult, negativeSentimentResult, sentimentSeriesResult] = results;

    // Handle errors and assign defaults if the request failed
    const financials = financialsResult.status === 'fulfilled' ? financialsResult.value : null;
    const company = companyResult.status === 'fulfilled' ? companyResult.value : null;
    const newsData = newsDataResult.status === 'fulfilled' ? newsDataResult.value : null;
    const relation = relationResult.status === 'fulfilled' ? relationResult.value : null;
    const entities = entitiesResult.status === 'fulfilled' ? entitiesResult.value : [];
    const positiveSentiment = positiveSentimentResult.status === 'fulfilled' ? positiveSentimentResult.value : [];
    const negativeSentiment = negativeSentimentResult.status === 'fulfilled' ? negativeSentimentResult.value : [];
    const sentimentSeries = sentimentSeriesResult.status === 'fulfilled' ? sentimentSeriesResult.value : [];

    // Map financial data to process it
    const quarters = financials?.Results?.find(item => item.Label === 'QUARTER')?.Results || [];
    const datafinance = quarters.map((quarter, index) => {
      const row = { Quarter: quarter };
      financials?.Results?.forEach(({ Label, Results, ChartType }) => {
        if (Label !== 'QUARTER') {
          row[Label] = Results[index];
          row['ChartType'] = ChartType;
        }
      });
      return row;
    });

    // Generate summaries using OpenAI
    const { executiveSummary, financialSummary, sentimentSummary, newsSummary, recommendations } = await generateSummaries({
      datafinance,
      company,
      newsData,
      sentimentSeries,
      entities,
      positiveSentiment,
      negativeSentiment,
    });

    // Format summaries
    const formatSummary = (summary) => summary.replace(/(\d+)\./g, '<br><strong>$1.</strong>').replace(/-/g, '•').replace(/\n/g, '<br>');
    const formattedFinancialSummary = formatSummary(financialSummary);
    const formattedExecutiveSummary = formatSummary(executiveSummary);

    // Generate charts in parallel
    const financialCharts = await generateAllCharts(financials);

    // Prepare data for PDF generation
    const data = {
      executiveSummary: formattedExecutiveSummary,
      financialSummary: formattedFinancialSummary,
      sentimentSummary: sentimentSummary,
      newsSummary: newsSummary,
      recommendations: recommendations,
      companyName: company?.Name,
      financialChart: financialCharts,
      relation,
      company,
    };

    // Generate PDF
    const base64PDF = await generatePDFWithAPI(data) as { response: string };
    if (!base64PDF || !base64PDF.response) {
      throw new Error('Failed to generate PDF');
    }

    // Return the PDF as a response
    const buffer = Buffer.from(base64PDF.response, 'base64');
    return new Response(buffer, {
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

// Utility function to generate charts (generalized for reuse)
async function generateChart(labels, datasets, chartTitle, xAxisTitle, yAxisTitle) {
  const chart = new QuickChart();
  chart.setConfig({
    type: 'bar',
    data: { labels, datasets },
    options: {
      scales: {
        y: { beginAtZero: true, title: { display: true, text: yAxisTitle } },
        x: { title: { display: true, text: xAxisTitle } },
      },
      plugins: { legend: { display: true, position: 'top' }, title: { display: true, text: chartTitle } },
    },
  });
  chart.setWidth(800).setHeight(400).setBackgroundColor('white');
  return await chart.getShortUrl();
}

// Specific chart generation
async function generateLiquiditySolvencyChart(financials) {
  const quarters = financials?.Results?.find(item => item.Label === 'QUARTER')?.Results;
  const currentRatio = financials?.Results?.find(item => item.Label === 'Current Ratio')?.Results.map(Number);
  const quickRatio = financials?.Results?.find(item => item.Label === 'Quick Ratio')?.Results.map(Number);
  const debtToEquity = financials?.Results?.find(item => item.Label === 'Debt-to-Equity Ratio')?.Results.map(Number);
  return generateChart(quarters, [
    { label: 'Current Ratio', data: currentRatio },
    { label: 'Quick Ratio', data: quickRatio },
    { label: 'Debt-to-Equity Ratio', data: debtToEquity }
  ], 'Liquidity & Solvency', 'Quarter', 'Ratio');
}

async function generateProfitabilityChart(financials) {
  const quarters = financials?.Results?.find(item => item.Label === 'QUARTER')?.Results;
  const currentRatio = financials?.Results?.find(item => item.Label === 'Current Ratio')?.Results.map(Number);
  const quickRatio = financials?.Results?.find(item => item.Label === 'Quick Ratio')?.Results.map(Number);
  const debtToEquity = financials?.Results?.find(item => item.Label === 'Debt-to-Equity Ratio')?.Results.map(Number);
  return generateChart(quarters, [
    { label: 'Current Ratio', data: currentRatio },
    { label: 'Quick Ratio', data: quickRatio },
    { label: 'Debt-to-Equity Ratio', data: debtToEquity }
  ], 'Liquidity & Solvency', 'Quarter', 'Ratio');
}


async function  generateChallengesRisksChart(financials) {
  const quarters = financials?.Results?.find(item => item.Label === 'QUARTER')?.Results;
  const currentRatio = financials?.Results?.find(item => item.Label === 'Current Ratio')?.Results.map(Number);
  const quickRatio = financials?.Results?.find(item => item.Label === 'Quick Ratio')?.Results.map(Number);
  const debtToEquity = financials?.Results?.find(item => item.Label === 'Debt-to-Equity Ratio')?.Results.map(Number);
  return generateChart(quarters, [
    { label: 'Current Ratio', data: currentRatio },
    { label: 'Quick Ratio', data: quickRatio },
    { label: 'Debt-to-Equity Ratio', data: debtToEquity }
  ], 'Liquidity & Solvency', 'Quarter', 'Ratio');
}



async function  generateValuationChart(financials) {
  const quarters = financials?.Results?.find(item => item.Label === 'QUARTER')?.Results;
  const currentRatio = financials?.Results?.find(item => item.Label === 'Current Ratio')?.Results.map(Number);
  const quickRatio = financials?.Results?.find(item => item.Label === 'Quick Ratio')?.Results.map(Number);
  const debtToEquity = financials?.Results?.find(item => item.Label === 'Debt-to-Equity Ratio')?.Results.map(Number);
  return generateChart(quarters, [
    { label: 'Current Ratio', data: currentRatio },
    { label: 'Quick Ratio', data: quickRatio },
    { label: 'Debt-to-Equity Ratio', data: debtToEquity }
  ], 'Liquidity & Solvency', 'Quarter', 'Ratio');
}



// Generate all charts in parallel
async function generateAllCharts(financials) {
  const [liquiditySolvencyChart, profitabilityChart, challengesRisksChart, valuationChart] = await Promise.allSettled([
    generateLiquiditySolvencyChart(financials),
    generateProfitabilityChart(financials),
    generateChallengesRisksChart(financials),
    generateValuationChart(financials)
  ]);

  return {
    liquiditySolvencyChart: liquiditySolvencyChart.status === 'fulfilled' ? liquiditySolvencyChart.value : null,
    profitabilityChart: profitabilityChart.status === 'fulfilled' ? profitabilityChart.value : null,
    challengesRisksChart: challengesRisksChart.status === 'fulfilled' ? challengesRisksChart.value : null,
    valuationChart: valuationChart.status === 'fulfilled' ? valuationChart.value : null,
  };
}



// PDF generation function
async function generatePDFWithAPI(data) {
  const templateId = '1209971'; // Use your PDF template ID
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PDF_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ template: { id: templateId, data }, format: 'pdf', output: 'base64', name: 'Company Report' }),
  };
  const response = await fetch('https://us1.pdfgeneratorapi.com/api/v4/documents/generate', options);
  if (!response.ok) {
    throw new Error(`Failed to generate PDF: ${response.statusText}`);
  }
  return await response.json();
}



// Generate summaries using OpenAI
async function generateSummaries({ datafinance, company, newsData, sentimentSeries, entities, positiveSentiment, negativeSentiment }) {
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

    const openAIResponse = await getOpenAIResponseBatch([ executiveSummaryPrompt, financialSummaryPrompt, sentimentSummaryPrompt, newsSummaryPrompt, recommendationsPrompt ]);

    if (!openAIResponse ) {
      throw new Error('OpenAI response is missing or incomplete');
    }

    const [executiveSummary, financialSummary, sentimentSummary, newsSummary, recommendations] = openAIResponse.map(
      (response) => {
        return response?.choices?.[0]?.message?.content?.trim() || 'Summary not available';
      }
    );

     console.log('executiveSummary',executiveSummary.trim());
     console.log('financialSummary', financialSummary);
      console.log('sentimentSummary', sentimentSummary);
      console.log('newsSummary', newsSummary);
      console.log('recommendations', recommendations);

    return  { executiveSummary, financialSummary, sentimentSummary, newsSummary, recommendations };
}