import express from "express";
import { startInterview } from "../controllers/interview.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { submitAnswer } from "../controllers/interview.controller.js";
import { resumeInterview ,  getInterviewResult, getInterviewHistory} from "../controllers/interview.controller.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// 🚀 Start interview
router.post("/start", startInterview);
// Submit answer
router.post("/:sessionId/answer", submitAnswer);
// Resume interview
router.get("/:sessionId/resume", resumeInterview);
// Get result
router.get("/:sessionId/result", getInterviewResult);

// History
router.get("/history/list", getInterviewHistory);

export default router;
