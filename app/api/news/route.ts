import { OpenAI } from 'openai';
// Set up the OpenAI instance


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req) {
  try {

    const { question, raw, company } = await req.json();
    console.log('Raw financialData:', raw);

    const merged = {...raw, ...company}

    const prompt = `
        You are an expert financial analyst specializing in providing insights for hedge fund investors. Analyze the following array of news articles related to a specific company—Tesla. Extract and summarize the key insights, focusing on information that could impact investment decisions. Your summary should highlight:

      •	Significant announcements or events.
      •	Technological advancements or product developments.
      •	Regulatory changes or legal matters.
      •	Market trends and competitor activities.
      •	Potential impacts on the company’s stock price, financial performance, or market position.

    Requirements:

      •	Write a concise, data-driven summary of approximately 200-300 words.
      •	Use a formal and professional tone suitable for hedge fund investors.
      •	Ensure the summary is objective and based solely on the provided articles.
      •	Do not include personal opinions or external information not present in the articles.

       News Articles Data:
    
     ${JSON.stringify(merged, null, 2)}
  `;

  console.log("Sending prompt to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
    });

    const summary = response.choices[0].message.content.trim();

    console.log("Generated summary:", summary);

    return new Response(JSON.stringify({ summary }), { status: 200 });
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return new Response(JSON.stringify({ message: 'Error generating summary', error: error.message }), { status: 500 });
  }
}
