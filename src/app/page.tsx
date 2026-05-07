import Image from "next/image";
import styles from "./page.module.css";
import SpotifyLoginButton from "@/components/spotify-login-button";

export default function Home() {
  return (
    <div className={styles.page}>
      <SpotifyLoginButton />
    </div>
  );
}
