require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');


const app = express();


const authRouter = require('./route/authRoute');
const { clear } = require('console');



app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));


async function callGroqChatCompletion(messages, jsonMode = false) {
  const apiKey = process.env.GROQ_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not configured.');
  }

  const payload = {
    model: 'llama-3.3-70b-versatile',
    messages: messages,
  };

  if (jsonMode) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API returned an error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "";
};


app.use('/api/auth', authRouter);
app.post('/api/debate', async (req, res) => {
  try {
    const { opinion, history } = req.body;

    if (!opinion) {
      return res.status(400).json({ error: 'Missing original opinion.' });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array of messages.' });
    }

    const systemPrompt = `You're OPPONENT, a live debate sparring partner.
    Always argue the OPPOSITE side of whatever the user just said no matter what it is.
    Keep every reply to 2-3 sentences max. 
    Topic: "${opinion}".`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const reply = await callGroqChatCompletion(messages, false);
    res.json({ reply: reply.trim() });

  } catch (error) {
    console.error('Error in /api/debate: ', error);
    res.status(500).json({ error: error.message || 'An error occurred while contacting the debate model.' });
  }
});


app.post('/api/score', async (req, res) => {
  try {
    const { opinion, history } = req.body;

    if (!opinion) {
      return res.status(400).json({ error: 'Missing original opinion.' });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({ error: 'History must be an array of messages.' });
    }

    const systemPrompt = `You are JUDGE, switching from opponent to referee.
    Evaluate only the user's argument in the transcript.
    Respond with STRICT json only, no markdown fences: { "score": number, "advice": "string", "improvement": "string" }.`;

    const transcript = history
    .map((msg) => `${msg.role === 'user' ? 'user' : 'Opponent'}: ${msg.text}`)
    .join('\n\n');

    const userMessage = `Opinion to debate: "${opinion}"\n\nDebate Transcript:\n${transcript}\n\nPlease evaluate the User's argument.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    const gptResponse = await callGroqChatCompletion(messages, true);

    let cleanedResponse = gptResponse.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
    const scoreJson = JSON.parse(cleanedResponse);
    res.json(scoreJson);

  } catch (error) {
    console.error('Error in /api/score: ', error);
    res.status(500).json({ error: error.message || 'An error occurred while evaluating your debate performance' });
  }
});


const distPath = path.join(__dirname, '../Client/dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
});


mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('Connected to Database!');
  app.listen(3000, () => {
    console.log('Server is running on port 3000')
  });
})
  .catch((error) => {
    console.error('Error connecting to Database!', error)
});