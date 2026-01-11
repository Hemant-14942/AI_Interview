import openai from "../utils/openai.js";

//
// 🤖 Generate Interview Question using AI
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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ]
  });

  const question = response.choices[0].message.content.trim();

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
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
    console.error("AI JSON parse failed:", raw);
    throw new Error("Invalid AI evaluation format");
  }
};

