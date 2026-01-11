import express from "express";
import { speechToText } from "../controllers/stt.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🎤 Upload audio → transcript
router.post(
  "/transcribe",
  protect,
  upload.single("audio"),
  speechToText
);

export default router;
