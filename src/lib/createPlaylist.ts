import { PlaylistItems } from "@/types/playlist";
import { getValidSpotifyAccessToken } from "./spotifyAuth";

export async function createSpotifyPlaylist(playlist: PlaylistItems) {
    const token = await getValidSpotifyAccessToken();

    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: playlist.playlistTitle ? playlist.playlistTitle : 'AI Generated Playlist',
            description: playlist.playlistDescription,
            public: true
        }),
    });

    const data = await response.json();

    return data;
}