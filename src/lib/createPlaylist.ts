import { PlaylistItems } from "@/types/playlist";
import { getValidSpotifyAccessToken } from "./spotifyAuth";
import { NextResponse } from "next/server";
import _ from "lodash";

// Creates an empty spotify playlist on the users account
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

    return data.id;
}

// Specifically for searching with the AI generated list of songs
export async function searchSpotify(searchTerm: string, token: string): Promise<{ title: string; artist: string; uri: string }> {
    const params = new URLSearchParams({
        q: searchTerm,
        type: 'track'
    });

    const response = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();

    let foundSong = data.tracks.items[0];

    return {
        title: foundSong ? foundSong.name : '',
        artist: foundSong ? foundSong.artists[0].name : '',
        uri: foundSong ? foundSong.uri : ''
    };
}

export async function addSongsToPlaylist(playlist: PlaylistItems, playlistId: string) {
    const token = await getValidSpotifyAccessToken();

    // Get the song ID from spotify with each title/artist from the list before making the API call
    let songs = await Promise.all(playlist.songs.map((_playlistSong) => {
        let searchTerm = `track:${_playlistSong.title} artist:${_playlistSong.artist}`;
        return searchSpotify(searchTerm, token);
    }))

    // Make sure the list doesn't include any empty uris (song not found on spotify)
    let songUris = songs.filter((song) => song?.uri).map((song) => song.uri);

    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/items`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            uris: songUris
        })
    });

    return NextResponse.json(response);
}