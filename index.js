// Import dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

// Configure environment variables
dotenv.config();

if (!process.env.GROQ_API_KEY) {
    console.error("Missing GROQ API Key. Please set GROQ_API_KEY in your .env file.");
    process.exit(1);
}

// Initialize Express app
const app = express();
const port = 3000;

// Middleware
app.use(cors(
    {
        origin: 'http://localhost:5173',
    }
));
app.use(express.json()); // For parsing application/json

// Initialize GROQ client with your API key
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "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",
});

// Function to get GROQ data
async function getGroqData(prompt) {
    try {
        const result = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192',
        });
        return result.choices[0]?.message?.content || '';
    } catch (error) {
        console.error('Error calling GROQ AI API:', error);
        throw error;
    }
}

// POST route to handle GROQ requests
app.post('/api/getcontent', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Missing 'prompt' in request body" });
    }

    try {
        // Execute the GROQ query
        const result = await getGroqData(prompt);
        res.status(200).json({ data: result });
    } catch (error) {
        console.error('GROQ query failed:', error);
        res.status(500).json({ error: 'Failed to fetch data from GROQ' });
    }
});

app.get("/" , async(req,res)=>{
    res.send("hello")
})

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
