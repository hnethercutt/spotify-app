'use client'
import { useSearchParams } from "next/navigation";
import { fetchSpotifyPlaylist } from "@/services/playlist-service";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';
import styles from './success.module.css';

export default function Success() {
    const params = useSearchParams();
    const playlistUrl = params.get('playlistUrl');
    const [embed, setEmbed] = useState<string>('');

    useEffect(() => {
        if (playlistUrl) {
            fetchSpotifyPlaylist(playlistUrl).then(function (_embedHtml) {
                setEmbed(_embedHtml);
            });
        }
    }, [playlistUrl]);

    return (
        <div className={`flex-column ${styles.container}`}>
            <h1>Playlist generated!</h1>
            <div><a href='/generate'>Click here</a> to generate another playlist</div>
            <div className={styles.embed}>
                {parse(embed)}
            </div>
        </div>
    );
}