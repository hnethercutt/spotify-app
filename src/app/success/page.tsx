'use client'
import { useSearchParams } from "next/navigation";
import { fetchSpotifyPlaylist } from "@/services/playlist-service";
import { useEffect, useState } from "react";
import parse from 'html-react-parser';

export default function Success() {
    const params = useSearchParams();
    const playlistUrl = params.get('playlistUrl');
    const [embed, setEmbed] = useState<string>('');

    useEffect(() => {
        if(playlistUrl) {
            fetchSpotifyPlaylist(playlistUrl).then(function(_embedHtml) {
                setEmbed(_embedHtml);
            });
        }
    }, []);

    return (
        <div>
            {parse(embed)}
        </div>
    )
}