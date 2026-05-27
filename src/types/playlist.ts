export type PlaylistRequest = {
    vibe: string;
    notes?: string;
    referenceSongs?: {
        title: string;
        artist: string;
    }[];
    languages?: string[];
    excludeArtists?: string[];
    excludeGenres?: string[];
    popularity: 'mainstream' | 'underground' | 'balanced';
    allowDuplicateArtists: boolean;
    includeReferenceSongs: boolean;
    generateTitleAndDescription: boolean;
    songCount: number;
};