// Handle response after Spotify authenticates the user
import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;
const HOST = process.env.HOST!;
const PORT = process.env.PORT!;

// Called automatically by Spotify/routes here after auth
export async function GET(req: NextRequest) {
    // Read return query params from spotify redirect URL
    const { searchParams } = new URL(req.url);

    // Spotify temp auth code
    const code = searchParams.get('code');

    if(!code) {
        return NextResponse.json({error: 'No code returned from Spotify'}, {status:400});
    }

    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        }),
    });
    const data = await tokenRes.json();
    // When access token expires
    const expiresAt = Date.now() + data.expires_in * 1000;
    const res = NextResponse.redirect(`http://${HOST}:${PORT}`);

    // Store cookies
    res.cookies.set('spotify_access_token', data.access_token, {
        httpOnly: true,
        path: '/'
    });

    res.cookies.set('spotify_refresh_token', data.refresh_token, {
        httpOnly: true,
        path: '/'
    });

    res.cookies.set('spotify_expires_at', String(expiresAt), {
        httpOnly: true,
        path: '/'
    });

    return res;
}