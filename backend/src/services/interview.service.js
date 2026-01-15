import InterviewSession from "../models/InterviewSession.js";
import InterviewQA from "../models/InterviewQA.js";
import EvaluationMetrics from "../models/EvaluationMetrics.js";
import { generateQuestionAI } from "./ai.service.js";
import { evaluateAnswerAI } from "./ai.service.js";
import { calculateFinalScore } from "../utils/scoring.js";







//
// 🚀 Start Interview Service
//
export const startInterviewService = async ({ userId, config }) => {
  console.log("inside interview service chlo aage");
  

  // 1️⃣ Create session
  const session = await InterviewSession.create({
    userId,
    config,
    status: "in_progress",
    startedAt: new Date()
  });
  console.log("session to ban gya h ab question generate krna h");

  // 2️⃣ Generate first question
 const questionText = await generateQuestionAI({
  topic: config.topic,
  difficulty: config.difficulty,
});
  console.log("question text bnva liyta ab phate gi uski");



  // 3️⃣ Save first question
  await InterviewQA.create({
    sessionId: session._id,
    questionIndex: 0,
    questionText
  });

  return {
    sessionId: session._id,
    questionIndex: 0,
    questionText
  };
};



//
// ➡️ Submit Answer Service
//
export const submitAnswerService = async ({
  sessionId,
  questionIndex,
  answerText,
  timeTaken
}) => {
  console.log("Submitting answer service called for session:", sessionId);

  // 🔍 Fetch session

  const session = await InterviewSession.findById(sessionId);

  if (!session) throw new Error("Session not found");

  if (session.status !== "in_progress") {
    throw new Error("Interview already completed");
  }

  // 1️⃣ Find QA

  console.log("Finding QA for question index:", questionIndex);
    
  const qa = await InterviewQA.findOne({
    sessionId,
    questionIndex
  });

  if (!qa) throw new Error("Question not found");
  console.log("QA found:", qa.questionText);
  // 2️⃣ Evaluate answer
  console.log("Evaluating answer...");
  const evaluation = await evaluateAnswerAI({
  question: qa.questionText,
  answer: answerText
});
  console.log("Answer evaluated:", evaluation);


  // 3️⃣ Update QA
  qa.answerText = answerText;
  qa.timeTaken = timeTaken;
  qa.evaluation = evaluation;
  await qa.save();

  const nextIndex = questionIndex + 1;

  // 4️⃣ Check completion
if (nextIndex >= session.config.questionCount) {

  // 🧮 Fetch all evaluations
  const allQAs = await InterviewQA.find({ sessionId });
  const evaluations = allQAs
    .filter(q => q.evaluation)
    .map(q => q.evaluation);
    console.log("Calculating final score with evaluations:", evaluations);

  const { finalScore, avg } = calculateFinalScore(evaluations);

  // 💾 Save final score in session
  session.status = "completed";
  session.completedAt = new Date();
  session.finalScore = finalScore;

  console.log("Final score calculated:", finalScore);
  await session.save();

  // 📊 Save detailed metrics
  await EvaluationMetrics.create({
    sessionId,
    overallScore: finalScore,
    skillScores: {
      communication: Math.round(avg.clarity * 10),
      technical: Math.round(avg.correctness * 10),
      problemSolving: Math.round(avg.depth * 10),
      confidence: Math.round(avg.confidence * 10)
    },
    strengths: [],
    weaknesses: [],
    aiSummary: "Auto-generated evaluation"
  });
  console.log("Evaluation metrics saved for session:", sessionId);

  return {
    status: "completed",
    finalScore
  };
};


  // 5️⃣ Generate next question
  const previousQAs = await InterviewQA.find({ sessionId })
  .sort({ questionIndex: 1 })
  .select("questionText");

const questionText = await generateQuestionAI({
  topic: session.config.topic,
  difficulty: session.config.difficulty,
  previousQuestions: previousQAs.map(q => q.questionText)
});


  await InterviewQA.create({
    sessionId,
    questionIndex: nextIndex,
    questionText
  });

  // 6️⃣ Update session progress
  session.currentQuestionIndex = nextIndex;
  await session.save();

  return {
    status: "in_progress",
    nextQuestionIndex: nextIndex,
    questionText
  };
};
//
// 🔄 Resume Interview Service
//
export const resumeInterviewService = async (sessionId) => {
  const session = await InterviewSession.findById(sessionId);

  if (!session) throw new Error("Session not found");

  if (session.status !== "in_progress") {
    throw new Error("Interview not active");
  }

  const lastQA = await InterviewQA.findOne({ sessionId })
    .sort({ questionIndex: -1 });

  return {
    sessionId: session._id,
    currentQuestionIndex: session.currentQuestionIndex,
    lastQuestion: lastQA?.questionText || null,
    lastAnswer: lastQA?.answerText || null
  };
};
//
// 📊 Get Interview Result Service
//
export const getInterviewResultService = async (sessionId) => {
  const session = await InterviewSession.findById(sessionId);

  if (!session) throw new Error("Session not found");

  if (session.status !== "completed") {
    throw new Error("Interview not completed yet");
  }

  const metrics = await EvaluationMetrics.findOne({ sessionId });

  return {
    sessionId: session._id,
    finalScore: session.finalScore,
    metrics
  };
};

//
// 📜 Get Interview History Service
//
export const getInterviewHistoryService = async (userId) => {
  const sessions = await InterviewSession.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20);

  return sessions.map((s) => ({
    sessionId: s._id,
    topic: s.config.topic,
    difficulty: s.config.difficulty,
    finalScore: s.finalScore,
    status: s.status,
    completedAt: s.completedAt
  }));
};
