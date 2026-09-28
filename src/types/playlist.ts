export type PlaylistRequest = {
    vibe: string;
    notes?: string;
    referenceSongs?: SpotifySong[];
    excludeArtists?: SpotifyArtist[];
    excludeGenres?: string[];
    allowDuplicateArtists: boolean;
    includeReferenceSongs: boolean;
    generateTitleAndDescription: boolean;
};

export type SpotifySong = {
    title: string;
    artist: string;
    album: string;
    coverArtUrl: string;
    id: string;
};

export type SpotifyArtist = {
    name: string;
    imageUrl: string;
    id: string;
};

export type PlaylistItems = {
    playlistTitle?: string;
    playlistDescription?: string;
    songs: [{
        title: string;
        artist: string;
    }]
}