// Route user to Spotify's login page when they click login button
import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Spotify credentials
const CLIENT_ID = process.env.CLIENT_ID!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

export async function GET() {
    const scope = 'user-read-private user-read-email'
    const state = crypto.randomBytes(16).toString('hex');

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope,
        redirect_uri: REDIRECT_URI,
        state,
        show_dialog: 'true',
    });
    // Spotify login page
    const url = `https://accounts.spotify.com/authorize?${params.toString()}`;
    
    return NextResponse.redirect(url);
}