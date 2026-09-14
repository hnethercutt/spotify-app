export type PlaylistRequest = {
    vibe: string;
    notes?: string;
    referenceSongs?: SpotifySong[];
    excludeArtists?: SpotifyArtist[];
    excludeGenres?: string[];
    popularity: 'mainstream' | 'underground' | 'balanced';
    allowDuplicateArtists: boolean;
    includeReferenceSongs: boolean;
    generateTitleAndDescription: boolean;
    songCount: number;
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