import { OpenAI } from 'openai';
// Set up the OpenAI instance


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


export async function POST(req) {
  try {

    const { question,raw, company, financial, positiveSentiment, negativeSentiment,sentimentSerie,entities,news } = await req.json();
    console.log('Raw financialData:', raw);

    const merged = {...raw, ...company, ...financial, ...positiveSentiment, ...negativeSentiment, ...sentimentSerie, ...entities, ...news};

    const prompt = `
    You are an advanced financial intelligence assistant designed to help hedge fund investors analyze and gain deep insights into specific companies based on the provided data.   
    Utilize the aggregated data from the company to answer the user's queries comprehensively and accurately. Below is the merged data for the company that will give you a 360 view of it:
  
   ${JSON.stringify(merged, null, 2)}

    User's Question: ${question}

    Answer the question based on the data provided above.
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




