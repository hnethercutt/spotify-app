'use client';
import Image from 'next/image';
import './spotify-login-button.css';

export default function SpotifyLoginButton() {
  return (
    <button
      className="spotify-btn"
      onClick={() => (window.location.href = '/api/login')}
    >
      <Image
        className="spotify-logo"
        src="spotify-logo-white.svg"
        width="32"
        height="32"
        alt="Sign in with Spotify"
      ></Image>
      <span>Sign in with Spotify</span>
    </button>
  );
}
