// Guest only credentials/makes it so some functions are available without logging in
import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

export async function GET() {
    const authHeader = (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'));
    const res = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${authHeader}`, 
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
        })
    });
    const data = await res.json();
    
    return NextResponse.json(data);
}