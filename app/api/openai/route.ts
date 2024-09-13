import { OpenAI } from 'openai';
// Set up the OpenAI instance


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req) {
  try {

    const { financialData } = await req.json();
    console.log('Raw financialData:', financialData);

  
    const prompt = `
     Below is financial data for an electric car company across multiple quarters:
      
      ${financialData}

       Analyze the data and provide a short, concise summary of key financial insights, focusing on trends in revenue, profitability, cash flow, and financial ratios such as margins, liquidity, and debt levels. The summary should be clear and actionable, highlighting important changes or risks that a financial analyst should be aware of. Avoid using any special characters or symbols.
    `;

    console.log("Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    });

    const summary = response.choices[0].message.content.trim();

    console.log("Generated summary:", summary);

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return new Response(JSON.stringify({ message: 'Error generating summary', error: error.message }), { status: 500 });
  }
}

// Helper function to transform the raw financial data for Tesla into the format OpenAI expects
function transformTeslaData(data) {
  const transformed = {
    Results: []
  };

  // Get all the keys except "ChartType" and group by them
  const keys = Object.keys(data[0]).filter(key => key !== 'ChartType');

  // For each key (metric), create a new object and aggregate the values
  keys.forEach(key => {
    const resultObj = {
      Label: key,
      Results: data.map(item => item[key]) // Collect all values for that metric
    };
    transformed.Results.push(resultObj);
  });

  return transformed;
}

// Helper function to format the financial data into natural language
function formatFinancialData(data) {
  let formattedData = '';

  data.Results.forEach(item => {
    formattedData += `${item.Label}:\n${item.Results.join(', ')}\n\n`;
  });

  return formattedData;
}