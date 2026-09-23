import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // 1. Handle CORS so your GitHub Pages site can talk to this backend
  res.setHeader('Access-Control-Allow-Origin', 'https://ericl22.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // 2. Initialize the Gemini SDK. 
    // Vercel automatically maps your Environment Variables to process.env
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    // 3. Send the text back to your GitHub Pages site
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `${error.message}` });
  }
}
