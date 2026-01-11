import { generateSpeechGemini } from "../services/geminiTts.service.js";

//
// 🔊 Speak Controller
//
export const speak = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        message: "Text is required"
      });
    }

    const audioBuffer = await generateSpeechGemini(text);

    res.set({
      "Content-Type": "audio/wav",
      "Content-Length": audioBuffer.length
    });

    res.send(audioBuffer);

  } catch (error) {
    console.error("Gemini TTS Error:", error.message);

    res.status(500).json({
      message: "Failed to generate speech"
    });
  }
};
