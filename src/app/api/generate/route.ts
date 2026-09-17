import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { generatePlaylistPrompt } from '@/lib/generatePlaylistPrompt';
import { createSpotifyPlaylist, addSongsToPlaylist } from '@/lib/createPlaylist';

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

    // Playlist title, description and list of songs
    const playlist = JSON.parse(response.text ?? '');
    // Playlist is initially empty, so we need the id in order to add songs to it
    const spotifyPlaylistId = await createSpotifyPlaylist(playlist);
    await addSongsToPlaylist(playlist, spotifyPlaylistId);

    // Next requires a return
    return NextResponse.json({
      playlistTitle: playlist.playlistTitle,
      playlistDescription: playlist.playlistDescription
    });
  } catch (err) {
    return NextResponse.json({ error: err });
  }
}