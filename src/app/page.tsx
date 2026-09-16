import Image from 'next/image';
import styles from './page.module.css';
import SpotifyLoginButton from '@/components/spotify-login-button';
import SpotifySearchBar from '@/components/spotify-search-bar';
import GeneratePlaylistForm from '@/components/generate-playlist-form';

export default function Home() {
  return (
    <div className={styles.page}>
      <SpotifyLoginButton />
      {/* <SpotifySearchBar /> */}
      <GeneratePlaylistForm />
    </div>
  );
}
