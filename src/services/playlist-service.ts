import { PlaylistRequest, SpotifySong, SpotifyArtist } from "@/types/playlist";
import _ from 'lodash';

export async function generatePlaylist(requestData: PlaylistRequest) {
    const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt: requestData }),
    });
    // Don't need to do anything with the result currently
    const result = await res.json();
}

// For the autocomplete song search bar
export async function fetchSongSearchResults(searchTerm: string): Promise<Array<SpotifySong>> {
    let spotifySongs: SpotifySong[] = [];

    await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=track`).then(async function(_apiResponse) {
        const searchResults = await _apiResponse.json();
        // Need to convert each song to the custom SpotifySong type
        spotifySongs = _.map(searchResults.items, function(_searchResultItem) {
            return {
                title: _searchResultItem.name,
                // Later I need to modify this so featured artists also show
                artist: _searchResultItem.artists[0].name,
                album: _searchResultItem.album.name,
                // 3rd image is the largest, so pulling that one specifically
                coverArtUrl: _searchResultItem.album.images[2].url,
                id: _searchResultItem.id
            }
        });
    }).catch((err: Error) => {
        console.error('Error retrieving search results', err.message);
    });

    return spotifySongs;
}

// For the autocomplete artist search bar
export async function fetchArtistSearchResults(searchTerm: string): Promise<Array<SpotifyArtist>> {
    let spotifyArtists: SpotifyArtist[] = [];

    await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}&type=artist`).then(async function(_apiResponse) {
        const searchResults = await _apiResponse.json();
        // Need to convert each artist to the custom SpotifyArtist type
        spotifyArtists = _.map(searchResults.items, function(_searchResultItem) {
            return {
                name: _searchResultItem.name,
                // Again, the largest image. Need to error handle this on UI side when the url is blank
                imageUrl: _searchResultItem.images[2] ? _searchResultItem.images[2].url : '',
                id: _searchResultItem.id
            }
        });
    }).catch((err: Error) => {
        console.error('Error retrieving search results', err.message);
    });

    return spotifyArtists;
}