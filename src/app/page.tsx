import Image from 'next/image';
import styles from './page.module.css';
import SpotifyLoginButton from '@/components/spotify-login-button';
import SpotifySearchBar from '@/components/spotify-search-bar';

export default function Home() {
  return (
    <div className={styles.page}>
      <SpotifyLoginButton />
      <SpotifySearchBar />
    </div>
  );
}
