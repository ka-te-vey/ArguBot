import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Helper to call Groq Chat Completions API
async function callGroqChatCompletion(messages: any[], jsonMode: boolean = false) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured on the server.");
  }

  // We use llama-3.3-70b-versatile as our state-of-the-art Groq model
  const payload: any = {
    model: "llama-3.3-70b-versatile",
    messages: messages,
    temperature: 0.7,
  };

  if (jsonMode) {
    payload.response_format = { type: "json_object" };
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned an error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Debate Counter-argument
  app.post("/api/debate", async (req, res) => {
    try {
      const { opinion, history } = req.body;

      if (!opinion) {
        return res.status(400).json({ error: "Missing original opinion." });
      }
      if (!Array.isArray(history)) {
        return res.status(400).json({ error: "History must be an array of messages." });
      }

      // Format the system prompt for the opponent
      const systemPrompt = `You are OPPONENT, a live debate sparring partner. Always argue the OPPOSITE side of whatever the user just said, no matter what it is. Never break character or say you're an AI. Directly respond to the user's most recent point before advancing your own argument. Keep every reply to 2-3 sentences max — punchy, confident, conversational, no bullet points. Use real rhetorical moves: analogies, reframing, pointed questions. Stay respectful of the person, ruthless only on the argument.

The debate topic started with the user's opinion: "${opinion}". You must hold the opposite stance and refute their arguments.`;

      // Construct messages for Groq Chat API
      const messages = [
        { role: "system", content: systemPrompt },
        ...history.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text
        }))
      ];

      const reply = await callGroqChatCompletion(messages, false);
      res.json({ reply: reply.trim() });
    } catch (error: any) {
      console.error("Error in /api/debate:", error);
      res.status(500).json({ error: error.message || "An error occurred while contacting the debate model." });
    }
  });

  // API Route: Debate Judging and Score
  app.post("/api/score", async (req, res) => {
    try {
      const { opinion, history } = req.body;

      if (!opinion) {
        return res.status(400).json({ error: "Missing original opinion." });
      }
      if (!Array.isArray(history)) {
        return res.status(400).json({ error: "History must be an array of messages." });
      }

      const systemPrompt = `You are JUDGE, switching from opponent to referee. Evaluate ONLY the user's arguments in the transcript. Respond with STRICT JSON only, no markdown fences: { score: number, advice: string, improvement: string }. The score must be a number out of 10 (e.g., 8.5 or 9.0) representing their performance quality. The advice should be 2-3 sentences of constructive rhetorical advice. The improvement should be 1-2 sentences explaining precisely what they should focus on improving.`;

      // Prepare debate transcript for evaluation
      const transcript = history
        .map((msg: any) => `${msg.role === "user" ? "User" : "Opponent"}: ${msg.text}`)
        .join("\n\n");

      const userMessage = `Opinion to debate: "${opinion}"\n\nDebate Transcript:\n${transcript}\n\nPlease evaluate the User's arguments, rhetorical skill, and consistency based on the transcript and output the strict JSON.`;

      const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ];

      const gptResponse = await callGroqChatCompletion(messages, true);

      // Clean markdown fences from response if present
      let cleanedResponse = gptResponse.trim();
      if (cleanedResponse.startsWith("```json")) {
        cleanedResponse = cleanedResponse.substring(7);
      } else if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.substring(3);
      }
      if (cleanedResponse.endsWith("```")) {
        cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3);
      }
      cleanedResponse = cleanedResponse.trim();

      const scoreJson = JSON.parse(cleanedResponse);
      res.json(scoreJson);
    } catch (error: any) {
      console.error("Error in /api/score:", error);
      res.status(500).json({ error: error.message || "An error occurred while evaluating your debate performance." });
    }
  });

  // Serve Frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
