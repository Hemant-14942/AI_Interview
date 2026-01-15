import express from "express";
import { speak } from "../controllers/geminiVoice.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔊 Text → Speech
router.post("/speak", speak);

export default router;
