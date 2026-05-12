'use client'

export default function SpotifyLoginButton() {
    return (
        <button onClick={() => window.location.href = '/api/login'}>
            Login with Spotify
        </button>
    )
}