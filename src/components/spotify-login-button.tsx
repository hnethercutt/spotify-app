'use client'
import Image from 'next/image';
import './spotify-login-button.css';

export default function SpotifyLoginButton() {
    return (
        <button className="spotify-btn">
            <Image 
             className='spotify-logo'
             onClick={() => window.location.href = '/api/login'}
             src="spotify-logo-white.svg"
             width="32"
             height="32"
             alt="Sign in with Spotify">
            </Image>
            <span>Sign in with Spotify</span>
        </button>
    )
}