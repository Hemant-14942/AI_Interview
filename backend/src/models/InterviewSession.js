import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mode: {
      type: String,
      enum: ["practice", "interview"],
      default: "practice"
    },

    config: {
      topic: {
        type: String,
        required: true
      },

      difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
      },

      questionCount: {
        type: Number,
        required: true
      },

      timePerQuestion: {
        type: Number, // seconds
        required: true
      },

      interviewMode: {
        type: String,
        enum: ["voice", "text"],
        required: true
      },

      personality: {
        type: String,
        default: "friendly"
      }
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending"
    },

    currentQuestionIndex: {
      type: Number,
      default: 0
    },

    finalScore: {
      type: Number
    },

    startedAt: {
      type: Date
    },

    completedAt: {
      type: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("InterviewSession", interviewSessionSchema);
