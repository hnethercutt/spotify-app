// Search for tracks
import { NextRequest, NextResponse } from 'next/server';
import { getGuestSpotifyAccessToken } from '@/lib/spotifyAuth';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('q');
  // So the same API can be used for both song and artist search bars
  const type = searchParams.get('type');
  const token = await getGuestSpotifyAccessToken();

  if (query && type) {
    const params = new URLSearchParams({
      q: query,
      type: type
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

    if(type === 'track') {
      return NextResponse.json(data.tracks);
    }

    return NextResponse.json(data.artists);
  } else {
    return NextResponse.json({
      error: 'Query is missing.',
    }, {
      status: 400,
    });
  }
}