// Search for tracks
'use server';
import { NextRequest, NextResponse } from 'next/server';
import { getGuestSpotifyAccessToken } from '@/lib/spotifyAuth';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  // Pulls out the users input/the search term
  const query = searchParams.get('q');
  // Searching for songs doesn't required an authenticated user
  const token = await getGuestSpotifyAccessToken();

  if (query) {
    const params = new URLSearchParams({
      q: query,
      type: 'track',
    });

    const res = await fetch(
      `https://api.spotify.com/v1/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();

    return NextResponse.json(data.tracks);
  } else {
    return NextResponse.json({
      error: 'Query is missing.',
    }, {
      status: 400,
    });
  }
}
