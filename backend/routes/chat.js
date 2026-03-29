const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");
const User = require("../models/User");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// personalization of news 
router.post("/bhasha-it", async (req, res) => {
  try {
    const { article, userId } = req.body;

    // check validation
    if (!userId || !article || !article.title) {
      return res.status(400).json({
        message: "Invalid input."
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please setup profile first."
      });
    }

    const prompt = `You are 'BhashaSense Guru', an elite AI mentor and news navigator.

User Context:
- Name: ${user.name}
- Role: ${user.occupation}
- Location: ${user.location}
- Goal: ${user.goals}
- Language: ${user.preferredLanguage}
- Recently Liked Topics: ${user.likedTopics.join(", ") || "None yet"}
Article:
- Title: "${article.title}"
- Description: "${article.description || "No description available"}"

Your Tasks:
1. If the current article matches a topic in 'Recently Liked Topics', start your greeting with: "Since you've been interested in ${user.likedTopics[0]} lately, this update is very relevant for you!"
2. Greeting (1 line, personalized)
3. Summary (max 5 lines, in ${user.preferredLanguage})
4. Local Impact (specific to ${user.location} and ${user.occupation})
5. Career Action (EXACTLY 3 bullet points, actionable)
6. Watch Next (EXACTLY 2 trends)
7. Smart Q&A (EXACTLY 3 questions)

Rules:
- No hallucination
- No generic advice
- Keep it practical
Use markdown headings
- Keep tone mentor-like
- Keep total response under 300 words
`;

    //  AI model call
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({
      success: true,
      aiResponse: text
    });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "AI failed",
      details: error.message
    });
  }
});


//  QnA ROUTE
router.post("/ask-it", async (req, res) => {
  try {
    const { userId, question, articleContext } = req.body;

    if (!userId || !question || !articleContext || !articleContext.title) {
      return res.status(400).json({
        message: "Missing required fields."
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!"
      });
    }

    const prompt = `You are BhashaSense AI, a best mentor.

User Context:
- Name: ${user.name}
- Role: ${user.occupation}
- Goal: ${user.goals}
- Language: ${user.preferredLanguage}

Article Title:
${articleContext.title}

Previous AI Summary:
${articleContext.summary || "No summary provided"}

User Question:
"${question}"

Instructions:
- Answer ONLY based on the summary + article context
- Do NOT add external facts
- Keep answer practical and career-focused
- Give clear guidance (2-4 bullet points if needed)
- Use ${user.preferredLanguage}
- Keep answer under 120 words
`;

    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt
    });

    
    const text =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.json({
      success: true,
      reply: text
    });

  } catch (error) {
    console.error("Q&A Error:", error);

    res.status(500).json({
      error: "AI processing failed",
      details: error.message
    });
  }
});

module.exports = router;