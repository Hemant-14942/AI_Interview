import { GoogleGenAI } from "@google/genai";

// Create Gemini client
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing in env");
}

const client = new GoogleGenAI({ apiKey });

//
// 🧠 Helper: Add WAV header to PCM audio
//
function addWavHeader(pcmData, sampleRate = 24000, numChannels = 1, bitDepth = 16) {
  const byteRate = (sampleRate * numChannels * bitDepth) / 8;
  const blockAlign = (numChannels * bitDepth) / 8;
  const dataSize = pcmData.length;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);

  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  pcmData.copy(buffer, 44);
  return buffer;
}

//
// 🔊 Generate speech using Gemini Preview TTS
//
export const generateSpeechGemini = async (text) => {
  const modelId = "gemini-2.5-flash-preview-tts";

  const response = await client.models.generateContent({
    model: modelId,
    contents: text,
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: "Puck"   // You can try: Kore, Aoede, Fenrir, etc.
          }
        }
      }
    }
  });

  const base64Audio =
    response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

  if (!base64Audio) {
    throw new Error("No audio data received from Gemini");
  }

  const pcmBuffer = Buffer.from(base64Audio, "base64");

  // Convert raw PCM → WAV
  const wavBuffer = addWavHeader(pcmBuffer);

  return wavBuffer;
};
