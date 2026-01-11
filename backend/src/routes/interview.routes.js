import express from "express";
import { startInterview } from "../controllers/interview.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { submitAnswer } from "../controllers/interview.controller.js";
import { resumeInterview ,  getInterviewResult, getInterviewHistory} from "../controllers/interview.controller.js";

const router = express.Router();

// 🚀 Start interview
router.post("/start", protect, startInterview);
// Submit answer
router.post("/:sessionId/answer", protect, submitAnswer);
// Resume interview
router.get("/:sessionId/resume", protect, resumeInterview);
// Get result
router.get("/:sessionId/result", protect, getInterviewResult);

// History
router.get("/history/list", protect, getInterviewHistory);

export default router;
