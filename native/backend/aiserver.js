

const express = require("express");
const app = express();
require('dotenv').config();
const dotenv = require("dotenv");
const { OpenAI } = require("openai"); 


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


app.post("/api/ask", async (req, res) => {
    const { question } = req.body;
  
    if (!question) {
      return res.status(400).json({ reply: "No question provided." });
    }
  
    console.log("Received question:", question);
  
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // change to "gpt-3.5-turbo" if needed
        messages: [{ role: "user", content: question }],
      });
  
      const reply = completion.choices[0]?.message?.content || "No reply from AI.";
      console.log("AI reply:", reply);
  
      res.json({ reply });
    } catch (err) {
      console.error("OpenAI API error:", err.message);
  
      if (err.status === 429) {
        return res.status(429).json({ reply: "Too many requests. Please try again later." });
      }
  
      res.status(500).json({ reply: "Something went wrong with the AI." });
    }
  });

const PORT = 5000;
app.listen(PORT, () => {
  
});
