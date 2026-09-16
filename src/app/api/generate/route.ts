import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { generatePlaylistPrompt } from '@/lib/generatePlaylistPrompt';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const requestData = await req.json();
    const prompt = generatePlaylistPrompt(requestData.prompt);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    return NextResponse.json({
      output: response.text,
    });

  } catch (err) {
    return NextResponse.json({ error: err });
  }
}
