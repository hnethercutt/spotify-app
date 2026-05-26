import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
  let prompt = '';
  try {
    await req.json().then(function(_req) {
      // Temporarily this is just a user submitted prompt
      prompt = _req.prompt;
    });

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
