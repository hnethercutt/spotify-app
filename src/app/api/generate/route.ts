import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { generatePlaylistPrompt } from '@/lib/generatePlaylistPrompt';
import { createSpotifyPlaylist } from '@/lib/createPlaylist';

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

    const playlist = JSON.parse(response.text ?? '');
    const spotifyPlaylist = await createSpotifyPlaylist(playlist);

    return NextResponse.json({
      playlist: spotifyPlaylist
    });

  } catch (err) {
    return NextResponse.json({ error: err });
  }
}