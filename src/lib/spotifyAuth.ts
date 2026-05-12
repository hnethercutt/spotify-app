import { cookies } from 'next/headers';
import 'server-only';

const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;

// Get a new access token when the current one expires. Ensures user stays logged in
export async function refreshSpotifyAccessToken(refreshToken: string) {
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        })
    });

    return res.json();
}

export async function getValidSpotifyAccessToken() {
    // Get stored cookies from callback
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get('spotify_access_token')?.value;
    const refreshToken = (await cookieStore).get('spotify_refresh_token')?.value;
    const expiresAt = Number((await cookieStore).get('spotify_expires_at')?.value);

    if(accessToken && expiresAt > Date.now()) {
        return accessToken;
    }

    // Access token expired, but we are able to refresh it
    if(refreshToken) {
        // So get a new access token
        const data = await refreshSpotifyAccessToken(refreshToken);
        return data.access_token;
    }
    // User is logged out
    return null;
}