import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVEN_API_KEY) {
  throw new Error("ELEVENLABS_API_KEY missing in env");
}

//
// 🎤 Send audio file to ElevenLabs for transcription
//
export const transcribeAudio = async (filePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("model_id", "scribe_v1");   // ElevenLabs STT model

  const response = await axios.post(
    "https://api.elevenlabs.io/v1/speech-to-text",
    form,
    {
      headers: {
        ...form.getHeaders(),
        "xi-api-key": ELEVEN_API_KEY
      }
    }
  );

  return response.data.text;
};
