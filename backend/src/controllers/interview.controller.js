import { startInterviewService } from "../services/interview.service.js";
import { submitAnswerService } from "../services/interview.service.js";
import { resumeInterviewService , getInterviewResultService, getInterviewHistoryService} from "../services/interview.service.js";


//
// 🚀 Start Interview Controller
//
export const startInterview = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      topic,
      difficulty,
      questionCount,
      timePerQuestion,
      interviewMode,
      personality
    } = req.body;

    if (
      !topic ||
      !difficulty ||
      !questionCount ||
      !timePerQuestion ||
      !interviewMode
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const result = await startInterviewService({
      userId,
      config: {
        topic,
        difficulty,
        questionCount,
        timePerQuestion,
        interviewMode,
        personality
      }
    });

    res.status(201).json(result);

  } catch (error) {
    console.error("Start Interview Error:", error);
    res.status(500).json({
      message: "Failed to start interview"
    });
  }
};
//
// ➡️ Submit Answer Controller
//
export const submitAnswer = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { questionIndex, answerText, timeTaken } = req.body;

    if (!answerText) {
      return res.status(400).json({
        message: "Answer is required"
      });
    }

    const result = await submitAnswerService({
      sessionId,
      questionIndex,
      answerText,
      timeTaken
    });

    res.json(result);

  } catch (error) {
    console.error("Submit Answer Error:", error);
    res.status(400).json({
      message: error.message
    });
  }
};

//
// 🔄 Resume Interview Controller
//
export const resumeInterview = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await resumeInterviewService(sessionId);

    res.json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
//
// 📊 Get Result Controller
//
export const getInterviewResult = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await getInterviewResultService(sessionId);

    res.json(result);

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

//
// 📜 Get History Controller
//
export const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const history = await getInterviewHistoryService(userId);

    res.json(history);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch history"
    });
  }
};