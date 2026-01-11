import mongoose from "mongoose";

const interviewQASchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      index: true
    },

    questionIndex: {
      type: Number,
      required: true
    },

    questionText: {
      type: String,
      required: true
    },

    answerText: {
      type: String
    },

    timeTaken: {
      type: Number // seconds
    },

    evaluation: {
      correctness: Number,
      clarity: Number,
      depth: Number,
      confidence: Number,
      feedback: String
    }
  },
  { timestamps: true }
);

// Prevent duplicate question index per session
interviewQASchema.index(
  { sessionId: 1, questionIndex: 1 },
  { unique: true }
);

export default mongoose.model("InterviewQA", interviewQASchema);
