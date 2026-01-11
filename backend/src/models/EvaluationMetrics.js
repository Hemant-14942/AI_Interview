import mongoose from "mongoose";

const evaluationMetricsSchema = new mongoose.Schema(
  {
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewSession",
      required: true,
      unique: true
    },

    overallScore: Number,

    skillScores: {
      communication: Number,
      technical: Number,
      problemSolving: Number,
      confidence: Number
    },

    strengths: [String],
    weaknesses: [String],

    aiSummary: String
  },
  { timestamps: true }
);

export default mongoose.model("EvaluationMetrics", evaluationMetricsSchema);
