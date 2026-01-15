import OpenAI from "openai";

// ✅ Azure OpenAI Client
const client = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT}`,
  defaultQuery: {
    "api-version": process.env.AZURE_OPENAI_API_VERSION
  },
  defaultHeaders: {
    "api-key": process.env.AZURE_OPENAI_API_KEY
  }
});

//
// 🤖 Generate interview question
//
export const generateQuestionAI = async ({
  topic,
  difficulty,
  previousQuestions = []
}) => {
  const systemPrompt = `
You are a professional technical interviewer.
Ask ONE clear, concise interview question.
Avoid repeating previous questions.
Difficulty: ${difficulty}
Topic: ${topic}
`;

  const userPrompt = `
Previous questions:
${previousQuestions.join("\n")}

Generate next interview question only.
`;

  console.log("🧠 Calling Azure OpenAI for question generation...");

  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT, // deployment name
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const question = response.choices[0].message.content.trim();

  console.log("✅ Azure OpenAI Question Generated:", question);

  return question;
};



//
// 📊 Evaluate Answer using AI
//
export const evaluateAnswerAI = async ({
  question,
  answer
}) => {
  const systemPrompt = `
You are a strict technical interviewer.
Evaluate the candidate answer objectively.
Return ONLY valid JSON in this format:

{
  "correctness": number (0-10),
  "clarity": number (0-10),
  "depth": number (0-10),
  "confidence": number (0-10),
  "feedback": string
}
`;

  const userPrompt = `
Question:
${question}

Candidate Answer:
${answer}
`;

  console.log("🧠 Calling Azure OpenAI for answer evaluation...");

  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT,
    temperature: 0.2,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const raw = response.choices[0].message.content;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("❌ AI JSON parse failed:", raw);
    throw new Error("Invalid AI evaluation format");
  }
};


