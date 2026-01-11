import { transcribeAudio } from "../services/elevenStt.service.js";
import fs from "fs";

//
// 🎤 Speech → Text Controller
//
export const speechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Audio file is required"
      });
    }

    const transcript = await transcribeAudio(req.file.path);

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.json({
      transcript
    });

  } catch (error) {
    console.error("STT Error:", error.message);

    res.status(500).json({
      message: "Speech transcription failed"
    });
  }
};
