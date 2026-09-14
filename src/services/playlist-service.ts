import { PlaylistRequest, SpotifySong, SpotifyArtist } from "@/types/playlist";
import _ from 'lodash';

export async function generatePlaylist(requestData: PlaylistRequest) {
    const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: requestData }),
    });
    const result = await res.json();
    console.log(result.output);
}

export async function fetchSongSearchResults(searchTerm: string): Promise<Array<SpotifySong>> {
    let spotifySongs: SpotifySong[] = [];

    await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=track`).then(async function(_apiResponse) {
        const searchResults = await _apiResponse.json();
        spotifySongs = _.map(searchResults.items, function(_searchResultItem) {
            return {
                title: _searchResultItem.name,
                artist: _searchResultItem.artists[0].name,
                album: _searchResultItem.album.name,
                coverArtUrl: _searchResultItem.album.images[2].url,
                id: _searchResultItem.id
            }
        });
    }).catch((err: Error) => {
        console.error('Error retrieving search results', err.message);
    });

    return spotifySongs;
}

export async function fetchArtistSearchResults(searchTerm: string): Promise<Array<SpotifyArtist>> {
    let spotifyArtists: SpotifyArtist[] = [];

    await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=artist`).then(async function(_apiResponse) {
        const searchResults = await _apiResponse.json();
        spotifyArtists = _.map(searchResults.items, function(_searchResultItem) {
            return {
                name: _searchResultItem.name,
                imageUrl: _searchResultItem.images[2] ? _searchResultItem.images[2].url : '',
                id: _searchResultItem.id
            }
        });
    }).catch((err: Error) => {
        console.error('Error retrieving search results', err.message);
    });

    return spotifyArtists;
}