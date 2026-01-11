import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import sttRoutes from "./routes/stt.routes.js";
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Auth routes
app.use("/api/v1/auth", authRoutes);
// Interview routes
app.use("/api/v1/interview", interviewRoutes);
// Voice routes
app.use("/api/v1/voice", voiceRoutes);
// STT routes
app.use("/api/v1/stt", sttRoutes);

export default app;
