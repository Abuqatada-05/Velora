import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

// Load configuration
const config = JSON.parse(fs.readFileSync('velora.config.json', 'utf-8'));

function checkForFrontlineKeywords(userMessage) {
  const messageLower = userMessage.toLowerCase();
  return config.frontlineKeywords.some(keyword => messageLower.includes(keyword));
}

app.post('/velora', (req, res) => {
  const userQuestion = req.body.text || "";

  if (checkForFrontlineKeywords(userQuestion)) {
    res.json({ text: config.frontlineResponse });
  } else {
    if (config.introduceOnFirstQuestion) {
      res.json({ text: config.introductionMessage });
    } else {
      res.json({ text: "Let me look that up for you..." });
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Velora listening on port ${PORT}`);
});
